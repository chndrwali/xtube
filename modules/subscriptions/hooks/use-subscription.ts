import { toast } from 'sonner';
import { useClerk } from '@clerk/nextjs';

import { trpc } from '@/trpc/client';

interface UseSubscriptionsProps {
  userId: string;
  isSubscribed: boolean;
  fromVideoId?: string;
}

export const UseSubscriptions = ({ userId, isSubscribed, fromVideoId }: UseSubscriptionsProps) => {
  const clerk = useClerk();
  const utils = trpc.useUtils();

  const subscribe = trpc.subscriptions.create.useMutation({
    onSuccess: () => {
      toast.success('Subscribed');
      //   TODO
      utils.videos.getManySubscribed.invalidate();
      utils.users.getOne.invalidate({ id: userId });

      if (fromVideoId) {
        utils.videos.getOne.invalidate({ id: fromVideoId });
      }
    },
    onError: (error) => {
      toast.error('Ada sesuatu yang salah!');

      if (error.data?.code === 'UNAUTHORIZED') {
        clerk.openSignIn();
      }
    },
  });
  const unsubscribe = trpc.subscriptions.remove.useMutation({
    onSuccess: () => {
      toast.success('Unsubscribed');
      //   TODO
      utils.videos.getManySubscribed.invalidate();
      utils.users.getOne.invalidate({ id: userId });

      if (fromVideoId) {
        utils.videos.getOne.invalidate({ id: fromVideoId });
      }
    },
    onError: (error) => {
      toast.error('Ada sesuatu yang salah!');

      if (error.data?.code === 'UNAUTHORIZED') {
        clerk.openSignIn();
      }
    },
  });

  const isPending = subscribe.isPending || unsubscribe.isPending;

  const onClick = () => {
    if (isSubscribed) {
      unsubscribe.mutate({ userId });
    } else {
      subscribe.mutate({ userId });
    }
  };

  return {
    isPending,
    onClick,
  };
};

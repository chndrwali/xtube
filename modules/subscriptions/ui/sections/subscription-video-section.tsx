'use client';

import { InfiniteScroll } from '@/components/infinite-scroll';
import { DEFAULT_LIMIT } from '@/lib/constant';
import { trpc } from '@/trpc/client';
import Link from 'next/link';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';
import { SubscriptionItem, SubscriptionItemSkeleton } from '../components/subscription-item';

export const SubscriptionVideoSection = () => {
  return (
    <Suspense fallback={<SubscriptionVideoSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <SubscriptionVideoSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const SubscriptionVideoSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 ">
      {Array.from({ length: 8 }).map((_, index) => (
        <SubscriptionItemSkeleton key={index} />
      ))}
    </div>
  );
};

const SubscriptionVideoSectionSuspense = () => {
  const utils = trpc.useUtils();
  const [subscriptions, query] = trpc.subscriptions.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const unsubscribe = trpc.subscriptions.remove.useMutation({
    onSuccess: (data) => {
      toast.success('Unsubscribed');
      //   TODO
      utils.subscriptions.getMany.invalidate();
      utils.videos.getManySubscribed.invalidate();
      utils.users.getOne.invalidate({ id: data.creatorId });
    },
    onError: () => {
      toast.error('Ada sesuatu yang salah!');
    },
  });

  return (
    <>
      <div className="flex flex-col gap-4 ">
        {subscriptions.pages
          .flatMap((page) => page.items)
          .map((subscription) => (
            <Link key={subscription.creatorId} href={`/users/${subscription.user.id}`}>
              <SubscriptionItem
                name={subscription.user.name}
                imageUrl={subscription.user.imageUrl}
                subscriberCount={subscription.user.subscriberCount}
                onUnsubscribe={() => {
                  unsubscribe.mutate({ userId: subscription.creatorId });
                }}
                disabled={unsubscribe.isPending}
              />
            </Link>
          ))}
      </div>

      <InfiniteScroll hasNextPage={query.hasNextPage} fetchNextPage={query.fetchNextPage} isFetchingNextPage={query.isFetchingNextPage} />
    </>
  );
};

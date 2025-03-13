import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { VideoGetOneOutput } from '../../types';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import { SubscriptionButton } from '@/modules/subscriptions/ui/components/subscription-button';
import { UserInfo } from '@/modules/users/ui/components/user-info';

interface VideoOwnerProps {
  user: VideoGetOneOutput['user'];
  videoId: string;
}

export const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {
  const { userId } = useAuth();

  return (
    <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0 ">
      <Link href={`/user/${user.id}`}>
        <div className="flex items-center gap-3 min-w-0 ">
          <UserAvatar size="lg" imageUrl={user.imageUrl} name={user.name} />
          <div className="flex flex-col gap-1 min-w-0">
            <UserInfo name={user.name} className="" size="lg" />
            <span className="text-sm text-muted-foreground line-clamp-1">
              {/* TODO */}
              {0} Subscribers
            </span>
          </div>
        </div>
      </Link>
      {userId === user.clerkId ? (
        <Button asChild variant="secondary" className="rounded-full">
          <Link href={`/studio/videos/${videoId}`}>Edit video</Link>
        </Button>
      ) : (
        <SubscriptionButton onClick={() => {}} disabled={false} isSubscribed={false} className="flex-none" />
      )}
    </div>
  );
};

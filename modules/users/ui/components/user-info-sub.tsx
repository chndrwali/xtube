import { UserAvatar } from '@/components/user-avatar';
import { UserGetOneOutput } from '../../type';
import { useAuth, useClerk } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SubscriptionButton } from '@/modules/subscriptions/ui/components/subscription-button';
import { UseSubscriptions } from '@/modules/subscriptions/hooks/use-subscription';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface UserInfoSubProps {
  user: UserGetOneOutput;
}

export const UserInfoSubSkeleton = () => {
  return (
    <div className="py-6">
      {/* Mobile */}
      <div className="flex flex-col md:hidden">
        <div className="flex items-center gap-3">
          <Skeleton className="h-[60px] w-[60px] rounded-full" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48 mt-1" />
          </div>
        </div>
        <Skeleton className="h-10 w-full mt-3 rounded-full" />
      </div>
      {/* Desktop */}
      <div className="hidden md:flex items-start gap-4">
        <Skeleton className="h-[160px] w-[160px] rounded-full" />
        <div className="flex-1 min-w-0">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-48 mt-4" />
          <Skeleton className="h-10 w-32 mt-3 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const UserInfoSub = ({ user }: UserInfoSubProps) => {
  const { userId, isLoaded } = useAuth();
  const clerk = useClerk();

  const { isPending, onClick } = UseSubscriptions({
    userId: user.id,
    isSubscribed: user.viewerSubscribed,
  });

  return (
    <div className="py-6">
      {/* Mobile layout */}
      <div className="flex flex-col md:hidden ">
        <div className="flex items-center gap-3">
          <UserAvatar
            size="lg"
            imageUrl={user.imageUrl}
            name={user.name}
            className="h-[60px] w-[60px]"
            onClick={() => {
              if (user.clerkId === userId) {
                clerk.openUserProfile();
              }
            }}
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold">{user.name}</h1>
            <div className="flex items-center text-xs gap-1 text-muted-foreground mt-1">
              <span>{user.subscriberCount} Subscribers</span>
              <span>•</span>
              <span>{user.videoCount} Video</span>
            </div>
          </div>
        </div>
        {userId === user.clerkId ? (
          <Button asChild variant="secondary" className="w-full mt-3 rounded-full">
            <Link prefetch href="/studio">
              Ayo ke studio
            </Link>
          </Button>
        ) : (
          <SubscriptionButton isSubscribed={user.viewerSubscribed} onClick={onClick} disabled={isPending || !isLoaded} className="w-full mt-3" />
        )}
      </div>
      {/* Desktop layout */}
      <div className="hidden md:flex items-start gap-4">
        <UserAvatar
          size="xl"
          imageUrl={user.imageUrl}
          name={user.name}
          className={cn(userId === user.clerkId && 'cursor-pointer hover:opacity-80 transition-opacity duration-300')}
          onClick={() => {
            if (user.clerkId === userId) {
              clerk.openUserProfile();
            }
          }}
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-bold">{user.name}</h1>
          <div className="flex items-center text-sm gap-1 text-muted-foreground mt-3">
            <span>{user.subscriberCount} Subscribers</span>
            <span>•</span>
            <span>{user.videoCount} Video</span>
          </div>
          {userId === user.clerkId ? (
            <Button asChild variant="secondary" className=" mt-3 rounded-full">
              <Link prefetch href="/studio">
                Ayo ke studio
              </Link>
            </Button>
          ) : (
            <SubscriptionButton isSubscribed={user.viewerSubscribed} onClick={onClick} disabled={isPending || !isLoaded} className=" mt-3" />
          )}
        </div>
      </div>
    </div>
  );
};

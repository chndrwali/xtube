import { DEFAULT_LIMIT } from '@/lib/constant';
import { HydrateClient, trpc } from '@/trpc/server';
import { SubscriptionView } from '@/modules/subscriptions/ui/views/subscription-view';

export const dynamic = 'force-dynamic';

const Page = async () => {
  void trpc.subscriptions.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <SubscriptionView />
    </HydrateClient>
  );
};

export default Page;

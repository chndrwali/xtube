'use client';

import { DEFAULT_LIMIT } from '@/lib/constant';
import { trpc } from '@/trpc/client';

export const VideoSection = () => {
  const [data] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return <>{JSON.stringify(data)}</>;
};

'use client';

import { trpc } from '@/trpc/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { DEFAULT_LIMIT } from '@/lib/constant';
import { VideoRowCard, VideoRowCardSkeleton } from '@/modules/videos/ui/components/video-row-card';
import { VideoGridCard, VideoGridCardSkeleton } from '@/modules/videos/ui/components/video-grid-card';
import { InfiniteScroll } from '@/components/infinite-scroll';

interface ResultSectionProps {
  query: string | undefined;
  categoryId: string | undefined;
}

export const ResultSection = ({ categoryId, query }: ResultSectionProps) => {
  const isMobile = useIsMobile();
  const [results, resultQuery] = trpc.search.getMany.useSuspenseInfiniteQuery(
    {
      categoryId,
      query,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <>
      {isMobile ? (
        <div className="flex flex-col gap-4 gap-y-10">
          {results.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoGridCard key={video.id} data={video} />
            ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {results.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoRowCard key={video.id} data={video} size="default" />
            ))}
        </div>
      )}
      <InfiniteScroll hasNextPage={resultQuery.hasNextPage} isFetchingNextPage={resultQuery.isFetchingNextPage} fetchNextPage={resultQuery.fetchNextPage} />
    </>
  );
};

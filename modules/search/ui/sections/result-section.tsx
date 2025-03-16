'use client';

import { trpc } from '@/trpc/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { DEFAULT_LIMIT } from '@/lib/constant';
import { VideoRowCard, VideoRowCardSkeleton } from '@/modules/videos/ui/components/video-row-card';
import { VideoGridCard, VideoGridCardSkeleton } from '@/modules/videos/ui/components/video-grid-card';
import { InfiniteScroll } from '@/components/infinite-scroll';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface ResultSectionProps {
  query: string | undefined;
  categoryId: string | undefined;
}

export const ResultSection = ({ categoryId, query }: ResultSectionProps) => {
  return (
    <Suspense key={`${query} - ${categoryId}`} fallback={<ResultSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <ResultSectionSuspense categoryId={categoryId} query={query} />
      </ErrorBoundary>
    </Suspense>
  );
};

const ResultSectionSkeleton = () => {
  return (
    <div>
      <div className="hidden md:flex flex-col gap-4 ">
        {Array.from({ length: 5 }).map((_, index) => (
          <VideoRowCardSkeleton key={index} />
        ))}
      </div>
      <div className="flex flex-col p-4 gap-4 gap-y-10 pt-6 md:hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

const ResultSectionSuspense = ({ categoryId, query }: ResultSectionProps) => {
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

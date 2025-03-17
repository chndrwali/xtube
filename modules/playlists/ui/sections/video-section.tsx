'use client';

import { InfiniteScroll } from '@/components/infinite-scroll';
import { DEFAULT_LIMIT } from '@/lib/constant';
import { VideoGridCard, VideoGridCardSkeleton } from '@/modules/videos/ui/components/video-grid-card';
import { VideoRowCard, VideoRowCardSkeleton } from '@/modules/videos/ui/components/video-row-card';
import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';

interface VideoSectionProps {
  playlistId: string;
}

export const VideoSection = ({ playlistId }: VideoSectionProps) => {
  return (
    <Suspense fallback={<VideoSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <VideoSectionSuspense playlistId={playlistId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideoSkeleton = () => {
  return (
    <>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {Array.from({ length: 18 }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
      <div className="hidden flex-col gap-4 gap-y-4 md:flex">
        {Array.from({ length: 18 }).map((_, index) => (
          <VideoRowCardSkeleton key={index} />
        ))}
      </div>
    </>
  );
};

const VideoSectionSuspense = ({ playlistId }: VideoSectionProps) => {
  const utils = trpc.useUtils();
  const [videos, query] = trpc.playlists.getVideos.useSuspenseInfiniteQuery(
    {
      playlistId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const removeVideo = trpc.playlists.removeVideo.useMutation({
    onSuccess: (data) => {
      toast.success(`video di hapus dari playlist`);
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate({ videoId: data.videoId });
      utils.playlists.getOne.invalidate({ id: data.playlistId });
      utils.playlists.getVideos.invalidate({ playlistId: data.playlistId });
    },
    onError: () => {
      toast.error('ada yang salah');
    },
  });

  return (
    <>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard key={video.id} data={video} onRemove={() => removeVideo.mutate({ playlistId, videoId: video.id })} />
          ))}
      </div>
      <div className="hidden flex-col gap-4 gap-y-4 md:flex">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoRowCard key={video.id} data={video} size="compact" onRemove={() => removeVideo.mutate({ playlistId, videoId: video.id })} />
          ))}
      </div>
      <InfiniteScroll hasNextPage={query.hasNextPage} fetchNextPage={query.fetchNextPage} isFetchingNextPage={query.isFetchingNextPage} />
    </>
  );
};

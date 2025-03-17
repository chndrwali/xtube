import { DEFAULT_LIMIT } from '@/lib/constant';
import { VideoView } from '@/modules/playlists/ui/views/video-view';
import { HydrateClient, trpc } from '@/trpc/server';

interface PageProps {
  params: Promise<{ playlistId: string }>;
}

export const dynamic = 'force-dynamic';

const Page = async ({ params }: PageProps) => {
  const { playlistId } = await params;

  void trpc.playlists.getOne.prefetch({ id: playlistId });
  void trpc.playlists.getVideos.prefetchInfinite({ limit: DEFAULT_LIMIT, playlistId });

  return (
    <HydrateClient>
      <VideoView playlistId={playlistId} />
    </HydrateClient>
  );
};

export default Page;

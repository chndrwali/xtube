import { InfiniteScroll } from '@/components/infinite-scroll';
import { ResponsiveModal } from '@/components/responsive-modal';
import { Button } from '@/components/ui/button';
import { DEFAULT_LIMIT } from '@/lib/constant';
import { trpc } from '@/trpc/client';
import { Loader2Icon, SquareCheckIcon, SquareIcon } from 'lucide-react';
import { toast } from 'sonner';

interface PlaylistAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
}

export const PlaylistAddModal = ({ open, onOpenChange, videoId }: PlaylistAddModalProps) => {
  const utils = trpc.useUtils();

  const {
    data: playlist,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = trpc.playlists.getManyForVideo.useInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
      videoId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: !!videoId && open,
    }
  );

  const addVideo = trpc.playlists.addVideo.useMutation({
    onSuccess: (data) => {
      toast.success(`video di tambahkan ke playlist`);
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate({ videoId });
      utils.playlists.getOne.invalidate({ id: data.playlistId });
      utils.playlists.getVideos.invalidate({ playlistId: data.playlistId });
    },
    onError: () => {
      toast.error('ada yang salah');
    },
  });

  const removeVideo = trpc.playlists.removeVideo.useMutation({
    onSuccess: (data) => {
      toast.success(`video di hapus dari playlist`);
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate({ videoId });
      utils.playlists.getOne.invalidate({ id: data.playlistId });
      utils.playlists.getVideos.invalidate({ playlistId: data.playlistId });
    },
    onError: () => {
      toast.error('ada yang salah');
    },
  });

  return (
    <ResponsiveModal title="Tambah ke playlist" open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col gap-2">
        {isLoading && (
          <div className="flex justify-center p-4">
            <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}
        {!isLoading &&
          playlist?.pages
            .flatMap((page) => page.items)
            .map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start px-2 [&_svg]:size-5"
                size="lg"
                onClick={() => {
                  if (item.containsVideo) {
                    removeVideo.mutate({ playlistId: item.id, videoId });
                  } else {
                    addVideo.mutate({ playlistId: item.id, videoId });
                  }
                }}
                disabled={removeVideo.isPending || addVideo.isPending}
              >
                {item.containsVideo ? <SquareCheckIcon className="mr-2" /> : <SquareIcon className="mr-2" />}
                {item.name}
              </Button>
            ))}
        {!isLoading && <InfiniteScroll fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} isManual />}
      </div>
    </ResponsiveModal>
  );
};

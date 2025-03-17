'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/trpc/client';
import { Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';

interface PlaylistHeaderSectionProps {
  playlistId: string;
}

export const PlaylistHeaderSection = ({ playlistId }: PlaylistHeaderSectionProps) => {
  return (
    <Suspense fallback={<PlaylistHeaderSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <PlaylistHeaderSectionSuspense playlistId={playlistId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const PlaylistHeaderSectionSkeleton = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-y-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-9 w-9 rounded-full" />
    </div>
  );
};

const PlaylistHeaderSectionSuspense = ({ playlistId }: PlaylistHeaderSectionProps) => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const [playlist] = trpc.playlists.getOne.useSuspenseQuery({ id: playlistId });

  const remove = trpc.playlists.remove.useMutation({
    onSuccess: () => {
      toast.success('Playlist di hapus');
      utils.playlists.getMany.invalidate();
      router.push('/playlists');
    },
    onError: () => {
      toast.error('Ada yang salah');
    },
  });

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">{playlist.name}</h1>
        <p className="text-muted-foreground text-xs">Video dari playlist</p>
      </div>
      <Button variant="outline" size="icon" className="rounded-full" onClick={() => remove.mutate({ id: playlistId })} disabled={remove.isPending}>
        <Trash2Icon />
      </Button>
    </div>
  );
};

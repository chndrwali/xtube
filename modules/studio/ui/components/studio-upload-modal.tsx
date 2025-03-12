'use client';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { trpc } from '@/trpc/client';
import { Loader2Icon, PlusIcon } from 'lucide-react';
import { StudioUploader } from './studio-uploader';
import { useRouter } from 'next/navigation';
import { ResponsiveModal } from '@/components/responsive-modal';

export const StudioUploadModal = () => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      toast.success('Video dibuat');
      utils.studio.getMany.invalidate();
    },
  });

  const onSuccess = () => {
    if (!create.data?.video.id) return;

    create.reset();
    router.push(`/studio/videos/${create.data.video.id}`);
  };

  return (
    <>
      <ResponsiveModal title="Unggah Video" open={!!create.data?.url} onOpenChange={() => create.reset()}>
        {create.data?.url ? <StudioUploader endpoint={create.data.url} onSuccess={onSuccess} /> : <Loader2Icon className="animate-spin" />}
      </ResponsiveModal>
      <Button variant="secondary" onClick={() => create.mutate()} disabled={create.isPending}>
        {create.isPending ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
        Buat
      </Button>
    </>
  );
};

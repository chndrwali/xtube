'use client';

import { ResponsiveModal } from '@/components/responsive-modal';
import { Button } from '@/components/ui/button';
import { trpc } from '@/trpc/client';
import { Loader2Icon, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { StudioUploader } from './studio-uploader';

export const StudioUploadModal = () => {
  const utils = trpc.useUtils();
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      toast.success('Video dibuat');
      utils.studio.getMany.invalidate();
    },
  });

  return (
    <>
      <ResponsiveModal title="Unggah Video" open={!!create.data?.url} onOpenChange={() => create.reset()}>
        {create.data?.url ? <StudioUploader endpoint={create.data.url} onSuccess={() => {}} /> : <Loader2Icon className="animate-spin" />}
      </ResponsiveModal>
      <Button variant="secondary" onClick={() => create.mutate()} disabled={create.isPending}>
        {create.isPending ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
        Buat
      </Button>
    </>
  );
};

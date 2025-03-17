import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ListPlusIcon, MoreHorizontalIcon, ShareIcon, Trash2Icon } from 'lucide-react';
import { APP_URL } from '@/lib/constant';
import { useState } from 'react';
import { PlaylistAddModal } from '@/modules/playlists/ui/components/playlist-add-modal';

interface VideoMenuProps {
  videoId: string;
  variant?: 'ghost' | 'secondary';
  onRemove?: () => void;
}

export const VideoMenu = ({ videoId, variant = 'ghost', onRemove }: VideoMenuProps) => {
  const [openPlaylistModal, setOpenPlaylistModal] = useState(false);
  const onCopy = () => {
    const fullUrl = `${APP_URL}/videos/${videoId}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Tautan disalin ke papan klip');
  };

  return (
    <>
      <PlaylistAddModal open={openPlaylistModal} onOpenChange={setOpenPlaylistModal} videoId={videoId} />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size="icon" className="rounded-full">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem onClick={onCopy}>
            <ShareIcon className="mr-2 size-4" />
            Bagikan
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenPlaylistModal(true)}>
            <ListPlusIcon className="mr-2 size-4" />
            Tambah ke playlist
          </DropdownMenuItem>
          {onRemove && (
            <DropdownMenuItem onClick={onRemove}>
              <Trash2Icon className="mr-2 size-4" />
              Hapus
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ListPlusIcon, MoreHorizontalIcon, ShareIcon, Trash2Icon } from 'lucide-react';

interface VideoMenuProps {
  videoId: string;
  variant?: 'ghost' | 'secondary';
  onRemove?: () => void;
}

export const VideoMenu = ({ videoId, variant, onRemove }: VideoMenuProps) => {
  const onCopy = () => {
    const fullUrl = `${process.env.VERCEL_URL || 'http://localhost:3000'}/videos/${videoId}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Tautan disalin ke papan klip');
  };
  return (
    <DropdownMenu>
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
        <DropdownMenuItem onClick={() => {}}>
          <ListPlusIcon className="mr-2 size-4" />
          Tambah ke playlist
        </DropdownMenuItem>
        {onRemove && (
          <DropdownMenuItem onClick={() => {}}>
            <Trash2Icon className="mr-2 size-4" />
            Hapus
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

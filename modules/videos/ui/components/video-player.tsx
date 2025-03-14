import MuxPlayer from '@mux/mux-player-react';
import { THUMBNAIL_FALLBACK } from '@/modules/videos/constant';

interface VideoPlayerProps {
  playbackId?: string | null | undefined;
  thumbnailUrl?: string | null | undefined;
  autoplay?: boolean;
  onPlay?: () => void;
}

export const VideoPlayerSkeleton = () => {
  return <div className="aspect-video bg-black rounded-xl" />;
};

export const VideoPlayer = ({ playbackId, thumbnailUrl, autoplay, onPlay }: VideoPlayerProps) => {
  return <MuxPlayer playbackId={playbackId || ''} poster={thumbnailUrl || THUMBNAIL_FALLBACK} playerInitTime={0} autoPlay={autoplay} thumbnailTime={0} className="w-full h-full object-contain" accentColor="#FF2056" onPlay={onPlay} />;
};

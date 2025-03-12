import { VideoSection } from '../sections/video-section';

export const StudioView = () => {
  return (
    <div className="flex flex-col gap-y-6 pt-2.5">
      <div className="px-4">
        <h1 className="text-2xl font-bold">Konten Saluran</h1>
        <p className="text-xs text-muted-foreground">Kelola saluran konten dan video Anda</p>
      </div>
      <VideoSection />
    </div>
  );
};

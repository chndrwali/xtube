'use client';

import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { PlaylistCreateModal } from '../components/playlist-create-modal';
import { useState } from 'react';
import { PlaylistSection } from '../sections/playlist-section';

export const PlaylistView = () => {
  const [createOpenModal, setCreateOpenModal] = useState(false);

  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <PlaylistCreateModal open={createOpenModal} onOpenChange={setCreateOpenModal} />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Playlist</h1>
          <p className="text-muted-foreground text-xs">Koleksi yang Anda buat</p>
        </div>
        <Button variant="outline" size="icon" className="rounded-full" onClick={() => setCreateOpenModal(true)}>
          <PlusIcon />
        </Button>
      </div>
      <PlaylistSection />
    </div>
  );
};

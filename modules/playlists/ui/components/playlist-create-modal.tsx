import * as z from 'zod';
import { toast } from 'sonner';

import { trpc } from '@/trpc/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { ResponsiveModal } from '@/components/responsive-modal';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface PlaylistCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(1),
});

export const PlaylistCreateModal = ({ open, onOpenChange }: PlaylistCreateModalProps) => {
  const utils = trpc.useUtils();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const create = trpc.playlists.create.useMutation({
    onSuccess: () => {
      toast.success('Playlist dibuat');
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast.error('Ada sesuatu yang salah!');
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    create.mutate({
      name: values.name,
    });
  };

  return (
    <ResponsiveModal title="Buat playlist" open={open} onOpenChange={onOpenChange}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Contoh: Favorite saya" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">Buat</Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};

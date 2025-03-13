import * as z from 'zod';
import { toast } from 'sonner';

import { trpc } from '@/trpc/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { UploadDropzone } from '@/lib/uploadthing';
import { ResponsiveModal } from '@/components/responsive-modal';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface ThumbnailGenerateModalProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  prompt: z.string().min(10),
});

export const ThumbnailGenerateModal = ({ open, videoId, onOpenChange }: ThumbnailGenerateModalProps) => {
  const utils = trpc.useUtils();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const generateThumbnail = trpc.videos.generateThumbnail.useMutation({
    onSuccess: () => {
      toast.success('Pekerjaan latar belakang dimulai');
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast.error('Ada sesuatu yang salah!');
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    generateThumbnail.mutate({
      id: videoId,
      prompt: values.prompt,
    });
  };

  return (
    <ResponsiveModal title="Generate thumbnail" open={open} onOpenChange={onOpenChange}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt</FormLabel>
                <FormControl>
                  <Textarea {...field} className="resize-none" cols={30} rows={5} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button className="" type="submit">
              Generate
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};

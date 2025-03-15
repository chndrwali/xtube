import * as z from 'zod';
import { toast } from 'sonner';
import { useUser, useClerk } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { trpc } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UserAvatar } from '@/components/user-avatar';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

interface CommentFormProps {
  videoId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  variant?: 'comment' | 'reply';
  parentId?: string;
}

const commentSchema = z.object({
  parentId: z.string().uuid().nullish(),
  videoId: z.string().uuid(),
  value: z.string(),
});

export const CommentForm = ({ videoId, onSuccess, parentId, variant = 'comment', onCancel }: CommentFormProps) => {
  const { user } = useUser();
  const clerk = useClerk();
  const utils = trpc.useUtils();
  const create = trpc.comments.create.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId });
      utils.comments.getMany.invalidate({ videoId, parentId });
      form.reset();
      toast.success('Komentar di tambahkan');
      onSuccess?.();
    },
    onError: (error) => {
      toast.error('Ada sesuatu yang salah!');
      if (error.data?.code === 'UNAUTHORIZED') {
        clerk.openSignIn();
      }
    },
  });

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      parentId,
      videoId,
      value: '',
    },
  });

  const handleSubmit = (values: z.infer<typeof commentSchema>) => {
    create.mutate(values);
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <Form {...form}>
      <form className="flex gap-4 group" onSubmit={form.handleSubmit(handleSubmit)}>
        <UserAvatar imageUrl={user?.imageUrl || '/user-placeholder.svg'} name={user?.fullName || 'User'} size="lg" />
        <div className="flex-1">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea {...field} placeholder={variant === 'reply' ? 'Balas komentar ini...' : 'Tambahkan komentar...'} className="resize-none bg-transparent overflow-hidden min-h-0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="justify-end gap-2 mt-2 flex">
            {onCancel && (
              <Button variant="ghost" type="button" size="sm" onClick={handleCancel}>
                Batal
              </Button>
            )}
            <Button type="submit" size="sm" disabled={create.isPending}>
              {variant === 'reply' ? 'Balas' : 'Komentar'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

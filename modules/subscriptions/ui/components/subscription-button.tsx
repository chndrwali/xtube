import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';

interface SubscriptionButtonProps {
  onClick: ButtonProps['onClick'];
  disabled: boolean;
  isSubscribed: boolean;
  className?: string;
  size?: ButtonProps['size'];
}

export const SubscriptionButton = ({ onClick, isSubscribed, disabled, className, size }: SubscriptionButtonProps) => {
  return (
    <Button size={size} variant={isSubscribed ? 'secondary' : 'default'} className={cn('rounded-full', className)} onClick={onClick} disabled={disabled}>
      {isSubscribed ? 'Disubscribe' : 'Subscribe'}
    </Button>
  );
};

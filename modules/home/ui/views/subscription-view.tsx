import { SubscriptionVideoSection } from '../sections/subscriptions-video-section';

export const SubscriptionView = () => {
  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <p className="text-muted-foreground text-xs">Video dari kreator favorit Anda</p>
      </div>
      <SubscriptionVideoSection />
    </div>
  );
};

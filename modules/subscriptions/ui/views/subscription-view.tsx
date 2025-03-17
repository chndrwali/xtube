import { SubscriptionVideoSection } from '../sections/subscription-video-section';

export const SubscriptionView = () => {
  return (
    <div className="max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <div>
        <h1 className="text-2xl font-bold">Semua Subscription</h1>
        <p className="text-muted-foreground text-xs">Lihat dan kelola semua langganan Anda</p>
      </div>
      <SubscriptionVideoSection />
    </div>
  );
};

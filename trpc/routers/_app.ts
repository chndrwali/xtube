import { createTRPCRouter } from '../init';

import { videoRouter } from '@/modules/videos/server/procedures';
import { studioRouter } from '@/modules/studio/server/procedures';
import { categoriesRouter } from '@/modules/categories/server/procedures';
import { videoViewsRouter } from '@/modules/video-views/server/procedures';

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  studio: studioRouter,
  videos: videoRouter,
  videoViews: videoViewsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;

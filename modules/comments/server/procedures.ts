import { z } from 'zod';
import { db } from '@/db';
import { eq, getTableColumns } from 'drizzle-orm';
import { comments, users } from '@/db/schema';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '@/trpc/init';

export const commentsRouter = createTRPCRouter({
  create: protectedProcedure.input(z.object({ videoId: z.string().uuid(), value: z.string() })).mutation(async ({ ctx, input }) => {
    const { id: userId } = ctx.user;
    const { videoId, value } = input;

    const [createdComment] = await db.insert(comments).values({ userId, videoId, value }).returning();

    return createdComment;
  }),
  getMany: baseProcedure.input(z.object({ videoId: z.string().uuid() })).query(async ({ input }) => {
    const { videoId } = input;

    const data = await db
      .select({
        ...getTableColumns(comments),
        user: users,
      })
      .from(comments)
      .where(eq(comments.videoId, videoId))
      .innerJoin(users, eq(comments.userId, users.id));

    return data;
  }),
});

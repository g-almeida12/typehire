import { prisma } from "@/database";
import { cache } from "react";
import { UserEntity, userWithDetailsInclude } from "./entities";
import { cacheLife, cacheTag } from "next/cache";

export const getCachedUser = cache(
  async (userId: string): Promise<UserEntity | null> => {
    "use cache";
    cacheTag(`user-${userId}`);
    cacheLife("days");

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: userWithDetailsInclude,
    });

    if (!user) {
      return null;
    } else {
      return user;
    }
  },
);

export const getCachedUserId = cache(
  async (userId: string): Promise<string | null> => {
    "use cache";
    cacheTag(`user-${userId}`);
    cacheLife("days");

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
      },
    });

    if (!user) {
      return null;
    } else {
      return user.id;
    }
  },
);

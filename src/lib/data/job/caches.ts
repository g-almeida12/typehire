import { prisma } from "@/database";
import { cache } from "react";
import { JobEntity, jobWithDetailsInclude } from "./entities";
import { cacheLife, cacheTag } from "next/cache";

export const getCachedJobById = cache(
  async (
    jobId: string,
    userId: string,
  ): Promise<(JobEntity & { applications: { id: string }[] }) | null> => {
    "use cache";
    cacheTag(`job-${jobId}`);
    cacheLife("days");

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        ...jobWithDetailsInclude,
        applications: { where: { candidateId: userId }, select: { id: true } },
      },
    });

    return job ?? null;
  },
);

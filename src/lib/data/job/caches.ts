import { prisma } from "@/database";
import { cache } from "react";
import { JobEntity, jobWithDetailsInclude } from "./entities";
import { cacheLife, cacheTag } from "next/cache";

export const getCachedJobById = cache(
  async (jobId: string): Promise<JobEntity | null> => {
    "use cache";
    cacheTag(`job-${jobId}`);
    cacheLife("days");

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: jobWithDetailsInclude,
    });

    if (!job) {
      return null;
    } else {
      return job;
    }
  },
);

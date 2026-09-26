import { prisma } from "@/database";
import { cache } from "react";
import { JobEntity, jobWithDetailsInclude } from "./entities";

export const getCachedJobById = cache(
  async (jobId: string): Promise<JobEntity | null> => {
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

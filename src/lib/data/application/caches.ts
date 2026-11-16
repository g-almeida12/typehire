import "server-only";
import { prisma } from "@/database";
import { cache } from "react";
import { ApplicationEntity, applicationWithDetailsInclude } from ".";
import { cacheLife, cacheTag } from "next/cache";
import { JobApplicationStatuses } from "@/lib/modules/application";
import { ApplicationStatus } from "@/database/generated/enums";

const STATUSES = Object.values(ApplicationStatus);

export const getCachedApplicationById = cache(
  async (
    applicationId: string,
    currentUserId: string,
  ): Promise<ApplicationEntity | null> => {
    "use cache";
    cacheTag(`application-${applicationId}`);
    cacheLife("hours");

    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
        OR: [
          { candidateId: currentUserId },
          { job: { createdBy: currentUserId } },
          { job: { company: { createdBy: currentUserId } } },
        ],
      },
      include: applicationWithDetailsInclude,
    });

    return application ?? null;
  },
);

export const getCachedJobApplicationStatuses = cache(
  async (
    jobId: string,
    currentUserId: string,
  ): Promise<JobApplicationStatuses> => {
    "use cache";
    cacheTag(`job-application-statuses-${jobId}`);
    cacheLife("hours");
    
    const statusesCount = await prisma.application.groupBy({
      by: ["status"],
      where: {
        jobId,
        OR: [
          { job: { createdBy: currentUserId } },
          { job: { company: { createdBy: currentUserId } } },
        ],
      },
      _count: true,
    });

    const applicationStatuses = Object.fromEntries(
      [...STATUSES, "ALL"].map((s) => [s, 0]),
    ) as JobApplicationStatuses;
    for (const { status, _count } of statusesCount) {
      applicationStatuses[status] = _count;
      applicationStatuses.ALL += _count;
    }

    return applicationStatuses;
  },
);

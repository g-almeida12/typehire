import { Prisma } from "@/database/generated/client";
import { ApplicationResponsePayload } from "@/lib/modules/application/schemas";

export const applicationWithDetailsInclude = {
  job: {
    select: {
      id: true,
      title: true,
      location: true,
      modality: true,
      level: true,
      fixedSalary: true,
      minSalary: true,
      maxSalary: true,
      hourlySalary: true,
      createdAt: true,
      createdBy: true,
      company: {
        select: {
          id: true,
          name: true,
          image: true,
          website: true,
          members: true,
          createdBy: true,
        },
      },
    },
  },
  candidate: {
    select: {
      id: true,
      name: true,
      email: true,
      resumeUrl: true,
      skills: true,
    },
  },
} satisfies Prisma.ApplicationInclude;

export type ApplicationEntity = Prisma.ApplicationGetPayload<{
  include: typeof applicationWithDetailsInclude;
}>;

export function mapApplicationEntity(
  application: ApplicationEntity,
): ApplicationResponsePayload {
  return {
    id: application.id,
    jobId: application.jobId,
    candidateId: application.candidateId,
    createdAt: application.createdAt,
    feedback: application.feedback,
    feedbackAt: application.feedbackAt,
    status: application.status,
  };
}

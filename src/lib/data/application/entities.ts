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
    candidate: {
      id: application.candidate.id,
      name: application.candidate.name,
      email: application.candidate.email,
      skills: application.candidate.skills,
      resumeUrl: application.candidate.resumeUrl,
    },
    job: {
      id: application.job.id,
      title: application.job.title,
      modality: application.job.modality,
      location: application.job.location,
      level: application.job.level,
      fixedSalary: application.job.fixedSalary,
      hourlySalary: application.job.hourlySalary,
      createdBy: application.job.createdBy,
      intervalSalary:
        application.job.minSalary && application.job.maxSalary
          ? [application.job.minSalary, application.job.maxSalary]
          : null,
      company: {
        id: application.job.company.id,
        name: application.job.company.name,
        image: application.job.company.image,
        website: application.job.company.website,
      },
    },
  };
}

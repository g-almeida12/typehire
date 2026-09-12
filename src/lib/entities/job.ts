import { Prisma } from "@/database/generated/client";
import { JobResponsePayload } from "@/lib/schemas";

export const jobWithDetailsInclude = {
  company: {
    select: {
      id: true,
      name: true,
      image: true,
      website: true,
      size: true,
    },
  },
  creator: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  },
} satisfies Prisma.JobInclude;

export type JobEntity = Prisma.JobGetPayload<{
  include: typeof jobWithDetailsInclude;
}>;

export function mapJobEntity(job: JobEntity): JobResponsePayload {
  return {
    id: job.id,
    title: job.title,
    description: job.description,
    createdAt: job.createdAt,
    creator: job.creator,
    level: job.level,
    modality: job.modality,
    type: job.type,
    skills: job.skills,
    status: job.status,
    fixedSalary: job.fixedSalary,
    hourlySalary: job.hourlySalary,
    intervalSalary:
      job.minSalary && job.maxSalary ? [job.minSalary, job.maxSalary] : null,
    location: job.location,
    company: job.company,
  };
}

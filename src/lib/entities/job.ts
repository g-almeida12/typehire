import { Prisma } from "@/database/generated/client";
import { JobResponsePayload } from "@/utils/schemas";

export const jobWithDetailsSelect = {
  id: true,
  title: true,
  description: true,
  fixedSalary: true,
  minSalary: true,
  maxSalary: true,
  hourlySalary: true,
  type: true,
  level: true,
  modality: true,
  location: true,
  skills: true,
  status: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
  companyId: true,
  company: {
    select: {
      id: true,
      name: true,
      image: true,
      website: true,
      size: true,
    },
  },
} satisfies Prisma.JobSelect;

export type JobEntity = Prisma.JobGetPayload<{
  select: typeof jobWithDetailsSelect;
}>;

export function mapJobEntity(job: JobEntity): JobResponsePayload {
  return {
    id: job.id,
    title: job.title,
    description: job.description,
    createdAt: job.createdAt,
    createdBy: job.createdBy,
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

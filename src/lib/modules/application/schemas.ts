import {
  ApplicationStatus,
  JobLevel,
  JobModality,
  Skill,
} from "@/database/generated/enums";
import { z } from "zod";

const ApplicationBaseSchema = z.object({
  feedback: z.string(),
  feedbackAt: z.iso.datetime({ offset: true }).pipe(z.coerce.date()),
  status: z.enum(ApplicationStatus),
});

export const ApplicationFormFilterSchema = z
  .object({
    status: z.enum(ApplicationStatus),
    jobId: z.string(),
  })
  .partial();
export type ApplicationFormFilterInputPayload = z.input<
  typeof ApplicationFormFilterSchema
>;
export type ApplicationFormFilterOutputPayload = z.output<
  typeof ApplicationFormFilterSchema
>;

export const ApplicationURLFilterSchema = z.object({
  status: z.enum(ApplicationStatus).optional().catch(undefined),
  jobId: z.string().optional().catch(undefined),
});

export const ApplicationCreateSchema = z.object({
  jobId: z.string(),
});
export type ApplicationCreatePayload = z.infer<typeof ApplicationCreateSchema>;

export const ApplicationUpdateSchema = ApplicationBaseSchema.partial();
export type ApplicationUpdatePayload = z.infer<typeof ApplicationUpdateSchema>;

export const ApplicationResponseSchema = ApplicationBaseSchema.extend({
  id: z.string(),
  jobId: z.string(),
  candidateId: z.string(),
  createdAt: z.date(),
  feedback: z.string().nullable(),
  feedbackAt: z.date().nullable(),
  job: z.object({
    id: z.string(),
    title: z.string().min(5, "Título deve ter no mínimo 5 caracteres."),
    fixedSalary: z.number().nullable(),
    intervalSalary: z.tuple([z.number(), z.number()]).nullable(),
    hourlySalary: z.number().nullable(),
    level: z.enum(JobLevel),
    modality: z.enum(JobModality),
    location: z.string().nullable(),
    createdBy: z.string(),
    company: z.object({
      id: z.string(),
      name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres."),
      image: z.string().optional().nullable().default(null),
      website: z.string().optional().nullable().default(null),
    }),
  }),
  candidate: z.object({
    id: z.string(),
    name: z.string(),
    email: z.email(),
    resumeUrl: z.string().nullable(),
    skills: z.array(z.enum(Skill)),
  }),
});
export type ApplicationResponsePayload = z.infer<
  typeof ApplicationResponseSchema
>;

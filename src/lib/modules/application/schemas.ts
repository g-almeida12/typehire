import { ApplicationStatus } from "@/database/generated/enums";
import { z } from "zod";

const ApplicationBaseSchema = z.object({
  feedback: z.string(),
  feedbackAt: z.iso.datetime({ offset: true }).pipe(z.coerce.date()),
  status: z.enum(ApplicationStatus),
});

export const ApplicationFormFilterSchema = z.object({
  status: z.enum(ApplicationStatus),
  jobId: z.string(),
}).partial();
export type ApplicationFormInputFilterPayload = z.input<
  typeof ApplicationFormFilterSchema
>;
export type ApplicationFormOutputFilterPayload = z.output<
  typeof ApplicationFormFilterSchema
>;

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
  createdAt: z.date,
  feedback: z.string().nullable(),
  feedbackAt: z.date().nullable(),
});
export type ApplicationResponsePayload = z.infer<
  typeof ApplicationResponseSchema
>;

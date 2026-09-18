import { z } from "zod";
import { UserPublicResponseSchema } from "./user";
import { JobLevel, JobModality, CompanySize } from "@/database/generated/enums";

const JobSnippetSchema = z.object({
  id: z.string(),
  title: z.string().min(5, "Título deve ter no mínimo 5 caracteres."),
  fixedSalary: z.number().nullable(),
  intervalSalary: z.tuple([z.number(), z.number()]).nullable(),
  hourlySalary: z.number().nullable(),
  level: z.enum(JobLevel),
  modality: z.enum(JobModality),
  location: z.string().nullable(),
  createdAt: z.date(),
});

const CompanyBaseSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres."),
  cnpj: z.string().min(14, "CNPJ inválido fornecido."),
  image: z.string().nullable(),
  website: z.string().nullable(),
  bio: z.string().nullable(),
  size: z.enum(CompanySize),
  members: z.array(
    UserPublicResponseSchema.pick({
      name: true,
      email: true,
      id: true,
    }),
  ),
  createdBy: z.string(),
});

export const CompanyCreateSchema = CompanyBaseSchema.extend({
  image: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
});
export type CompanyCreatePayload = z.infer<typeof CompanyCreateSchema>;

export const CompanyResponseSchema = CompanyBaseSchema.extend({
  id: z.string(),
  jobs: z.array(JobSnippetSchema),
  website: z.string().nullable(),
  bio: z.string().nullable(),
  createdBy: z.string(),
});
export type CompanyResponsePayload = z.infer<typeof CompanyResponseSchema>;

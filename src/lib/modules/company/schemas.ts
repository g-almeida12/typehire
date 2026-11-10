import { z } from "zod";
import { UserPublicResponseSchema } from "@/lib/modules/user/index";
import { JobLevel, JobModality, CompanySize } from "@/database/generated/enums";

const JobSnippetSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(5, "Título deve ter no mínimo 5 caracteres."),
  fixedSalary: z.number().nullable(),
  intervalSalary: z.tuple([z.number(), z.number()]).nullable(),
  hourlySalary: z.number().nullable(),
  level: z.enum(JobLevel),
  modality: z.enum(JobModality),
  location: z.string().nullable(),
  createdAt: z.date(),
});

const CompanyBaseSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter no mínimo 2 caracteres."),
  cnpj: z.string().trim().min(14, "CNPJ inválido fornecido."),
  image: z.string().nullable(),
  website: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .nullable(),
  bio: z.string().trim().min(50, "Descrição muito curta."),
  size: z.enum(CompanySize),
  members: z.array(
    UserPublicResponseSchema.pick({
      name: true,
      email: true,
      id: true,
    }),
  ),
});

export const CompanyCreateSchema = CompanyBaseSchema.extend({
  image: z.string().trim().nullish(),
  website: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .nullish(),
});
export type CompanyCreatePayload = z.infer<typeof CompanyCreateSchema>;

export const CompanyUpdateSchema = CompanyBaseSchema.omit({
  cnpj: true,
}).partial();
export type CompanyUpdatePayload = z.infer<typeof CompanyUpdateSchema>;

export const CompanyResponseSchema = CompanyBaseSchema.extend({
  id: z.string(),
  jobs: z.array(JobSnippetSchema),
  website: z.string().nullable(),
  createdBy: z.string(),
});
export type CompanyResponsePayload = z.infer<typeof CompanyResponseSchema>;

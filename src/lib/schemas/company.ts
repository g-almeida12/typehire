import { z } from "zod";
import { UserPublicResponseSchema } from "./user";

const JobSnippetSchema = z.object({
  id: z.string(),
  title: z.string().min(5, "Título deve ter no mínimo 5 caracteres."),
  fixedSalary: z.number().optional().nullable().default(null),
  intervalSalary: z.tuple([z.number(), z.number()]).optional().nullable().default(null),
  hourlySalary: z.number().optional().nullable().default(null),
  level: z.enum(["ESTAGIÁRIO", "JÚNIOR", "PLENO", "SÊNIOR"]),
  modality: z.enum(["REMOTO", "HÍBRIDO", "PRESENCIAL"]),
  location: z.string().optional().nullable().default(null),
  createdAt: z.date(),
});

const CompanyBaseSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres."),
  cnpj: z.string().min(14, "CNPJ inválido fornecido."),
  image: z.string().optional().nullable().default(null),
  website: z.string().optional().nullable().default(null),
  bio: z.string().optional().nullable().default(null),
  size: z.enum(["STARTUP", "PEQUENA", "MÉDIA", "GRANDE", "MULTINACIONAL"]),
  members: z.array(
    UserPublicResponseSchema.pick({
      name: true,
      email: true,
      id: true
    }),
  ),
  createdBy: z.string(),
});

export const CompanyCreateSchema = CompanyBaseSchema;
export type CompanyCreatePayload = z.infer<typeof CompanyCreateSchema>;

export const CompanyResponseSchema = CompanyBaseSchema.extend({
  id: z.string(),
  jobs: z.array(JobSnippetSchema),
  website: z.string().nullable(),
  bio: z.string().nullable(),
  createdBy: z.string(),
});
export type CompanyResponsePayload = z.infer<typeof CompanyResponseSchema>;

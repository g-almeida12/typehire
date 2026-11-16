import { z } from "zod";
import { Skill } from "@/database/generated/enums";

const OptionalTextSchema = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable();

const CpfSchema = z
  .string()
  .trim()
  .transform((val) => val.replace(/\D+/g, ""))
  .refine((val) => val.length === 11, "CPF inválido digitado.");

const CompanySnippetSchema = z.object({
  id: z.string(),
  image: z.string().nullable(),
  name: z.string().trim(),
  createdBy: z.string(),
});

export const UserUpdateSchema = z
  .object({
    name: z.string().trim().min(2, "Nome deve ter no mínimo 2 caracteres."),
    email: z.email("Email inválido."),
    cpf: CpfSchema,
    location: z
      .union([
        z.literal(""),
        z
          .string()
          .trim()
          .min(5, "Insira a localização no formato 'Cidade, UF'"),
      ])
      .transform((v) => (v === "" ? null : v))
      .nullish(),
    phoneNumber: OptionalTextSchema,
    bio: OptionalTextSchema,
    githubUrl: OptionalTextSchema,
    linkedinUrl: OptionalTextSchema,
    portfolioUrl: OptionalTextSchema,
    resumeUrl: OptionalTextSchema,
    skills: z.array(z.enum(Skill)).transform((v) => [...new Set(v)]),
  })
  .partial();
export type UserUpdatePayload = z.infer<typeof UserUpdateSchema>;

export const UserPublicResponseSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(2, "Nome deve ter no mínimo 2 caracteres."),
  email: z.email("Email inválido."),
  location: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  bio: z.string().nullable(),
  githubUrl: z.string().nullable(),
  linkedinUrl: z.string().nullable(),
  portfolioUrl: z.string().nullable(),
  resumeUrl: z.string().nullable(),
  skills: z.array(z.enum(Skill)).transform((val) => [...new Set(val)]),
  companies: z.array(CompanySnippetSchema),
});
export type UserPublicResponsePayload = z.infer<
  typeof UserPublicResponseSchema
>;

export const UserPrivateResponseSchema = UserPublicResponseSchema.extend({
  cpf: CpfSchema,
});
export type UserPrivateResponsePayload = z.infer<
  typeof UserPrivateResponseSchema
>;

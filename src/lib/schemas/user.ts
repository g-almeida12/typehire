import { z } from "zod";

const CompanySnippetSchema = z.object({
  id: z.string(),
  image: z.string().nullable(),
  name: z.string(),
  createdBy: z.string(),
});

export const UserPublicResponseSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres."),
  email: z.email("Email inválido."),
});
export type UserPublicResponsePayload = z.infer<
  typeof UserPublicResponseSchema
>;

export const UserPrivateResponseSchema = UserPublicResponseSchema.extend({
  email: z.email("Email inválido."),
  cpf: z
    .string()
    .transform((val) => val.replace(/\D+/g, ""))
    .refine((val) => val.length === 11, "CPF inválido digitado."),
  location: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  bio: z.string().nullable(),
  githubUrl: z.string().nullable(),
  linkedinUrl: z.string().nullable(),
  portfolioUrl: z.string().nullable(),
  skills: z.array(z.string()),
  companies: z.array(CompanySnippetSchema),
});
export type UserPrivateResponsePayload = z.infer<
  typeof UserPrivateResponseSchema
>;

export const UserRegisterSchema = UserPrivateResponseSchema.pick({
  name: true,
  email: true,
  cpf: true,
}).extend({
  agreeToTerms: z
    .boolean()
    .refine(
      (val) => val === true,
      "Você deve concordar com os termos e condições.",
    ),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres."),
  image: z.string().optional().nullable(),
});
export type UserRegisterPayload = z.infer<typeof UserRegisterSchema>;

export const UserLoginSchema = z.object({
  email: z.email("Email inválido."),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres."),
});
export type UserLoginPayload = z.infer<typeof UserLoginSchema>;

export const UserUpdateSchema = UserPrivateResponseSchema.omit({
  id: true,
}).partial();
export type UserUpdatePayload = z.infer<typeof UserUpdateSchema>;

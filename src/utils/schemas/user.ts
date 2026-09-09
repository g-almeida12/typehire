import { z } from "zod";

export const UserPublicResponseSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres."),
  email: z.email("Email inválido."),
  image: z.string().optional().nullable().default(null),
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
  password: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres.")
    .optional()
    .nullable()
    .default(null),
});
export type UserPrivateResponsePayload = z.infer<
  typeof UserPrivateResponseSchema
>;

export const UserRegisterSchema = UserPrivateResponseSchema.extend({
  agreeToTerms: z
    .boolean()
    .refine(
      (val) => val === true,
      "Você deve concordar com os termos e condições.",
    ),
});
export type UserRegisterPayload = z.infer<typeof UserRegisterSchema>;

export const UserLoginSchema = z.object({
  email: z.email("Email inválido."),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres."),
});
export type UserLoginPayload = z.infer<typeof UserLoginSchema>;

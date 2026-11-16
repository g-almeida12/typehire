import { z } from "zod";

const CpfSchema = z
  .string()
  .trim()
  .transform((val) => val.replace(/\D+/g, ""))
  .refine((val) => val.length === 11, "CPF inválido digitado.");

export const AuthRegisterSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter no mínimo 2 caracteres."),
  email: z.email("Email inválido."),
  cpf: CpfSchema,
  agreeToTerms: z
    .boolean()
    .refine(
      (val) => val === true,
      "Você deve concordar com os termos e condições.",
    ),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres."),
  image: z.string().optional().nullable(),
});
export type AuthRegisterPayload = z.infer<typeof AuthRegisterSchema>;

export const AuthCompleteProfileSchema = z.object({
  cpf: CpfSchema,
  agreeToTerms: z
    .boolean()
    .refine(
      (val) => val === true,
      "Você deve concordar com os termos e condições.",
    ),
});
export type AuthCompleteProfilePayload = z.infer<
  typeof AuthCompleteProfileSchema
>;

export const AuthLoginSchema = z.object({
  email: z.email("Email inválido."),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres."),
});
export type AuthLoginPayload = z.infer<typeof AuthLoginSchema>;

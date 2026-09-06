import { z } from "zod";

const UserBaseSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres."),
  email: z.email("Email inválido."),
  cpf: z
    .string()
    .transform((val) => val.replace(/\D+/g, ""))
    .refine((val) => val.length === 11, `CPF inválido digitado.`),
  image: z.string().optional(),
  phoneNumber: z
    .string()
    .transform((val) => val.replace(/\D+/g, ""))
    .refine(
      (val) => val.length === 11,
      "Formato esperado de telefone é (55) 9XXXX-XXXX",
    )
    .optional(),
  location: z.string().optional(),
});

export const UserRegisterSchema = UserBaseSchema.extend({
  password: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres.")
    .optional(),
  agreeToTerms: z
    .boolean()
    .refine(
      (val) => val === true,
      "Você deve concordar com os termos e condições.",
    ),
});
export type UserRegisterPayload = z.infer<typeof UserRegisterSchema>;

export const UserLoginSchema = UserBaseSchema.pick({
  email: true,
}).extend({
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres."),
});
export type UserLoginPayload = z.infer<typeof UserLoginSchema>;

export const UserResponseSchema = UserBaseSchema.extend({
  publicId: z.string(),
  image: z.string().nullable(),
  phoneNumber: z
    .string()
    .transform((val) => val.replace(/\D/g, ""))
    .refine(
      (val) => val.length === 11,
      "Formato esperado de telefone é (55) 9XXXX-XXXX",
    )
    .nullable(),
  location: z.string().nullable(),
});
export type UserResponsePayload = z.infer<typeof UserResponseSchema>;

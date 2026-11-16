import { z } from "zod";

export const AuthRegisterSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter no mínimo 2 caracteres."),
  email: z.email("Email inválido."),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres."),
  image: z.string().optional().nullable(),
});
export type AuthRegisterPayload = z.infer<typeof AuthRegisterSchema>;

export const AuthLoginSchema = z.object({
  email: z.email("Email inválido."),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres."),
});
export type AuthLoginPayload = z.infer<typeof AuthLoginSchema>;

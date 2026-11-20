import { z } from "zod";

export const IdSchema = z.string();
export type IdPayload = z.infer<typeof IdSchema>;

export const PaginationSchema = z.object({
  page: z
    .number()
    .min(1, "Página não pode ser menor que 1.")
    .optional()
    .default(1),
  size: z
    .number()
    .min(1, "Tamanho da página não pode ser menor que 1.")
    .optional()
    .default(10),
});
export type PaginationPayload = z.infer<typeof PaginationSchema>;

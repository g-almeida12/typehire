import { z } from "zod";
import { Skill } from "@/database/generated/enums";

const OptionalTextSchema = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable();

const CompanySnippetSchema = z.object({
  id: z.string(),
  image: z.string().nullable(),
  name: z.string().trim(),
  createdBy: z.string(),
});

export const UserResumeSchema = z
  .custom<File>((val) => val instanceof File, {
    error: "O arquivo inserido é inválido.",
    path: ["resumeUrl"]
  })
  .superRefine(async (data, ctx) => {
    if (!data) return;

    // Ensure file size limit of 5MB
    if (data.size > 5 * 1024 * 1024) {
      ctx.addIssue({
        code: "custom",
        path: ["resumeUrl"],
        message: "O arquivo excede o tamanho máximo de 5MB.",
      });
    }

    // Ensure that is a PDF
    const header = data.slice(0, 12);
    const arrayBuffer = await header.arrayBuffer();
    const magicNumbers = new Uint8Array(arrayBuffer);
    if (
      magicNumbers.length < 4 ||
      !(
        magicNumbers[0] === 0x25 &&
        magicNumbers[1] === 0x50 &&
        magicNumbers[2] === 0x44 &&
        magicNumbers[3] === 0x46
      )
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["resumeUrl"],
        message: "O arquivo enviado não é um PDF válido.",
      });
    }
  });
export type UserResumePayload = z.infer<typeof UserResumeSchema>;

export const UserUpdateSchema = z
  .object({
    name: z.string().trim().min(2, "Nome deve ter no mínimo 2 caracteres."),
    email: z.email("Email inválido."),
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

export const UserPrivateResponseSchema = UserPublicResponseSchema;
export type UserPrivateResponsePayload = z.infer<
  typeof UserPrivateResponseSchema
>;

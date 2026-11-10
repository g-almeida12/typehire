import { z } from "zod";
import {
  Skill,
  JobStatus,
  JobLevel,
  JobModality,
  JobType,
  CompanySize,
} from "@/database/generated/enums";

const JobBaseSchema = z.object({
  title: z.string().min(5, "Título deve ter no mínimo 5 caracteres."),
  description: z.string().min(100, "Descrição não pode ser curta demais."),
  fixedSalary: z.number().nullish(),
  intervalSalary: z.tuple([z.number(), z.number()]).nullish(),
  hourlySalary: z.number().nullish(),
  status: z.enum(JobStatus),
  type: z.enum(JobType),
  level: z.enum(JobLevel),
  modality: z.enum(JobModality),
  location: z
    .union([
      z.literal(""),
      z.string().trim().min(5, "Insira a localização no formato 'Cidade, UF'"),
    ])
    .transform((v) => (v === "" ? null : v))
    .nullish(),
  skills: z.array(z.enum(Skill)).transform((arr) => [...new Set(arr)]),
});

function validateJobSchema(
  data: Partial<z.infer<typeof JobBaseSchema>>,
  ctx: z.RefinementCtx,
) {
  if (!data) return;

  // Ensure that when salary is provided, if isn't a freelancer or internship job
  if (
    data.type !== "FREELANCE" &&
    data.level !== "INTERN" &&
    !(data.fixedSalary || data.intervalSalary || data.hourlySalary)
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["root"],
      message: "Um tipo de salário deve ser fornecido.",
    });
  }

  // Ensure that salary is a positive value
  if (
    (data.fixedSalary && data.fixedSalary < 0) ||
    (data.hourlySalary && data.hourlySalary < 0) ||
    (data.intervalSalary &&
      (data.intervalSalary[0] < 0 || data.intervalSalary[1] < 0))
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["root"],
      message: "Valores para salários devem ser positivos.",
    });
  }

  // Ensure that only one type of salary is provided
  if (
    (data.fixedSalary && (data.intervalSalary || data.hourlySalary)) ||
    (data.intervalSalary && (data.fixedSalary || data.hourlySalary)) ||
    (data.hourlySalary && (data.fixedSalary || data.intervalSalary))
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["root"],
      message: "Apenas um tipo de salário pode ser fornecido.",
    });
  }

  // Ensure that when interval salary is provided, the minimun salary is
  // less than the maximum salary
  if (data.intervalSalary && data.intervalSalary[0] > data.intervalSalary[1]) {
    ctx.addIssue({
      code: "custom",
      path: ["intervalSalary"],
      message: "Salário mínimo não pode ser maior que o salário máximo.",
    });
  }

  // Ensure that a remote job does not has a location
  if (data.modality === "REMOTE" && data.location) {
    ctx.addIssue({
      code: "custom",
      path: ["location"],
      message: "Trabalhos remotos não podem ter uma localização definida.",
    });
  }

  // Ensure that a in-person job has a location
  if (data.modality !== "REMOTE" && !data.location) {
    ctx.addIssue({
      code: "custom",
      path: ["location"],
      message: "Trabalhos presenciais precisam ter a localização definida.",
    });
  }
}

export const JobFormFilterSchema = z
  .object({
    title: z.string(),
    type: z.enum(JobType).transform((val) => val ?? undefined),
    level: z.enum(JobLevel).transform((val) => val ?? undefined),
    modality: z.enum(JobModality).transform((val) => val ?? undefined),
    skills: z.array(z.enum(Skill)).transform((arr) => [...new Set(arr)]),
    companyId: z.string(),
  })
  .partial();
export type JobFormFilterInputPayload = z.input<typeof JobFormFilterSchema>;
export type JobFormFilterOutputPayload = z.output<typeof JobFormFilterSchema>;

export const JobURLFilterSchema = z.object({
  title: z.string().optional().catch(undefined),
  type: z.enum(JobType).optional().catch(undefined),
  level: z.enum(JobLevel).optional().catch(undefined),
  modality: z.enum(JobModality).optional().catch(undefined),
  skills: z.preprocess(
    (v: unknown) => (v === undefined ? [] : [v].flat()),
    z
      .array(z.enum(Skill))
      .optional()
      .transform((arr) => [...new Set(arr)])
      .catch([]),
  ),
  companyId: z.string().optional().catch(undefined),
});
export type JobURLFilterPayload = z.infer<typeof JobURLFilterSchema>;

export const JobClientCreateSchema = JobBaseSchema.omit({
  status: true,
}).superRefine(validateJobSchema);
export type JobClientCreatePayload = z.infer<typeof JobClientCreateSchema>;

export const JobServerCreateSchema = JobBaseSchema.omit({ status: true })
  .extend({
    companyId: z.string(),
  })
  .superRefine(validateJobSchema);
export type JobServerCreatePayload = z.infer<typeof JobServerCreateSchema>;

export const JobUpdateSchema =
  JobBaseSchema.partial().superRefine(validateJobSchema);
export type JobUpdatePayload = z.infer<typeof JobUpdateSchema>;

export const JobResponseSchema = JobBaseSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  fixedSalary: z.number().nullable(),
  intervalSalary: z.tuple([z.number(), z.number()]).nullable(),
  hourlySalary: z.number().nullable(),
  location: z.string().nullable(),
  userHasApplied: z.boolean(),
  company: z.object({
    id: z.string(),
    name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres."),
    image: z.string().nullable(),
    website: z.string().nullable(),
    size: z.enum(CompanySize),
    memberIds: z.array(z.string()),
    createdBy: z.string(),
  }),
  creator: z.object({
    id: z.string(),
    name: z.string(),
    email: z.email(),
  }),
});
export type JobResponsePayload = z.infer<typeof JobResponseSchema>;

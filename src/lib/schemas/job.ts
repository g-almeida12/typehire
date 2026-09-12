import { z } from "zod";

const JobBaseSchema = z.object({
  title: z.string().min(5, "Título deve ter no mínimo 5 caracteres."),
  description: z.string().min(100, "Descrição não pode ser curta demais."),
  fixedSalary: z.number().optional().nullable().default(null),
  intervalSalary: z
    .tuple([z.number(), z.number()])
    .optional()
    .nullable()
    .default(null),
  hourlySalary: z.number().optional().nullable().default(null),
  status: z.enum(["ABERTA", "FECHADA", "PAUSADA"]),
  type: z.enum(["INTEGRAL", "MEIO_PERÍODO", "FREELANCER"]),
  level: z.enum(["ESTAGIÁRIO", "JÚNIOR", "PLENO", "SÊNIOR"]),
  modality: z.enum(["REMOTO", "HÍBRIDO", "PRESENCIAL"]),
  location: z.string().optional().nullable().default(null),
  skills: z.array(z.string()),
});

function validateJobSchema(
  data: Partial<z.infer<typeof JobBaseSchema>>,
  ctx: z.RefinementCtx,
) {
  if (!data) return;

  // Ensure that a salary is provided, if isn't a freelancer or internship job
  if (
    data.type !== "FREELANCER" &&
    data.level !== "ESTAGIÁRIO" &&
    !(data.fixedSalary || data.intervalSalary || data.hourlySalary)
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["root"],
      message: "Um tipo de salário deve ser fornecido.",
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

  // Ensure that a remote job does not has a location
  if (data.modality === "REMOTO" && data.location) {
    ctx.addIssue({
      code: "custom",
      path: ["root"],
      message: "Trabalhos remotos não podem ter uma localização definida.",
    });
  }
}

export const JobCreateSchema = JobBaseSchema.omit({ status: true })
  .extend({
    companyId: z.string(),
    createdBy: z.string(),
  })
  .superRefine(validateJobSchema);
export type JobCreatePayload = z.infer<typeof JobCreateSchema>;

export const JobUpdateSchema =
  JobBaseSchema.partial().superRefine(validateJobSchema);

export const JobResponseSchema = JobBaseSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  fixedSalary: z.number().nullable(),
  intervalSalary: z.tuple([z.number(), z.number()]).nullable(),
  hourlySalary: z.number().nullable(),
  location: z.string().nullable(),
  company: z.object({
    id: z.string(),
    name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres."),
    image: z.string().optional().nullable().default(null),
    website: z.string().optional().nullable().default(null),
    size: z.enum(["STARTUP", "PEQUENA", "MÉDIA", "GRANDE", "MULTINACIONAL"]),
  }),
  creator: z.object({
    id: z.string(),
    name: z.string(),
    email: z.email(),
    image: z.string().nullable(),
  }),
});
export type JobResponsePayload = z.infer<typeof JobResponseSchema>;

import { z } from "zod";
import {
  Skill,
  JobStatus,
  JobLevel,
  JobModality,
  JobType,
} from "@/database/generated/enums";

const JobBaseSchema = z.object({
  title: z.string().min(5, "Título deve ter no mínimo 5 caracteres."),
  description: z.string().min(100, "Descrição não pode ser curta demais."),
  fixedSalary: z.number().optional().nullable(),
  intervalSalary: z.tuple([z.number(), z.number()]).optional().nullable(),
  hourlySalary: z.number().optional().nullable(),
  status: z.enum(JobStatus),
  type: z.enum(JobType),
  level: z.enum(JobLevel),
  modality: z.enum(JobModality),
  location: z
    .string()
    .min(5, "Insira a localização no formato 'cidade, UF'")
    .optional()
    .nullable(),
  skills: z.array(z.enum(Skill)),
});

function validateJobSchema(
  data: Partial<z.infer<typeof JobBaseSchema>>,
  ctx: z.RefinementCtx,
) {
  if (!data) return;

  // Ensure that when salary is provided, if isn't a freelancer or internship job
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
  if (data.modality === "REMOTO" && data.location) {
    ctx.addIssue({
      code: "custom",
      path: ["root"],
      message: "Trabalhos remotos não podem ter uma localização definida.",
    });
  }
}

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
  }),
});
export type JobResponsePayload = z.infer<typeof JobResponseSchema>;

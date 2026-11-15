import "server-only";
import { z } from "zod";

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1),
  BETTER_AUTH_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  NODEMAILER_EMAIL: z.string().min(1),
  NODEMAILER_APP_PASSWORD: z.string().min(1),
});

export const ENV = serverSchema.parse(process.env);
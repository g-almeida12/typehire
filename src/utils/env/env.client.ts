import { z } from "zod";

const clientSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z.string().min(1),
});

export const ENV_CLIENT = clientSchema.parse({
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
});
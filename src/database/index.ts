import "server-only";
import { ENV } from "@/utils/env/env.server";
import { PrismaClient } from "./generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

export const prisma  = new PrismaClient({
  adapter: new PrismaPg({ connectionString: ENV.DATABASE_URL }),
});

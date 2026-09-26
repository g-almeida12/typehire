import { prisma } from "@/database";
import { cache } from "react";
import { CompanyEntity, companyWithDetailsInclude } from ".";
import { cacheLife, cacheTag } from "next/cache";

export const getCachedCompanyById = cache(
  async (companyId: string): Promise<CompanyEntity | null> => {
    "use cache";
    cacheTag(`company-${companyId}`);
    cacheLife("weeks");

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: companyWithDetailsInclude,
    });
    if (!company) {
      return null;
    } else {
      return company;
    }
  },
);

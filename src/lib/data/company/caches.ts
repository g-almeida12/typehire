import { prisma } from "@/database";
import { cache } from "react";
import { CompanyEntity, companyWithDetailsInclude } from ".";

export const getCachedCompanyById = cache(
  async (companyId: string): Promise<CompanyEntity | null> => {
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

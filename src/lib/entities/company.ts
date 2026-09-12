import { CompanyResponsePayload } from "@/lib/schemas/company";
import { Prisma } from "@/database/generated/client";

export const companyWithDetailsInclude = {
  members: {
    select: {
      user: {
        select: { id: true, name: true, image: true, email: true },
      },
    },
  },
  jobs: {
    select: {
      id: true,
      title: true,
      location: true,
      modality: true,
      level: true,
      fixedSalary: true,
      minSalary: true,
      maxSalary: true,
      hourlySalary: true,
      createdAt: true,
    },
  },
} satisfies Prisma.CompanyInclude;

export type CompanyEntity = Prisma.CompanyGetPayload<{
  include: typeof companyWithDetailsInclude;
}>;

export function mapCompanyEntity(
  company: CompanyEntity,
): CompanyResponsePayload {
  return {
    name: company.name,
    image: company.image,
    cnpj: company.cnpj,
    createdBy: company.createdBy,
    id: company.id,
    jobs: company.jobs.map((j) => ({
      ...j,
      intervalSalary:
        j.minSalary && j.maxSalary ? [j.minSalary, j.maxSalary] : null,
    })),
    members: company.members.map((m) => m.user),
    size: company.size,
    bio: company.bio,
    website: company.website,
  };
}

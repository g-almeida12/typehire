import { CompanyResponsePayload } from "@/utils/schemas/company";
import { Prisma } from "@/database/generated/client";

export const companyWithDetailsSelect = {
  id: true,
  name: true,
  image: true,
  cnpj: true,
  website: true,
  bio: true,
  size: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
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
} satisfies Prisma.CompanySelect; 

export type CompanyEntity = Prisma.CompanyGetPayload<{
  select: typeof companyWithDetailsSelect;
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

import { Prisma } from "@/database/generated/client";
import {
  UserPrivateResponsePayload,
  UserPublicResponsePayload,
} from "@/lib/schemas/user";

export const userWithDetailsInclude = {
  companies: {
    include: {
      company: {
        select: {
          id: true,
          name: true,
          image: true,
          createdBy: true,
        },
      },
    },
  },
} satisfies Prisma.UserInclude;

export type UserEntity = Prisma.UserGetPayload<{
  include: typeof userWithDetailsInclude;
}>;

export function mapPublicUserEntity(
  user: Omit<UserEntity, 'companies'>,
): UserPublicResponsePayload {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export function mapPrivateUserEntity(
  user: UserEntity,
): UserPrivateResponsePayload {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    cpf: user.cpf!,
    location: user.location,
    phoneNumber: user.phoneNumber,
    skills: user.skills,
    bio: user.bio,
    githubUrl: user.githubUrl,
    linkedinUrl: user.linkedinUrl,
    portfolioUrl: user.portfolioUrl,
    companies: user.companies.map((c) => c.company),
  };
}

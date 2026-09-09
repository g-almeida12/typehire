import { Prisma } from "@/database/generated/client";
import {
  UserPrivateResponsePayload,
  UserPublicResponsePayload,
} from "@/utils/schemas/user";

export type UserEntity = Prisma.UserGetPayload<{}>;

export function mapPublicUserEntity(
  user: UserEntity,
): UserPublicResponsePayload {
  return {
    id: user.id,
    name: user.name,
    image: user.image,
    email: user.email,
  };
}

export function mapPrivateUserEntity(
  user: UserEntity,
): UserPrivateResponsePayload {
  return {
    id: user.id,
    name: user.name,
    image: user.image,
    email: user.email,
    cpf: user.cpf!,
    password: user.password,
  };
}

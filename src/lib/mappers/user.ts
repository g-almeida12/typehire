import { UserEntity } from "@/types/user";
import { UserResponsePayload } from "@/utils/schemas/user";

export function mapUserEntity(user: UserEntity): UserResponsePayload {
  return {
    publicId: user.publicId,
    name: user.name,
    email: user.email,
    cpf: user.cpf,
    location: user.location,
    image: user.image,
    phoneNumber: user.phoneNumber,
  };
}
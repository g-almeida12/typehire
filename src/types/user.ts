export type UserEntity = {
  id: string;
  publicId: string;
  name: string;
  email: string;
  cpf: string;
  agreeToTerms: boolean;
  location: string | null;
  image: string | null;
  phoneNumber: string | null;
};
import { BackButton } from "@/components/common/BackButton";
import { ProfileUpdateForm } from "@/components/profile/ProfileUpdateForm";
import { Skill } from "@/database/generated/enums";
import { getUserData } from "@/lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atualizar perfil do usuário | TypeHire",
  description:
    "Atualize suas informações pessoais e melhore o seu resultado na hora da contratação.",
};

export default async function ProfileUpdate() {
  const user = (await getUserData())!;

  return (
    <main  className="pb-4">
      <div className="size-6 mt-4">
        <BackButton />
      </div>

      <h1 className="my-8 text-2xl font-semibold">
        Atualize seus dados pessoais
      </h1>

      <section>
        <ProfileUpdateForm
          user={user}
          skills={Object.values(Skill).toSorted()}
        />
      </section>
    </main>
  );
}

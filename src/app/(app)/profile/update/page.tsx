import { BackButton } from "@/components/common/BackButton";
import { ProfileUpdateForm } from "@/components/user/ProfileUpdateForm";
import { getCurrentUserData } from "@/lib/data/user/index";
import { Metadata } from "next";

export default async function ProfileUpdate() {
  const user = (await getCurrentUserData())!;

  return (
    <main className="pb-4">
      <section>
        <div className="size-6 mt-4">
          <BackButton />
        </div>

        <h1 className="mt-8 mb-6 text-2xl font-semibold">
          Atualize seus dados pessoais
        </h1>
      </section>

      <section>
        <ProfileUpdateForm
          user={user}
          key={user.id}
        />
      </section>
    </main>
  );
}

export const metadata: Metadata = {
  title: "Atualizar perfil do usuário | TypeHire",
  description:
    "Atualize suas informações pessoais e melhore o seu resultado na hora da contratação.",
};
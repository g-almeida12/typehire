import { BackButton } from "@/components/common/BackButton";
import {
  SkeletonText,
  SkeletonInput,
  SkeletonSocialMedias,
  SkeletonSkills,
  SkeletonButton,
} from "@/components/skeletons";
import { ProfileUpdateForm } from "@/components/user/ProfileUpdateForm";
import { getCurrentUserData } from "@/lib/data/user";
import { Metadata } from "next";
import { Suspense } from "react";

export default function ProfileUpdate() {
  return (
    <main className="w-full max-w-lg mx-auto pb-4">
      <section>
        <div className="mt-4">
          <BackButton />
        </div>

        <h1 className="mt-8 mb-6 text-2xl font-semibold">
          Atualize seus dados pessoais
        </h1>
      </section>

      <Suspense fallback={<ProfileFormSectionFallback />}>
        <ProfileFormSection />
      </Suspense>
    </main>
  );
}

async function ProfileFormSection() {
  const user = (await getCurrentUserData())!;

  return (
    <section>
      <ProfileUpdateForm user={user} key={user.id} />
    </section>
  );
}

function ProfileFormSectionFallback() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true">
      <div>
        <SkeletonText customClassName=" w-60 h-5 mb-6 rounded-md bg-background-200" />

        {/* Inputs */}
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <SkeletonInput variant="input" key={`input-${idx}`} />
          ))}
          <SkeletonInput variant="textarea" />
        </div>
      </div>

      {/* Social medias */}
      <div>
        <SkeletonText customClassName=" w-60 h-5 mb-6 rounded-md bg-background-200" />
        <SkeletonSocialMedias />
      </div>

      {/* Skills */}
      <div>
        <SkeletonText customClassName="w-60 h-5 mb-6 rounded-md bg-background-200" />
        <SkeletonInput variant="input" />
        <div className="mt-4">
          <SkeletonSkills />
        </div>
      </div>

      <div>
        <SkeletonButton />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Atualizar perfil do usuário | TypeHire",
  description:
    "Atualize suas informações pessoais e melhore o seu resultado na hora da contratação.",
};

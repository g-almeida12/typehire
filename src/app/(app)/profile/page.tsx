import { BackButton } from "@/components/common/BackButton";
import { getCurrentUserData } from "@/lib/data/user";
import { Metadata } from "next";
import { ProfileHeaderSection } from "@/components/user/sections/ProfileHeaderSection";
import { ProfileSocialMediasSection } from "@/components/user/sections/ProfileSocialMediasSection";
import { ProfileSkillsSection } from "@/components/user/sections/ProfileSkillsSection";
import { ProfileMembershipsSection } from "@/components/user/sections/ProfileMembershipsSection";
import { SkeletonProfileContent } from "@/components/skeletons";
import { Suspense } from "react";
import { AuthActionsWrapper } from "@/components/(auth)/AuthActionsWrapper";

export default function ProfilePage() {
  return (
    <main className="w-full max-w-lg pb-4 mx-auto">
      <section>
        <div className="mt-4">
          <BackButton />
        </div>
      </section>

      <Suspense fallback={<SkeletonProfileContent isCurrentUser />}>
        <ProfileContent />
      </Suspense>
    </main>
  );
}

async function ProfileContent() {
  const user = (await getCurrentUserData())!;

  return (
    <>
      <ProfileHeaderSection user={user} userProfileType="edit" />

      <hr className="mt-4 mb-8" />

      <div className="flex flex-col gap-8">
        <ProfileSocialMediasSection user={user} />
        <ProfileSkillsSection skills={user.skills} isOwner={true} />
        <ProfileMembershipsSection
          companies={user.companies}
          userId={user.id}
          isOwner={true}
        />
      </div>

      {/* Session */}
      <section className="mt-8">
        <h2 className="mb-2 text-xl font-medium">Gerenciamento da sessão</h2>
        <AuthActionsWrapper />
      </section>
    </>
  );
}

export const metadata: Metadata = {
  title: "Perfil do usuário | TypeHire",
  description:
    "Veja suas informações pessoais como nome, email e descrição que serão vistas pelos recrutadores.",
};

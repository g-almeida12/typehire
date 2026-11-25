import { BackButton } from "@/components/common/BackButton";
import { getCurrentUserData } from "@/lib/data/user";
import { Metadata } from "next";
import { ProfileHeaderSection } from "@/components/user/sections/ProfileHeaderSection";
import { ProfileSocialMediasSection } from "@/components/user/sections/ProfileSocialMediasSection";
import { ProfileSkillsSection } from "@/components/user/sections/ProfileSkillsSection";
import { ProfileMembershipsSection } from "@/components/user/sections/ProfileMembershipsSection";
import {
  SkeletonCompanyProfile,
  SkeletonDescription,
  SkeletonSkills,
  SkeletonSocialMedias,
  SkeletonText,
  SkeletonUserProfile,
  SkeletonButton,
} from "@/components/skeletons";
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

      <Suspense fallback={<ProfileContentSkeleton />}>
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

function ProfileContentSkeleton() {
  return (
    <div aria-busy="true">
      <div className="mt-6">
        <SkeletonUserProfile type="edit" />
      </div>
      <div className="flex flex-row gap-4 mt-2">
        <SkeletonText customClassName="w-30 h-3 rounded-sm bg-background-200" />
        <SkeletonText customClassName="w-30 h-3 rounded-sm bg-background-200" />
      </div>

      {/* Resume */}
      <div className="w-full h-8 mt-3 rounded-md border border-background-500 bg-background-500 animate-pulse"></div>

      <SkeletonDescription />
      <hr className="mt-4 mb-8" />

      <SkeletonText customClassName="w-60 h-5 mb-2 rounded-md bg-background-200" />
      <SkeletonSocialMedias />

      <SkeletonText customClassName="w-60 h-5 mb-2 mt-8 rounded-md bg-background-200" />
      <SkeletonSkills />

      {/* Companies */}
      <div className="mt-8">
        <SkeletonText customClassName="w-80 h-6 mb-3 rounded-md bg-background-200" />

        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, idx) => (
            <SkeletonCompanyProfile type="link" key={`company-${idx}`} />
          ))}
        </div>
      </div>

      {/* Session */}
      <SkeletonText customClassName="w-60 h-5 mb-4 mt-8 rounded-md bg-background-200" />
      <div className="flex flex-col gap-2">
        <SkeletonButton variant="ghost" />
        <SkeletonButton variant="critical" />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Perfil do usuário | TypeHire",
  description:
    "Veja suas informações pessoais como nome, email e descrição que serão vistas pelos recrutadores.",
};

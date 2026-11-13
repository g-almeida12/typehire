import { BackButton } from "@/components/common/BackButton";
import { Metadata } from "next";
import { getUserByIdAction } from "@/lib/modules/user/index";
import { notFound } from "next/navigation";
import { ProfileHeaderSection } from "@/components/user/sections/ProfileHeaderSection";
import { ProfileMembershipsSection } from "@/components/user/sections/ProfileMembershipsSection";
import { ProfileSkillsSection } from "@/components/user/sections/ProfileSkillsSection";
import { ProfileSocialMediasSection } from "@/components/user/sections/ProfileSocialMediasSection";
import { Suspense } from "react";
import {
  SkeletonUserProfile,
  SkeletonText,
  SkeletonDescription,
  SkeletonSocialMedias,
  SkeletonSkills,
  SkeletonCompanyProfile,
} from "@/components/skeletons";

export default async function ProfilePage(props: PageProps<"/users/[id]">) {
  const userId = (await props.params).id;

  return (
    <main className="pb-4">
      <section>
        <div className="size-6 mt-4">
          <BackButton />
        </div>
      </section>

      <Suspense fallback={<ProfileContentSkeleton />}>
        <ProfileContent userId={userId} />
      </Suspense>
    </main>
  );
}

async function ProfileContent({ userId }: { userId: string }) {
  const userResult = await getUserByIdAction(userId);

  if (!userResult.success) {
    if (userResult.status === 404) notFound();
    else throw new Error(`Failed to load user content page for user ID: ${userId}`);
  }

  const user = userResult.data;
  return (
    <>
      <ProfileHeaderSection user={user} />

      <hr className="mt-4 mb-8" />

      <ProfileSocialMediasSection user={user} />
      <ProfileSkillsSection skills={user.skills} />
      <ProfileMembershipsSection companies={user.companies} userId={user.id} />
    </>
  );
}

function ProfileContentSkeleton() {
  return (
    <div aria-busy="true">
      <div className="mt-6">
        <SkeletonUserProfile />
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
    </div>
  );
}

export const metadata: Metadata = {
  title: "Perfil do usuário | TypeHire",
  description:
    "Veja suas informações pessoais como nome, email e descrição que serão vistas pelos recrutadores.",
};

import { BackButton } from "@/components/common/BackButton";
import { Metadata } from "next";
import { getUserByIdAction } from "@/lib/modules/user";
import { notFound } from "next/navigation";
import { ProfileHeaderSection } from "@/components/user/sections/ProfileHeaderSection";
import { ProfileMembershipsSection } from "@/components/user/sections/ProfileMembershipsSection";
import { ProfileSkillsSection } from "@/components/user/sections/ProfileSkillsSection";
import { ProfileSocialMediasSection } from "@/components/user/sections/ProfileSocialMediasSection";
import { Suspense } from "react";
import { SkeletonProfileContent } from "@/components/skeletons";
import { Params } from "@/utils/types";

export default function ProfilePage(props: PageProps<"/users/[id]">) {
  return (
    <main className="pb-4">
      <section>
        <div className="mt-4">
          <BackButton />
        </div>
      </section>

      <Suspense fallback={<SkeletonProfileContent />}>
        <ProfileContent params={props.params} />
      </Suspense>
    </main>
  );
}

async function ProfileContent({ params }: { params: Params }) {
  const userId = (await params).id;
  const userResult = await getUserByIdAction(userId);

  if (!userResult.success) {
    if (userResult.status === 404) notFound();
    else
      throw new Error(
        `Failed to load user content page for user ID: ${userId}`,
      );
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

export const metadata: Metadata = {
  title: "Perfil do usuário | TypeHire",
  description:
    "Veja as informações públicas do usuário, como nome, email, habilidades e mais.",
};

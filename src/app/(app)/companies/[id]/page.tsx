import { BackButton } from "@/components/common/BackButton";
import { Navbar } from "@/components/ui/Navbar";
import { getCompanyByIdAction } from "@/lib/modules/company/index";
import { getCurrentUserData } from "@/lib/data/user/index";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompanyActionsWrapper } from "@/components/company/CompanyActionsWrapper";
import { CompanyHeaderSection } from "@/components/company/sections/CompanyHeaderSection";
import { CompanyJobsSection } from "@/components/company/sections/CompanyJobsSection";
import { CompanyMembersSection } from "@/components/company/sections/CompanyMembersSection";
import { Suspense } from "react";
import { SkeletonCompanyContent } from "@/components/skeletons";

export default async function CompanyPage(props: PageProps<"/companies/[id]">) {
  const companyId = (await props.params).id;

  return (
    <>
      <Navbar />
      <main className="pb-4">
        <section className="w-full flex flex-row items-center justify-between mt-4">
          <div className="size-6">
            <BackButton />
          </div>
          <Suspense fallback={null}>
            <CompanyActionsWrapperContent companyId={companyId} />
          </Suspense>
        </section>

        <Suspense
          fallback={
            <div className="mt-4">
              <SkeletonCompanyContent />
            </div>
          }
        >
          <CompanyContent companyId={companyId} />
        </Suspense>
      </main>
    </>
  );
}

async function CompanyActionsWrapperContent({
  companyId,
}: {
  companyId: string;
}) {
  const [user, companyResponse] = await Promise.all([
    getCurrentUserData(),
    getCompanyByIdAction(companyId),
  ]);

  if (!companyResponse.success) {
    if (companyResponse.status === 404) notFound();
    else
      throw new Error(
        `Failed to load company actions for company ID: ${companyId}`,
      );
  }

  if (user!.id !== companyResponse.data.createdBy) return null;

  return (
    <div className="size-6">
      <CompanyActionsWrapper companyId={companyId} />
    </div>
  );
}

async function CompanyContent({ companyId }: { companyId: string }) {
  const [user, companyResponse] = await Promise.all([
    getCurrentUserData(),
    getCompanyByIdAction(companyId),
  ]);

  if (!companyResponse.success) {
    if (companyResponse.status === 404) notFound();
    else
      throw new Error(
        `Failed to load company page content for company ID: ${companyId}`,
      );
  }

  const company = companyResponse.data;
  const USER_ROLE =
    company.createdBy === user!.id
      ? "CREATOR"
      : company.members.map((m) => m.id).includes(user!.id)
        ? "MEMBER"
        : "USER";

  return (
    <>
      <CompanyHeaderSection userRole={USER_ROLE} company={company} />
      <CompanyJobsSection userRole={USER_ROLE} company={company} />
      <CompanyMembersSection
        userRole={USER_ROLE}
        company={company}
        currentUserId={user!.id}
      />
    </>
  );
}

export async function generateMetadata(
  props: PageProps<"/companies/[id]">,
): Promise<Metadata> {
  const companyId = (await props.params).id;
  const companyResponse = await getCompanyByIdAction(companyId);

  if (!companyResponse.success) {
    if (companyResponse.status === 404) notFound();
    else
      throw new Error(
        `Failed to generate metadata for company ID: ${companyId}`,
      );
  }

  const company = companyResponse.data;
  const description =
    company.bio.slice(0, 150) + (company.bio.length > 150 ? "..." : "");

  return {
    title: `${company.name} | Vagas e Perfil no TypeHire`,
    description,
  };
}

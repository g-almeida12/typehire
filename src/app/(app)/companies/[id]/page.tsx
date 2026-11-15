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
import { truncateText } from "@/utils/string";

export default function CompanyPage(props: PageProps<"/companies/[id]">) {
  return (
    <>
      <Navbar />
      <main className="pb-4">
        <section className="w-full flex flex-row items-center justify-between mt-4">
          <div className="size-6">
            <BackButton />
          </div>
          <Suspense fallback={null}>
            <CompanyActionsWrapperContent props={props} />
          </Suspense>
        </section>

        <Suspense
          fallback={
            <div className="mt-4">
              <SkeletonCompanyContent />
            </div>
          }
        >
          <CompanyContent props={props} />
        </Suspense>
      </main>
    </>
  );
}

async function CompanyActionsWrapperContent({
  props,
}: {
  props: PageProps<"/companies/[id]">;
}) {
  const companyId = (await props.params).id;
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

async function CompanyContent({
  props,
}: {
  props: PageProps<"/companies/[id]">;
}) {
  const companyId = (await props.params).id;
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
  const description = truncateText(company.bio);

  return {
    title: `${truncateText(company.name, 35)} | Vagas e Perfil no TypeHire`,
    description,
  };
}

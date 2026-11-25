import { Navbar } from "@/components/ui/Navbar";
import { getCompanyByIdAction } from "@/lib/modules/company";
import { getCurrentUserId } from "@/lib/data/user";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { truncateText } from "@/utils/string";
import { CompanyActions } from "@/components/company/CompanyActions";
import { Params } from "@/utils/types";
import { CompanyHeaderSection } from "@/components/company/sections/CompanyHeaderSection";
import { CompanyJobsSection } from "@/components/company/sections/CompanyJobsSection";
import { CompanyMembersSection } from "@/components/company/sections/CompanyMembersSection";
import { Suspense } from "react";

export default function CompanyPage(props: PageProps<"/companies/[id]">) {
  return (
    <>
      <Navbar />
      <main className="w-full max-w-lg pb-4 mx-auto">
        <Suspense>
          <CompanyContent
            params={props.params}
          />
        </Suspense>
      </main>
    </>
  );
}

async function CompanyContent({
  params,
}: {
  params: Params;
}) {
  const companyId = (await params).id;
  const [userId, companyResponse] = await Promise.all([
    getCurrentUserId(),
    getCompanyByIdAction(companyId),
  ]);

  if (!companyResponse.success) {
    if (companyResponse.status === 404) notFound();
    else
      throw new Error(
        `Failed to load company actions for company ID: ${companyId}`,
      );
  }

  const company = companyResponse.data;
  const USER_ROLE =
    company.createdBy === userId!
      ? "CREATOR"
      : company.members.map((m) => m.id).includes(userId!)
        ? "MEMBER"
        : "USER";

  return (
    <section className="mt-4">
      <CompanyActions company={companyResponse.data} userId={userId!} />

      <CompanyHeaderSection userRole={USER_ROLE} company={company} />
      <CompanyJobsSection userRole={USER_ROLE} company={company} />
      <CompanyMembersSection
        userRole={USER_ROLE}
        company={company}
        currentUserId={userId!}
      />
    </section>
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

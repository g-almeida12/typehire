import { BackButton } from "@/components/common/BackButton";
import { CompanyForm } from "@/components/company/CompanyForm";
import { getCompanyByIdAction } from "@/lib/modules/company";
import { getCurrentUserData } from "@/lib/data/user";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SkeletonCompanyForm } from "@/components/skeletons";
import { truncateText } from "@/utils/string";

export default async function CompanyUpdatePage(
  props: PageProps<"/companies/[id]/update">,
) {
  return (
    <main className="w-full max-w-lg pb-4 mx-auto">
      <section>
        <div className="mt-4">
          <BackButton />
        </div>

        <h1 className="mt-8 mb-6 text-2xl font-semibold">
          Atualize os dados da sua empresa
        </h1>
      </section>

      <section>
        <Suspense fallback={<SkeletonCompanyForm />}>
          <CompanyFormContent props={props} />
        </Suspense>
      </section>
    </main>
  );
}

async function CompanyFormContent({
  props,
}: {
  props: PageProps<"/companies/[id]/update">;
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
        `Failed to load form content for company ID: ${companyId}`,
      );
  }

  return (
    <CompanyForm
      company={companyResponse.data}
      currentUserEmail={user!.email}
      key={companyResponse.data.id}
    />
  );
}

export async function generateMetadata(
  props: PageProps<"/companies/[id]/update">,
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

  return {
    title: `Atualizar empresa ${truncateText(companyResponse.data.name, 35)} | TypeHire`,
    description:
      "Atualize os dados da sua empresa para dar total transparência aos candidatos.",
  };
}

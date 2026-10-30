import { BackButton } from "@/components/common/BackButton";
import { CompanyForm } from "@/components/company/CompanyForm";
import { getCompanyByIdAction } from "@/lib/modules/company/index";
import { getCurrentUserData } from "@/lib/data/user/index";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export default async function CompanyUpdate(
  props: PageProps<"/companies/[id]/update">,
) {
  const companyId = (await props.params).id;
  const [user, companyResponse] = await Promise.all([
    getCurrentUserData(),
    getCompanyByIdAction(companyId),
  ]);

  if (!companyResponse.success) {
    if (companyResponse.status === 404) {
      notFound();
    } else {
      throw new Error();
    }
  }

  return (
    <main className="pb-4">
      <section>
        <div className="size-6 mt-4">
          <BackButton />
        </div>

        <h1 className="mt-8 mb-6 text-2xl font-semibold">
          Atualize os dados da sua empresa
        </h1>
      </section>

      <section>
        <CompanyForm
          company={companyResponse.data}
          currentUserEmail={user!.email}
          key={companyResponse.data.id}
        />
      </section>
    </main>
  );
}

export async function generateMetadata(
  props: PageProps<"/companies/[id]/update">,
): Promise<Metadata> {
  const companyId = (await props.params).id;
  const companyResponse = await getCompanyByIdAction(companyId);

  if (!companyResponse.success) {
    if (companyResponse.status === 404) notFound();
    else throw Error();
  }

  return {
    title: `Atualizar empresa ${companyResponse.data.name} | TypeHire`,
    description:
      "Atualize os dados da sua empresa para dar total transparência aos candidatos.",
  };
}

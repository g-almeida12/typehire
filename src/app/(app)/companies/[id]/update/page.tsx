import { BackButton } from "@/components/common/BackButton";
import { CompanyForm } from "@/components/companies/CompanyForm";
import { getCompanyByIdAction } from "@/lib/actions";
import { getUserData } from "@/lib/data";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export default async function CompanyUpdate(
  props: PageProps<"/companies/[id]/update">,
) {
  const companyId = (await props.params).id;
  const [user, companyResponse] = await Promise.all([
    getUserData(),
    getCompanyByIdAction(companyId),
  ]);

  if (!companyResponse.success) {
    if (companyResponse.status === 404) {
      notFound();
    } else {
      throw new Error();
    }
  }

  const company = companyResponse.data;
  return (
    <main className="pb-4">
      <div className="size-6 mt-4">
        <BackButton />
      </div>

      <h1 className="mt-8 mb-6 text-2xl font-semibold">
        Atualize os dados da sua empresa
      </h1>

      <section>
        <CompanyForm
          company={company}
          currentUserEmail={user!.email}
          key={company?.id ?? `new-${Date.now()}`}
        />
      </section>
    </main>
  );
}

export async function generateMetadata(
  props: PageProps<"/companies/[id]/update">,
): Promise<Metadata> {
  try {
    const companyId = (await props.params).id;
    const response = await getCompanyByIdAction(companyId);

    if (!response.success) {
      return {
        title: "Empresa não encontrada | TypeHire",
        description:
          "A empresa que você está procurando pode ter sido desligada ou não existe.",
      };
    }

    return {
      title: `Atualizar empresa ${response.data.name} | TypeHire`,
      description:
        "Atualize os dados da sua empresa para dar total transparência aos candidatos.",
    };
  } catch (_err) {
    return {
      title: "TypeHire - Portal de Vagas",
    };
  }
}

import { BackButton } from "@/components/common/BackButton";
import { CompanyProfile } from "@/components/common/CompanyProfile";
import { JobCard } from "@/components/common/JobCard";
import { UserProfile } from "@/components/common/UserProfile";
import { Navbar } from "@/components/ui/Navbar";
import { getCompanyByIdAction } from "@/lib/actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

export default async function CompanyPage(props: PageProps<"/companies/[id]">) {
  const companyId = (await props.params).id;
  const response = await getCompanyByIdAction(companyId);

  if (!response.success) notFound();

  const company = response.data;
  console.log(company);
  const companyCreator = company.members.filter(
    (m) => m.id === company.createdBy,
  )[0];
  return (
    <>
      <Navbar />
      <main className="pb-4">
        <div className="size-6 mt-4">
          <BackButton />
        </div>

        {/* Company info */}
        <section className="mt-4">
          <CompanyProfile company={company} type="readonly" />

          <h2 className="mt-8 mb-4 text-xl font-medium">Sobre a empresa</h2>
          <div className="space-y-4 leading-relaxed">
            <ReactMarkdown>{company.bio}</ReactMarkdown>
          </div>
        </section>

        {/* Jobs */}
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-medium">Vagas abertas no momento</h2>

          <ul className="flex flex-col gap-0 -ml-4 w-[calc(100%+2rem)]">
            {company.jobs.length === 0 ? (
              <p className="text-center text-sm text-background-300">
                Essa empresa não postou nenhuma vaga ainda.
              </p>
            ) : (
              company.jobs.map((j, idx) => (
                <li key={`job-${idx}`}>
                  <JobCard job={{ ...j, company }} />
                </li>
              ))
            )}
          </ul>
        </section>

        {/* Memberships */}
        <section className="mt-8">
          <h2 className="mb-2 text-xl font-medium">Nossa equipe</h2>

          <h3 className="mb-2 font-medium text-background-300">Criador</h3>
          <UserProfile user={companyCreator} type="link" />

          <h3 className="mb-2 mt-4 font-medium text-background-300">
            Associados
          </h3>
          <ul className="flex flex-col gap-4">
            {company.members.length === 1 ? (
              <p className="text-center text-sm text-background-300">
                Não há nenhum associado nessa empresa.
              </p>
            ) : (
              company.members
                .filter((m) => m.id !== company.createdBy)
                .map((m, idx) => (
                  <li key={`user-${idx}`}>
                    <UserProfile user={m} type="link" />
                  </li>
                ))
            )}
          </ul>
        </section>
      </main>
    </>
  );
}

export async function generateMetadata(
  props: PageProps<"/companies/[id]">,
): Promise<Metadata> {
  const companyId = (await props.params).id;
  const response = await getCompanyByIdAction(companyId);

  if (!response.success) {
    return {
      title: "Empresa não encontrada | TypeHire",
    };
  }

  const title = `${response.data.name} | Vagas e Perfil no TypeHire`;
  const description = `Conheça a empresa ${response.data.name} e veja suas vagas abertas em TI.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

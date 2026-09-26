import { BackButton } from "@/components/common/BackButton";
import { CompanyProfile } from "@/components/common/CompanyProfile";
import { JobCard } from "@/components/common/JobCard";
import { UserProfile } from "@/components/common/UserProfile";
import { Navbar } from "@/components/ui/Navbar";
import { getCompanyByIdAction } from "@/lib/modules/company/index";
import { InfoIcon } from "@/components/icons";
import { getCurrentUserData } from "@/lib/data/user/index";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/common/Button";
import { APP_URLS } from "@/utils/constants";
import { CompanyActionsWrapper } from "@/components/companies/CompanyActionsWrapper";

export default async function CompanyPage(props: PageProps<"/companies/[id]">) {
  const companyId = (await props.params).id;

  const [user, response] = await Promise.all([
    getCurrentUserData(),
    getCompanyByIdAction(companyId),
  ]);

  if (!response.success) {
    if (response.status === 404) {
      notFound();
    } else {
      throw new Error();
    }
  }

  const company = response.data;
  const companyCreator = company.members.filter(
    (m) => m.id === company.createdBy,
  )[0];
  const isUserCreator = companyCreator.id === user?.id;

  return (
    <>
      <Navbar />
      <main className="pb-4">
        <div className="w-full flex flex-row items-center justify-between mt-4">
          <div className="size-6">
            <BackButton />
          </div>
          {isUserCreator && (
            <div className="size-6">
              <CompanyActionsWrapper companyId={companyId} />
            </div>
          )}
        </div>

        {/* Company info */}
        <section className="mt-4">
          {isUserCreator && (
            <span className="w-max flex flex-row items-center gap-2 px-2 py-1 mb-2 rounded-md bg-accent-400">
              <InfoIcon size={18} />
              <span className="text-sm font-medium">Sua empresa</span>
            </span>
          )}
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
                {isUserCreator
                  ? "Que tal postar sua primeira vaga?"
                  : "Essa empresa não postou nenhuma vaga ainda."}
              </p>
            ) : (
              company.jobs.map((j, idx) => (
                <li className="not-first:-mt-px" key={`job-${idx}`}>
                  <JobCard job={{ ...j, company }} />
                </li>
              ))
            )}
          </ul>

          {isUserCreator && (
            <div className="mt-4">
              <Button text="Criar nova vaga" href={APP_URLS.jobCreate} />
            </div>
          )}
        </section>

        {/* Memberships */}
        <section className="mt-8">
          <h2 className="mb-2 text-xl font-medium">
            {isUserCreator ? "Sua equipe" : "Nossa equipe"}
          </h2>

          <h3 className="mb-2 font-medium text-background-300">
            Criador {isUserCreator && "(você)"}
          </h3>
          <UserProfile
            user={companyCreator}
            type={isUserCreator ? "readonly" : "link"}
          />

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

    const description = response.data.bio
      ? response.data.bio.slice(0, 150) +
        (response.data.bio.length > 150 ? "..." : "")
      : `Conheça a empresa ${response.data.name}, seus objetivos, suas vagas e seus colaboradores.`;

    return {
      title: `${response.data.name} | Vagas e Perfil no TypeHire`,
      description,
    };
  } catch (_err) {
    return {
      title: "TypeHire - Portal de Vagas",
    };
  }
}

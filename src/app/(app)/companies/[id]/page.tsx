import { BackButton } from "@/components/common/BackButton";
import { CompanyProfile } from "@/components/common/CompanyProfile";
import { JobCard } from "@/components/common/JobCard";
import { UserProfile } from "@/components/common/UserProfile";
import { Navbar } from "@/components/ui/Navbar";
import { getCompanyByIdAction } from "@/lib/modules/company/index";
import { getCurrentUserData } from "@/lib/data/user/index";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/common/Button";
import { APP_URLS } from "@/utils/constants";
import { CompanyActionsWrapper } from "@/components/company/CompanyActionsWrapper";
import { InfoTag } from "@/components/common/InfoTag";

export default async function CompanyPage(props: PageProps<"/companies/[id]">) {
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

  const company = companyResponse.data;
  const companyCreator = company.members.filter(
    (m) => m.id === company.createdBy,
  )[0];
  const USER_ROLE =
    companyCreator.id === user!.id
      ? "CREATOR"
      : company.members.map((m) => m.id).includes(user!.id)
        ? "MEMBER"
        : "USER";

  return (
    <>
      <Navbar />
      <main className="pb-4">
        <div className="w-full flex flex-row items-center justify-between mt-4">
          <div className="size-6">
            <BackButton />
          </div>
          {USER_ROLE === "CREATOR" && (
            <div className="size-6">
              <CompanyActionsWrapper companyId={companyId} />
            </div>
          )}
        </div>

        {/* Company info */}
        <section className="mt-4">
          {USER_ROLE !== "USER" && (
            <InfoTag
              label={
                USER_ROLE === "CREATOR"
                  ? "Sua empresa"
                  : "Associado nessa empresa"
              }
            />
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
                {USER_ROLE === "CREATOR"
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

          {USER_ROLE !== "USER" && (
            <div className="mt-4">
              <Button
                text="Criar nova vaga"
                href={`${APP_URLS.jobCreate}?companyId=${company.id}`}
              />
            </div>
          )}
        </section>

        {/* Memberships */}
        <section className="mt-8">
          <h2 className="mb-2 text-xl font-medium">
            {USER_ROLE !== "USER" ? "Sua equipe" : "Nossa equipe"}
          </h2>

          <h3 className="mb-2 font-medium text-background-300">
            Criador {USER_ROLE === "CREATOR" && "(você)"}
          </h3>
          <UserProfile
            user={companyCreator}
            type={USER_ROLE === "CREATOR" ? "readonly" : "link"}
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
                    <UserProfile
                      user={m}
                      type="link"
                      isCurrentUserProfile={m.id === user!.id}
                    />
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

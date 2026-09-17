import { BackButton } from "@/components/common/BackButton";
import { Button } from "@/components/common/Button";
import { CompanyProfile } from "@/components/common/CompanyProfile";
import {
  AwardIcon,
  BriefcaseIcon,
  BuildingIcon,
  CircleFadingArrowUpIcon,
  SproutIcon,
  RefreshIcon,
  HouseIcon,
  CheckIcon,
  XIcon,
} from "@/components/icons";
import { Navbar } from "@/components/ui/Navbar";
import { getJobByIdAction } from "@/lib/actions";
import { getUserData } from "@/lib/data";
import {
  jobLevelMapper,
  jobModalityMapper,
  jobTypeMapper,
  skillMapper,
} from "@/utils/mappers";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

export default async function JobPage(props: PageProps<"/jobs/[id]">) {
  const jobId = (await props.params).id;
  const [user, response] = await Promise.all([
    getUserData(),
    getJobByIdAction(jobId),
  ]);

  if (!response.success) {
    notFound();
  }

  const job = response.data;
  return (
    <>
      <Navbar />
      <main>
        <div className="size-6 mt-4">
          <BackButton />
        </div>

        {/* Job and company main info */}
        <section className="mt-6">
          <CompanyProfile company={job.company} type="link" />

          <div className="mt-10">
            <h1 className="text-2xl font-semibold">{job.title}</h1>

            {/* Job level and modality tags */}
            <ul className="flex flex-row flex-wrap gap-2 mt-1">
              {/* Level */}
              <li className="flex flex-row gap-1 items-center px-2 py-1 rounded-md bg-background-700 text-background-300">
                {(() => {
                  switch (job.level) {
                    case "ESTAGIÁRIO":
                      return <SproutIcon size={20} />;
                    case "JÚNIOR":
                      return <CircleFadingArrowUpIcon size={20} />;
                    case "PLENO":
                      return <BriefcaseIcon size={20} />;
                    case "SÊNIOR":
                      return <AwardIcon size={20} />;
                  }
                })()}
                <p className="font-semibold text-sm">
                  {jobLevelMapper[job.level]}
                </p>
              </li>

              {/* Modality */}
              <li className="flex flex-row gap-1 items-center px-2 py-1 rounded-md bg-background-700 text-background-300">
                {(() => {
                  switch (job.modality) {
                    case "PRESENCIAL":
                      return <BuildingIcon size={20} />;
                    case "HÍBRIDO":
                      return <RefreshIcon size={20} />;
                    case "REMOTO":
                      return <HouseIcon size={20} />;
                  }
                })()}
                <p className="font-semibold text-sm">
                  {jobModalityMapper[job.modality]}
                </p>
              </li>
            </ul>

            {/* Job salary and type */}
            <div className="flex flex-col gap-0 mt-4 ">
              <p className="font-medium text-2xl text-background-100">
                <span className="text-sm text-background-300 font-semibold">
                  R$
                </span>
                {(() => {
                  if (job.fixedSalary) {
                    return job.fixedSalary;
                  } else if (job.hourlySalary) {
                    return (
                      <>
                        ${job.hourlySalary}
                        <span className="text-sm text-background-300">
                          /hora
                        </span>
                      </>
                    );
                  } else if (job.intervalSalary) {
                    return `${job.intervalSalary[0]} - ${job.intervalSalary[1]}`;
                  }
                })()}
              </p>

              <p className="text-sm text-background-300 italic">
                {jobTypeMapper[job.type]}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Button text="Candidate-se agora" />
          </div>
        </section>

        <hr className="my-8" />

        {/* Additional job info */}
        <section className="mt-8">
          {/* Job Skills */}
          <h2 className="mb-4 text-xl font-medium">Skills da vaga</h2>
          <ul className="flex flex-row flex-wrap gap-1">
            {job.skills
              .slice()
              .sort((a, b) => {
                const userHasA = user?.skills.includes(a) ? 1 : 0;
                const userHasB = user?.skills.includes(b) ? 1 : 0;
                return userHasB - userHasA;
              })
              .map((s) => {
                const userHasSkill = user?.skills.includes(s);
                const tagStyles = userHasSkill
                  ? "bg-green-400 text-green-950"
                  : "bg-red-400 text-red-800";

                return (
                  <li
                    className={`flex flex-row items-center gap-2 px-2 py-1 rounded-sm text-sm font-semibold ${tagStyles}`}
                    key={s}
                  >
                    <span>{skillMapper[s]}</span>
                    <span
                      className={`flex items-center justify-center size-5.5 rounded-full ${userHasSkill ? "bg-green-950" : "bg-red-800"}`}
                    >
                      {userHasSkill ? (
                        <CheckIcon size={18} className="text-green-400" />
                      ) : (
                        <XIcon size={18} className="text-red-400" />
                      )}
                    </span>
                  </li>
                );
              })}
          </ul>

          {/* Job description */}
          <h2 className="mb-4 mt-8 text-xl font-medium">Descrição da vaga</h2>
          <div className="w-[calc(100%+2rem)] prose prose-invert p-4 -ml-4 bg-background-800">
            <ReactMarkdown>{job.description}</ReactMarkdown>
          </div>
        </section>
      </main>
    </>
  );
}

export async function generateMetadata(
  props: PageProps<"/jobs/[id]">,
): Promise<Metadata> {
  const jobId = (await props.params).id;
  const response = await getJobByIdAction(jobId);

  if (!response.success) {
    return {
      title: "Vaga não encontrada | TypeHire",
      description:
        "A vaga que você está procurando pode ter sido encerrada ou não existe.",
    };
  }

  const title = `${response.data.title} na ${response.data.company.name} | TypeHire`;
  const description = `Confira os requisitos, faixa salarial visível e detalhes para a vaga de ${response.data.title} na ${response.data.company.name}. Encontre sua próxima oportunidade em TI.`;

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

import { BackButton } from "@/components/common/BackButton";
import { CompanyProfile } from "@/components/company/CompanyProfile";
import { CheckIcon, XIcon } from "@/components/icons";
import { Navbar } from "@/components/ui/Navbar";
import { getJobByIdAction } from "@/lib/modules/job/index";
import { getCurrentUserData } from "@/lib/data/user/index";
import { JOB_TYPE_LABELS, SKILL_LABELS } from "@/utils/mappers";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { InfoTag } from "@/components/common/InfoTag";
import { JobActionsWrapper } from "@/components/job/JobActionsWrapper";
import { ApplicationCreateWrapper } from "@/components/application/ApplicationCreateWrapper";
import { JobInfoTags } from "@/components/job/JobInfoTags";

export default async function JobPage(props: PageProps<"/jobs/[id]">) {
  const jobId = (await props.params).id;
  const [user, jobResponse] = await Promise.all([
    getCurrentUserData(),
    getJobByIdAction(jobId),
  ]);

  // Handle get job request exceptions
  if (!jobResponse.success) {
    if (jobResponse.status === 404) notFound();
    else throw new Error();
  }

  const job = jobResponse.data;
  const userRole =
    job.creator.id === user!.id || job.company.createdBy === user!.id
      ? "CREATOR"
      : job.company.memberIds.includes(user!.id)
        ? "MEMBER"
        : "USER";

  return (
    <>
      <Navbar />
      <main className="pb-4">
        <section className="w-full flex flex-row items-center justify-between mt-4">
          <div className="size-6">
            <BackButton />
          </div>
          {userRole === "CREATOR" && (
            <div className="size-6">
              <JobActionsWrapper jobId={jobId} />
            </div>
          )}
        </section>

        {/* Job and company main info */}
        <section className="mt-6">
          {userRole === "CREATOR" && <InfoTag label="Sua empresa" />}
          {userRole === "MEMBER" && <InfoTag label="Você é membro" />}
          <CompanyProfile
            company={job.company}
            type="link"
            visualOnlyWebsiteLink={false}
          />

          <div className="mt-10">
            {job.creator.id === user!.id && <InfoTag label="Sua vaga" />}
            <h1 className="text-2xl font-semibold">{job.title}</h1>
            {job.location && (
              <p className="mb-3 text-background-300 text-sm/[14px] truncate italic">
                {job.location}
              </p>
            )}

            {/* Job level and modality tags */}
            <JobInfoTags level={job.level} modality={job.modality} />

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
                {JOB_TYPE_LABELS[job.type]}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <ApplicationCreateWrapper
              jobId={jobId}
              userRole={userRole}
              userHasApplied={job.userHasApplied}
            />
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
                    <span>{SKILL_LABELS[s]}</span>
                    <span
                      className={`flex items-center justify-center size-5.5 rounded-full ${userHasSkill ? "bg-green-950" : "bg-red-800"}`}
                    >
                      {userHasSkill ? (
                        <CheckIcon
                          size={18}
                          className="text-green-400"
                          aria-hidden="true"
                        />
                      ) : (
                        <XIcon
                          size={18}
                          className="text-red-400"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </li>
                );
              })}
          </ul>

          {/* Job description */}
          <h2 className="mb-4 mt-8 text-xl font-medium">Descrição da vaga</h2>
          <div className="w-[calc(100%+2rem)] prose prose-invert p-4 -ml-4 -mb-4 bg-background-800 overflow-x-hidden">
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
  const jobResponse = await getJobByIdAction(jobId);

  if (!jobResponse.success) {
    if (jobResponse.status === 404) notFound();
    else throw Error();
  }

  const job = jobResponse.data;
  return {
    title: `${job.title} na ${job.company.name} | TypeHire`,
    description:
      job.description.slice(0, 150) +
      (job.description.length > 150 ? "..." : ""),
  };
}

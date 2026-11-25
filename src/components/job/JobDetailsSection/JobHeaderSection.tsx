import { ApplicationCreateWrapper } from "@/components/application/ApplicationCreateWrapper";
import { InfoTag } from "@/components/common/InfoTag";
import { CompanyProfile } from "@/components/company/CompanyProfile";
import { JOB_TYPE_LABELS } from "@/utils/mappers";
import { JobInfoTags } from "../JobInfoTags";
import { JobResponsePayload } from "@/lib/modules/job";

interface JobHeaderSectionProps {
  userRole: "CREATOR" | "MEMBER" | "USER";
  currentUserId: string;
  job: JobResponsePayload;
}

export function JobHeaderSection({
  userRole,
  currentUserId,
  job,
}: JobHeaderSectionProps) {
  return (
    <section>
      {userRole === "CREATOR" && <InfoTag label="Sua empresa" />}
      {userRole === "MEMBER" && <InfoTag label="Você é membro" />}
      <CompanyProfile
        company={job.company}
        type="link"
        visualOnlyWebsiteLink={false}
      />

      <div className="mt-10">
        {/* Job title and location */}
        {job.creator.id === currentUserId && <InfoTag label="Sua vaga" />}
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
                    <span className="text-sm text-background-300">/hora</span>
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
          jobId={job.id}
          userRole={userRole}
          userHasApplied={job.userHasApplied}
        />
      </div>
    </section>
  );
}

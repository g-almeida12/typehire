import { formatRelativeTime } from "@/utils/date";
import { ApplicationResponsePayload } from "@/lib/modules/application";
import { CompanyProfile } from "../company/CompanyProfile";
import { ApplicationStatusTag } from "./ApplicationStatusTag";
import { JobInfoTags } from "../job/JobInfoTags";
import { CardContainer } from "../common/CardContainer";

interface ApplicationCardProps {
  application: ApplicationResponsePayload;
  navigateTo?: string;
}

export function ApplicationCard({
  application,
  navigateTo = undefined,
}: ApplicationCardProps) {
  return (
    <CardContainer navigateTo={navigateTo}>
      <div className="mb-2">
        <ApplicationStatusTag status={application.status} />
      </div>

      {/* Application and company profile */}
      <div className="flex flex-col gap-2">
        {/* Company image and name */}
        <CompanyProfile
          company={application.job.company}
          type="readonly"
          showCompanySize={false}
        />
        <div className="flex flex-col gap-0 items-start">
          <p className="text-lg font-medium">{application.job.title}</p>
          <p className="text-background-300 text-sm/[14px] truncate italic">
            {application.job.location ?? "Remoto"}
          </p>
        </div>
      </div>

      {/* Job level and modality tags */}
      <JobInfoTags
        level={application.job.level}
        modality={application.job.modality}
      />

      {/* Job salary and creation date */}
      <div className="flex flex-row justify-between items-baseline mt-6">
        <p className="font-semibold text-2xl text-background-100">
          <span className="text-sm text-background-300">R$</span>
          {(() => {
            if (application.job.fixedSalary) {
              return application.job.fixedSalary;
            } else if (application.job.hourlySalary) {
              return (
                <>
                  {application.job.hourlySalary}
                  <span className="text-sm text-background-300">/hora</span>
                </>
              );
            } else if (application.job.intervalSalary) {
              return `${application.job.intervalSalary[0]} - ${application.job.intervalSalary[1]}`;
            }
          })()}
        </p>

        <p className="text-sm text-background-300">
          {formatRelativeTime(application.createdAt)}
        </p>
      </div>
    </CardContainer>
  );
}

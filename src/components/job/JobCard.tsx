import { type JobResponsePayload } from "@/lib/modules/job/index";
import { formatRelativeTime } from "@/utils/date";
import Link from "next/link";
import { APP_URLS } from "@/utils/constants";
import { CompanyProfile } from "@/components/company/CompanyProfile";
import { JobInfoTags } from "./JobInfoTags";
import { CardContainer } from "../common/CardContainer";

export function JobCard({
  job,
}: {
  job: Pick<
    JobResponsePayload,
    | "level"
    | "modality"
    | "id"
    | "location"
    | "title"
    | "fixedSalary"
    | "hourlySalary"
    | "intervalSalary"
    | "createdAt"
  > & {
    company: Pick<
      JobResponsePayload["company"],
      "id" | "image" | "name" | "website"
    >;
  };
}) {
  return (
    <Link href={APP_URLS.JOB(job.id)} prefetch={false}>
      <CardContainer className="flex flex-col justify-between">
        <div>
          {/* Job and company profile */}
          <div className="flex flex-col gap-2">
            {/* Company image and name */}
            <CompanyProfile company={job.company} type="readonly" />
            <div className="max-w-full flex flex-col gap-0">
              <p className="text-lg/[24px] font-semibold tracking-wide">{job.title}</p>
              {job.location && (
                <p className="mb-3 mt-1 text-background-300 text-sm/[14px] truncate italic">
                  {job.location}
                </p>
              )}
            </div>
          </div>
  
          {/* Job level and modality tags */}
          <JobInfoTags level={job.level} modality={job.modality} />
        </div>

        {/* Job salary and creation date */}
        <div className="flex flex-row justify-between items-baseline mt-6">
          <p className="font-semibold text-2xl text-background-100">
            <span className="text-sm text-background-300">R$</span>
            {(() => {
              if (job.fixedSalary) {
                return job.fixedSalary;
              } else if (job.hourlySalary) {
                return (
                  <>
                    {job.hourlySalary}
                    <span className="text-sm text-background-300">/hora</span>
                  </>
                );
              } else if (job.intervalSalary) {
                return `${job.intervalSalary[0]} - ${job.intervalSalary[1]}`;
              }
            })()}
          </p>

          <p className="text-sm text-background-300">
            {formatRelativeTime(job.createdAt)}
          </p>
        </div>
      </CardContainer>
    </Link>
  );
}

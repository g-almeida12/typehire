import { type JobResponsePayload } from "@/lib/modules/job/index";
import { formatRelativeTime } from "@/utils/date";
import Link from "next/link";
import { APP_URLS } from "@/utils/constants";
import { CompanyProfile } from "@/components/company/CompanyProfile";
import { JobInfoTags } from "./JobInfoTags";

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
    <Link href={APP_URLS.job(job.id)} prefetch={false}>
      <div className="px-4 py-4 border-y border-y-background-700">
        {/* Job and company profile */}
        <div className="flex flex-col gap-2">
          {/* Company image and name */}
          <CompanyProfile company={job.company} type="readonly" />
          <div className="flex flex-col gap-0">
            <p className="text-lg font-medium">{job.title}</p>
            {job.location && (
              <p className="mb-3 text-background-300 text-sm/[14px] truncate italic">
                {job.location}
              </p>
            )}
          </div>
        </div>

        {/* Job level and modality tags */}
        <JobInfoTags level={job.level} modality={job.modality} />

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
                    ${job.hourlySalary}
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
      </div>
    </Link>
  );
}

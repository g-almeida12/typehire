import { JobResponsePayload } from "@/lib/schemas";
import {
  SproutIcon,
  CircleFadingArrowUpIcon,
  AwardIcon,
  BriefcaseIcon,
  HouseIcon,
  BuildingIcon,
  RefreshIcon,
} from "@/components/icons";
import { formatRelativeTime } from "@/utils/date";
import Link from "next/link";
import { APP_URLS } from "@/utils/constants";

export function JobCard({
  job,
}: {
  job: Pick<
    JobResponsePayload,
    | "level"
    | "modality"
    | "id"
    | "location"
    | "company"
    | "title"
    | "fixedSalary"
    | "hourlySalary"
    | "intervalSalary"
    | "createdAt"
  >;
}) {
  const capitalizedLevel =
    job.level[0].toUpperCase() + job.level.slice(1).toLowerCase();
  const capitalizedModality =
    job.modality[0].toUpperCase() + job.modality.slice(1).toLowerCase();

  return (
    <Link href={APP_URLS.job(job.id)} className="not-first:-mt-px">
      <div className="px-4 py-4 border-y border-y-background-700">
        {/* Job and company profile */}
        <div className="flex flex-row gap-2">
          <div className="shrink-0 size-10 bg-background-100 rounded-md"></div>
          <div className="flex flex-col gap-0">
            <p className="text-lg/[18px] font-medium">{job.title}</p>
            <p className="text-background-300 text-sm">
              {job.company.name} {job.location && `• ${job.location}`}
            </p>
          </div>
        </div>

        {/* Job level and modality tags */}
        <div className="flex flex-row gap-2 mt-3">
          {/* Level */}
          <div className="flex flex-row gap-1 items-center px-2 py-1 rounded-md bg-background-700 text-background-300">
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
            <p className="font-semibold text-sm">{capitalizedLevel}</p>
          </div>

          {/* Modality */}
          <div className="flex flex-row gap-1 items-center px-2 py-1 rounded-md bg-background-700 text-background-300">
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
            <p className="font-semibold text-sm">{capitalizedModality}</p>
          </div>
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

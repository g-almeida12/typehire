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
import { ApplicationResponsePayload } from "@/lib/modules/application";
import { CompanyProfile } from "../company/CompanyProfile";
import { ApplicationStatusTag } from "./ApplicationStatusTag";

export function ApplicationCard({
  application,
}: {
  application: ApplicationResponsePayload;
}) {
  const capitalizedLevel =
    application.job.level[0].toUpperCase() +
    application.job.level.slice(1).toLowerCase();
  const capitalizedModality =
    application.job.modality[0].toUpperCase() +
    application.job.modality.slice(1).toLowerCase();

  return (
    <Link href={APP_URLS.job(application.jobId)} prefetch={false}>
      <div className="px-4 py-4 border-y border-y-background-700">
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
          <div className="flex flex-col gap-0">
            <p className="text-lg font-medium">{application.job.title}</p>
            <p className="text-background-300 text-sm/[14px] truncate italic">
              {application.job.location ?? "Remoto"}
            </p>
          </div>
        </div>

        {/* Job level and modality tags */}
        <div className="flex flex-row gap-2 mt-3">
          {/* Level */}
          <div className="flex flex-row gap-1 items-center px-2 py-1 rounded-md bg-background-700 text-background-300">
            {(() => {
              switch (application.job.level) {
                case "ESTAGIÁRIO":
                  return <SproutIcon size={20} aria-hidden="true" />;
                case "JÚNIOR":
                  return <CircleFadingArrowUpIcon size={20} aria-hidden="true" />;
                case "PLENO":
                  return <BriefcaseIcon size={20} aria-hidden="true" />;
                case "SÊNIOR":
                  return <AwardIcon size={20} aria-hidden="true" />;
                default:
                  return null;
              }
            })()}
            <p className="font-semibold text-sm">{capitalizedLevel}</p>
          </div>

          {/* Modality */}
          <div className="flex flex-row gap-1 items-center px-2 py-1 rounded-md bg-background-700 text-background-300">
            {(() => {
              switch (application.job.modality) {
                case "PRESENCIAL":
                  return <BuildingIcon size={20} aria-hidden="true" />;
                case "HÍBRIDO":
                  return <RefreshIcon size={20} aria-hidden="true" />;
                case "REMOTO":
                  return <HouseIcon size={20} aria-hidden="true" />;
                default:
                  return null;
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
      </div>
    </Link>
  );
}

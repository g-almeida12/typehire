import { JobResponsePayload } from "@/lib/modules/job";
import { jobLevelMapper, jobModalityMapper } from "@/utils/mappers";
import {
  AwardIcon,
  BriefcaseIcon,
  BuildingIcon,
  CircleFadingArrowUpIcon,
  SproutIcon,
  RefreshIcon,
  HouseIcon,
} from "@/components/icons";

export function JobInfoTags({
  level,
  modality,
}: Pick<JobResponsePayload, "level" | "modality">) {
  return (
    <ul className="flex flex-row flex-wrap gap-2 mt-1">
      {/* Level */}
      <li className="flex flex-row gap-1 items-center px-2 py-1 rounded-md bg-background-700 text-background-300">
        {(() => {
          switch (level) {
            case "ESTAGIÁRIO":
              return <SproutIcon size={20} aria-hidden="true" />;
            case "JÚNIOR":
              return <CircleFadingArrowUpIcon size={20} aria-hidden="true" />;
            case "PLENO":
              return <BriefcaseIcon size={20} aria-hidden="true" />;
            case "SÊNIOR":
              return <AwardIcon size={20} aria-hidden="true" />;
          }
        })()}
        <p className="font-semibold text-sm">{jobLevelMapper[level]}</p>
      </li>

      {/* Modality */}
      <li className="flex flex-row gap-1 items-center px-2 py-1 rounded-md bg-background-700 text-background-300">
        {(() => {
          switch (modality) {
            case "PRESENCIAL":
              return <BuildingIcon size={20} aria-hidden="true" />;
            case "HÍBRIDO":
              return <RefreshIcon size={20} aria-hidden="true" />;
            case "REMOTO":
              return <HouseIcon size={20} aria-hidden="true" />;
          }
        })()}
        <p className="font-semibold text-sm">{jobModalityMapper[modality]}</p>
      </li>
    </ul>
  );
}

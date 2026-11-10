import { JobResponsePayload } from "@/lib/modules/job";
import { JOB_LEVEL_LABELS, JOB_MODALITY_LABELS } from "@/utils/mappers";
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
            case "INTERN":
              return <SproutIcon size={20} aria-hidden="true" />;
            case "JUNIOR":
              return <CircleFadingArrowUpIcon size={20} aria-hidden="true" />;
            case "MID":
              return <BriefcaseIcon size={20} aria-hidden="true" />;
            case "SENIOR":
              return <AwardIcon size={20} aria-hidden="true" />;
          }
        })()}
        <p className="font-semibold text-sm">{JOB_LEVEL_LABELS[level]}</p>
      </li>

      {/* Modality */}
      <li className="flex flex-row gap-1 items-center px-2 py-1 rounded-md bg-background-700 text-background-300">
        {(() => {
          switch (modality) {
            case "ON_SITE":
              return <BuildingIcon size={20} aria-hidden="true" />;
            case "HYBRID":
              return <RefreshIcon size={20} aria-hidden="true" />;
            case "REMOTE":
              return <HouseIcon size={20} aria-hidden="true" />;
          }
        })()}
        <p className="font-semibold text-sm">{JOB_MODALITY_LABELS[modality]}</p>
      </li>
    </ul>
  );
}

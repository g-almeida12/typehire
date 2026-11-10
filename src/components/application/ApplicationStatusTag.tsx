import { ApplicationStatus } from "@/database/generated/enums";
import { applicationStatusMapper } from "@/utils/mappers";

interface ApplicationStatusTagProps {
  status: ApplicationStatus;
}

export function ApplicationStatusTag({ status }: ApplicationStatusTagProps) {
  let tagColors: { bg: string; text: string };
  switch (status) {
    case "PENDING":
      tagColors = { bg: "#FFD04D30", text: "#FFD04D" };
      break;
    case "REVIEW":
      tagColors = { bg: "#4DFFE130", text: "#4DFFE1" };
      break;
    case "INTERVIEW":
      tagColors = { bg: "#D34DFF30", text: "#D34DFF" };
      break;
    case "HIRED":
      tagColors = { bg: "#22C22230", text: "#4DFF4D" };
      break;
    case "REJECTED":
      tagColors = { bg: "#FF4D4D30", text: "#FF4D4D" };
      break;
    default:
      tagColors = { bg: "#ECECEC30", text: "#ECECEC" };
  }

  return (
    <span
      className="flex flex-row items-center gap-2 px-2 py-1 rounded-md w-max"
      style={{ backgroundColor: tagColors.bg, color: tagColors.text }}
    >
      <span className="text-sm font-medium">
        {applicationStatusMapper[status]}
      </span>
    </span>
  );
}

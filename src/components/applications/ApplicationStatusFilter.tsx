"use client";

import { ApplicationStatus } from "@/database/generated/enums";
import { JobApplicationStatuses } from "@/lib/modules/application";
import { applicationStatusMapper } from "@/utils/mappers";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function ApplicationStatusFilter({
  jobApplicationStatuses,
}: {
  jobApplicationStatuses: JobApplicationStatuses;
}) {
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<
    ApplicationStatus | undefined
  >(undefined);

  const tagColorsMap: Record<ApplicationStatus | "undefined", any> = {
    PENDING: { bg: "#FFD04D30", text: "#FFD04D" },
    REVIEW: { bg: "#4DFFE130", text: "#4DFFE1" },
    INTERVIEW: { bg: "#D34DFF30", text: "#D34DFF" },
    HIRED: { bg: "#22C22230", text: "#4DFF4D" },
    REJECTED: { bg: "#FF4D4D30", text: "#FF4D4D" },
    undefined: { bg: "#C0C0C030", text: "#C0C0C0" },
  };

  const handleStatusClick = (status: ApplicationStatus | undefined) => {
    setSelectedStatus(status);
    const searchParams = new URLSearchParams();
    if (status) {
      searchParams.set("status", status);
    }

    startTransition(() => router.replace(`?${searchParams.toString()}`));
  };

  return (
    <div className="overflow-x-scroll pb-2 select-none">
      <ul className="flex flex-row gap-2">
        <li
          className="flex flex-row shrink-0 w-fit items-center justify-center px-2 py-1 rounded-md text-sm font-medium"
          aria-disabled={isLoading}
          style={{
            backgroundColor:
              undefined === selectedStatus
                ? tagColorsMap["undefined"].bg
                : "transparent",
            border:
              undefined === selectedStatus
                ? "2px solid transparent"
                : `2px solid ${tagColorsMap["undefined"].bg}`,
            color: tagColorsMap["undefined"].text,
          }}
        >
          <button
            onClick={() => handleStatusClick(undefined)}
            style={{
              pointerEvents: isLoading ? "none" : "auto",
              cursor: isLoading ? "text" : "pointer",
            }}
          >
            {jobApplicationStatuses.ALL} No total
          </button>
        </li>
        {(
          [
            "PENDING",
            "INTERVIEW",
            "REVIEW",
            "HIRED",
            "REJECTED",
          ] as ApplicationStatus[]
        ).map((status) => (
          <li
            className="flex flex-row shrink-0 w-fit items-center justify-center px-2 py-1 rounded-md text-sm font-medium"
            style={{
              backgroundColor:
                status === selectedStatus
                  ? tagColorsMap[status].bg
                  : "transparent",
              border:
                status === selectedStatus
                  ? "2px solid transparent"
                  : `2px solid ${tagColorsMap[status].bg}`,
              color: tagColorsMap[status].text,
            }}
            key={status}
            aria-disabled={isLoading}
          >
            <button
              onClick={() => handleStatusClick(status)}
              style={{
                pointerEvents: isLoading ? "none" : "auto",
                cursor: isLoading ? "text" : "pointer",
              }}
            >
              {jobApplicationStatuses[status]}{" "}
              {mapApplicationStatusCount(
                jobApplicationStatuses[status],
                status,
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function mapApplicationStatusCount(count: number, status: ApplicationStatus) {
  const mappedStatus = applicationStatusMapper[status];

  switch (status) {
    case "PENDING":
    case "HIRED":
    case "REJECTED":
      if (count > 1) return mappedStatus + "(s)";
      else return mappedStatus;
    case "INTERVIEW":
    case "REVIEW":
      return mappedStatus;
  }
}

"use client";

import { BookmarkIcon } from "@/components/icons";
import { ApplicationStatus } from "@/database/generated/enums";
import { Dropdown } from "../common/Dropdown/Dropdown";
import { useRouter, useSearchParams } from "next/navigation";
import { applicationStatusMapper } from "@/utils/mappers";

const STATUS = [
  "Em qualquer etapa",
  ...Object.keys(ApplicationStatus).map(
    (s) => applicationStatusMapper[s as ApplicationStatus],
  ),
];

export function ApplicationFilterDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialValue = searchParams.get("status")
    ? applicationStatusMapper[searchParams.get("status") as ApplicationStatus]
    : STATUS[0];

  const handleStatusClick = (status: ApplicationStatus | undefined) => {
    const searchParams = new URLSearchParams();
    if (status) {
      searchParams.set("status", status);
    }

    router.push(`?${searchParams.toString()}`);
  };

  return (
    <Dropdown
      Icon={BookmarkIcon}
      label="Status das candidaturas"
      options={STATUS}
      onOptionClick={(status) => {
        const sts = Object.keys(applicationStatusMapper).find(
          (key) => applicationStatusMapper[key as ApplicationStatus] === status,
        ) as ApplicationStatus | undefined;

        handleStatusClick(sts);
      }}
      value={initialValue}
    />
  );
}

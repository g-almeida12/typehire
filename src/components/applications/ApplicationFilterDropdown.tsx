"use client";

import { BookmarkIcon } from "@/components/icons";
import { ApplicationStatus } from "@/database/generated/enums";
import { Dropdown } from "../common/Dropdown/Dropdown";
import { useRouter, useSearchParams } from "next/navigation";
import { applicationStatusMapper } from "@/utils/mappers";
import { useState, useTransition } from "react";
import { DropdownButtonField } from "../common/Dropdown/DropdownButtonField";
import { useListNavigation } from "@/lib/hooks/useListNavigation";
import { DropdownOption } from "../common/Dropdown/DropdownOption";

const STATUS = [
  "Em qualquer etapa",
  ...Object.keys(ApplicationStatus).map(
    (s) => applicationStatusMapper[s as ApplicationStatus],
  ),
];

export function ApplicationFilterDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, startTransition] = useTransition();
  const statusValue = searchParams.get("status")
    ? applicationStatusMapper[searchParams.get("status") as ApplicationStatus]
    : STATUS[0];

  const handleStatusClick = (status: string) => {
    const selectedStatus = Object.keys(applicationStatusMapper).find(
      (key) => applicationStatusMapper[key as ApplicationStatus] === status,
    ) as ApplicationStatus | undefined;

    const searchParams = new URLSearchParams();
    if (selectedStatus) {
      searchParams.set("status", selectedStatus);
    }

    setIsOpen(false);
    startTransition(async () => router.push(`?${searchParams.toString()}`));
  };

  const { activeIndex, itemsRef, handleKeyDown } = useListNavigation(
    STATUS.length,
    isOpen,
    (idx) => handleStatusClick(STATUS[idx]),
    () => setIsOpen(false),
  );

  return (
    <Dropdown
      Icon={BookmarkIcon}
      label={"Status das candidaturas"}
      disabled={isLoading}
      error={""}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      field={
        <DropdownButtonField
          disabled={isLoading}
          isOpen={isOpen}
          onToggle={() => setIsOpen((prev) => !prev)}
          handleKeyDown={handleKeyDown}
          selectedValue={statusValue}
          controls=""
        />
      }
    >
      {STATUS.map((sts, idx) => (
        <DropdownOption
          activeIndex={activeIndex}
          index={idx}
          isSelected={sts === statusValue}
          onOptionClick={() => handleStatusClick(STATUS[idx])}
          ref={(el) => {
            itemsRef.current[idx] = el;
          }}
        >
          {STATUS[idx]}
        </DropdownOption>
      ))}
    </Dropdown>
  );
}

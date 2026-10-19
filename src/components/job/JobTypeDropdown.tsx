import { Control, useController } from "react-hook-form";
import { Dropdown } from "../common/Dropdown/Dropdown";
import { DropdownButtonField } from "../common/Dropdown/DropdownButtonField";
import { jobTypeMapper } from "@/utils/mappers";
import { ClockIcon } from "@/components/icons";
import { DropdownOption } from "../common/Dropdown/DropdownOption";
import { JobType } from "@/database/generated/enums";
import { JobClientCreatePayload, JobUpdatePayload } from "@/lib/modules/job";
import { useState } from "react";
import { useListNavigation } from "@/lib/hooks/useListNavigation";

interface JobTypeDropdownProps {
  control: Control<JobClientCreatePayload | JobUpdatePayload>;
  isLoading: boolean;
  error: string | undefined;
}

const TYPES = Object.values(JobType);

export function JobTypeDropdown({
  control,
  isLoading,
  error,
}: JobTypeDropdownProps) {
  const { field } = useController({ name: "type", control });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { activeIndex, handleKeyDown, itemsRef } =
    useListNavigation(
      TYPES.length,
      isOpen,
      () => field.onChange(TYPES[activeIndex]),
      () => setIsOpen(false),
    );

  return (
    <Dropdown
      label="Período de duração do trabalho"
      Icon={ClockIcon}
      field={
        <DropdownButtonField
          selectedValue={jobTypeMapper[field.value ?? TYPES[0]]}
          disabled={isLoading}
          handleKeyDown={handleKeyDown}
          isOpen={isOpen}
          controls="type-dropdown"
          onToggle={() => setIsOpen((prev) => !prev)}
        />
      }
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      error={error}
      disabled={isLoading}
    >
      {TYPES.map((tp, idx) => (
        <DropdownOption
          index={idx}
          isSelected={field.value === tp}
          activeIndex={activeIndex}
          onOptionClick={() => {
            field.onChange(tp);
            setIsOpen(false);
          }}
          ref={(el) => {
            itemsRef.current[idx] = el;
          }}
        >
          {jobTypeMapper[tp as JobType]}
        </DropdownOption>
      ))}
    </Dropdown>
  );
}

import { Control, FieldValues, Path, useController } from "react-hook-form";
import { Dropdown } from "../common/Dropdown/Dropdown";
import { DropdownButtonField } from "../common/Dropdown/DropdownButtonField";
import { jobTypeMapper } from "@/utils/mappers";
import { ClockIcon } from "@/components/icons";
import { DropdownOption } from "../common/Dropdown/DropdownOption";
import { JobType } from "@/database/generated/enums";
import { useState } from "react";
import { useListNavigation } from "@/lib/hooks/useListNavigation";

type ExtendedFieldValues = FieldValues & { type?: JobType | undefined };
const TYPES = Object.values(JobType);

interface JobTypeDropdownProps<T extends ExtendedFieldValues> {
  control: Control<T>;
  isLoading: boolean;
  error: string | undefined;
}

export function JobTypeDropdown<T extends ExtendedFieldValues>({
  control,
  isLoading,
  error,
}: JobTypeDropdownProps<T>) {
  const { field } = useController({ name: "type" as Path<T>, control });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { activeIndex, handleKeyDown, itemsRef } = useListNavigation(
    TYPES.length,
    isOpen,
    () => field.onChange(TYPES[activeIndex]),
    () => setIsOpen(false),
  );

  return (
    <Dropdown
      label="Período de duração do trabalho"
      Icon={ClockIcon}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      error={error}
      disabled={isLoading}
      field={
        <DropdownButtonField
          selectedValue={jobTypeMapper[field.value ?? TYPES[0]]}
          disabled={isLoading}
          handleKeyDown={handleKeyDown}
          isOpen={isOpen}
          onToggle={() => setIsOpen((prev) => !prev)}
        />
      }
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

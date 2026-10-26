import { Control, FieldValues, Path, useController } from "react-hook-form";
import { Dropdown } from "../common/Dropdown/Dropdown";
import { DropdownButtonField } from "../common/Dropdown/DropdownButtonField";
import { jobLevelMapper } from "@/utils/mappers";
import { AwardIcon } from "@/components/icons";
import { DropdownOption } from "../common/Dropdown/DropdownOption";
import { JobLevel } from "@/database/generated/enums";
import { useState } from "react";
import { useListNavigation } from "@/lib/hooks/useListNavigation";

type ExtendedFieldValues = FieldValues & { level?: JobLevel | undefined };
const LEVELS = Object.values(JobLevel);

interface JobLevelDropdownProps<T extends ExtendedFieldValues> {
  control: Control<T>;
  isLoading: boolean;
  error: string | undefined;
}

export function JobLevelDropdown<T extends ExtendedFieldValues>({
  control,
  isLoading,
  error,
}: JobLevelDropdownProps<T>) {
  const { field } = useController({ name: "level" as Path<T>, control });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { activeIndex, handleKeyDown, itemsRef } = useListNavigation(
    LEVELS.length,
    isOpen,
    () => field.onChange(LEVELS[activeIndex]),
    () => setIsOpen(false),
  );

  return (
    <Dropdown
      label="Experiência necessária"
      Icon={AwardIcon}
      field={
        <DropdownButtonField
          selectedValue={jobLevelMapper[field.value ?? LEVELS[0]]}
          disabled={isLoading}
          handleKeyDown={handleKeyDown}
          isOpen={isOpen}
          controls="level-dropdown"
          onToggle={() => setIsOpen((prev) => !prev)}
        />
      }
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      error={error}
      disabled={isLoading}
    >
      {LEVELS.map((lv, idx) => (
        <DropdownOption
          index={idx}
          isSelected={field.value === lv}
          activeIndex={activeIndex}
          onOptionClick={() => {
            field.onChange(lv);
            setIsOpen(false);
          }}
          ref={(el) => {
            itemsRef.current[idx] = el;
          }}
        >
          {jobLevelMapper[lv as JobLevel]}
        </DropdownOption>
      ))}
    </Dropdown>
  );
}

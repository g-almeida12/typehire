import { Control, FieldValues, Path, useController } from "react-hook-form";
import { Dropdown } from "../common/Dropdown/Dropdown";
import { DropdownButtonField } from "../common/Dropdown/DropdownButtonField";
import { jobModalityMapper } from "@/utils/mappers";
import { ClockIcon } from "@/components/icons";
import { DropdownOption } from "../common/Dropdown/DropdownOption";
import { JobModality } from "@/database/generated/enums";
import { useState } from "react";
import { useListNavigation } from "@/lib/hooks/useListNavigation";

type ExtendedFieldValues = FieldValues & { modality?: JobModality | undefined };
const MODALITIES = Object.values(JobModality);

interface JobModalityDropdownProps<T extends ExtendedFieldValues> {
  control: Control<T>;
  isLoading: boolean;
  error: string | undefined;
}

export function JobModalityDropdown<T extends ExtendedFieldValues>({
  control,
  isLoading,
  error,
}: JobModalityDropdownProps<T>) {
  const { field } = useController({ name: "modality" as Path<T>, control });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { activeIndex, handleKeyDown, itemsRef } = useListNavigation(
    MODALITIES.length,
    isOpen,
    () => field.onChange(MODALITIES[activeIndex]),
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
          selectedValue={jobModalityMapper[field.value ?? MODALITIES[0]]}
          disabled={isLoading}
          handleKeyDown={handleKeyDown}
          isOpen={isOpen}
          onToggle={() => setIsOpen((prev) => !prev)}
        />
      }
    >
      {MODALITIES.map((mod, idx) => (
        <DropdownOption
          index={idx}
          isSelected={field.value === mod}
          activeIndex={activeIndex}
          onOptionClick={() => {
            field.onChange(mod);
            setIsOpen(false);
          }}
          ref={(el) => {
            itemsRef.current[idx] = el;
          }}
        >
          {jobModalityMapper[mod as JobModality]}
        </DropdownOption>
      ))}
    </Dropdown>
  );
}

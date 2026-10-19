import { Control, useController } from "react-hook-form";
import { Dropdown } from "../common/Dropdown/Dropdown";
import { DropdownButtonField } from "../common/Dropdown/DropdownButtonField";
import { jobModalityMapper } from "@/utils/mappers";
import { ClockIcon } from "@/components/icons";
import { DropdownOption } from "../common/Dropdown/DropdownOption";
import { JobModality } from "@/database/generated/enums";
import { JobClientCreatePayload, JobUpdatePayload } from "@/lib/modules/job";
import { useState } from "react";
import { useListNavigation } from "@/lib/hooks/useListNavigation";

interface JobModalityDropdownProps {
  control: Control<JobClientCreatePayload | JobUpdatePayload>;
  isLoading: boolean;
  error: string | undefined;
}

const MODALITIES = Object.values(JobModality);

export function JobModalityDropdown({
  control,
  isLoading,
  error,
}: JobModalityDropdownProps) {
  const { field } = useController({ name: "modality", control });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { activeIndex, handleKeyDown, itemsRef } =
    useListNavigation(
      MODALITIES.length,
      isOpen,
      () => field.onChange(MODALITIES[activeIndex]),
      () => setIsOpen(false),
    );

  return (
    <Dropdown
      label="Período de duração do trabalho"
      Icon={ClockIcon}
      field={
        <DropdownButtonField
          selectedValue={jobModalityMapper[field.value ?? MODALITIES[0]]}
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

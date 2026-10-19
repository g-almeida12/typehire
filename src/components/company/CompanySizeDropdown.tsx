import { Control, useController } from "react-hook-form";
import { Dropdown } from "../common/Dropdown/Dropdown";
import { DropdownButtonField } from "../common/Dropdown/DropdownButtonField";
import { companySizeMapper } from "@/utils/mappers";
import { ClockIcon } from "@/components/icons";
import { DropdownOption } from "../common/Dropdown/DropdownOption";
import { CompanySize } from "@/database/generated/enums";
import { useState } from "react";
import { useListNavigation } from "@/lib/hooks/useListNavigation";
import { CompanyCreatePayload, CompanyUpdatePayload } from "@/lib/modules/company";

interface CompanySizeDropdownProps {
  control: Control<CompanyCreatePayload | CompanyUpdatePayload>;
  isLoading: boolean;
  error: string | undefined;
}

const SIZES = Object.values(CompanySize);

export function CompanySizeDropdown({
  control,
  isLoading,
  error,
}: CompanySizeDropdownProps) {
  const { field } = useController({ name: "size", control });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { activeIndex, handleKeyDown, itemsRef } =
    useListNavigation(
      SIZES.length,
      isOpen,
      () => field.onChange(SIZES[activeIndex]),
      () => setIsOpen(false),
    );

  return (
    <Dropdown
      label="Período de duração do trabalho"
      Icon={ClockIcon}
      field={
        <DropdownButtonField
          selectedValue={companySizeMapper[field.value ?? SIZES[0]]}
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
      {SIZES.map((sz, idx) => (
        <DropdownOption
          index={idx}
          isSelected={field.value === sz}
          activeIndex={activeIndex}
          onOptionClick={() => {
            field.onChange(sz);
            setIsOpen(false);
          }}
          ref={(el) => {
            itemsRef.current[idx] = el;
          }}
        >
          {companySizeMapper[sz as CompanySize]}
        </DropdownOption>
      ))}
    </Dropdown>
  );
}

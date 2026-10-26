import { Control, FieldValues, Path, useController } from "react-hook-form";
import { Dropdown } from "../common/Dropdown/Dropdown";
import { DropdownButtonField } from "../common/Dropdown/DropdownButtonField";
import { companySizeMapper } from "@/utils/mappers";
import { ClockIcon } from "@/components/icons";
import { DropdownOption } from "../common/Dropdown/DropdownOption";
import { CompanySize } from "@/database/generated/enums";
import { useState } from "react";
import { useListNavigation } from "@/lib/hooks/useListNavigation";

type ExtendedFieldValues = FieldValues & { size?: CompanySize | undefined };
const SIZES = Object.values(CompanySize);

interface CompanySizeDropdownProps<T extends ExtendedFieldValues> {
  control: Control<T>;
  isLoading: boolean;
  error: string | undefined;
}

export function CompanySizeDropdown<T extends ExtendedFieldValues>({
  control,
  isLoading,
  error,
}: CompanySizeDropdownProps<T>) {
  const { field } = useController({ name: "size" as Path<T>, control });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { activeIndex, handleKeyDown, itemsRef } = useListNavigation(
    SIZES.length,
    isOpen,
    () => field.onChange(SIZES[activeIndex]),
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
          selectedValue={companySizeMapper[field.value ?? SIZES[0]]}
          disabled={isLoading}
          handleKeyDown={handleKeyDown}
          isOpen={isOpen}
          onToggle={() => setIsOpen((prev) => !prev)}
        />
      }
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

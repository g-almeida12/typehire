import { ChevronDownIcon } from "@/components/icons";

interface DropdownButtonFieldProps {
  selectedValue: string;
  isOpen: boolean;
  controls: string;
  disabled: boolean;
  onToggle: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
}

export function DropdownButtonField({
  selectedValue,
  isOpen,
  controls,
  disabled,
  onToggle,
  handleKeyDown,
}: DropdownButtonFieldProps) {
  return (
    <button
      className="flex flex-row items-center justify-between w-full text-left cursor-pointer"
      onClick={(e) => {
        if (disabled) return;

        e.preventDefault();
        onToggle();
      }}
      onKeyDown={handleKeyDown}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls={controls}
      type="button"
    >
      {selectedValue}
      <ChevronDownIcon
        size={24}
        className={`shrink-0 ${disabled ? "text-background-500" : `text-background-400 group-focus-within:text-background-800 ${isOpen ? "text-background-800" : "text-background-400"}`} `}
      />
    </button>
  );
}

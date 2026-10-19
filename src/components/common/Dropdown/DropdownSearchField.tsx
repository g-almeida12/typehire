import { InputHTMLAttributes } from "react";

interface DropdownSearchFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  search: string;
  setSearch: (search: string) => void;
  isOpen: boolean;
  controls: string;
  onOpen: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
}

export function DropdownSearchField({
  search,
  setSearch,
  isOpen,
  controls,
  onOpen,
  handleKeyDown,
  ...props
}: DropdownSearchFieldProps) {
  return (
    <input
      {...props}
      className="w-full focus:outline-none"
      value={search}
      onFocus={() => {
        if (props.disabled) return;
        onOpen();
      }}
      onChange={(e) => {
        if (props.disabled) return;
        setSearch(e.target.value);

        if (!isOpen) onOpen();
      }}
      onKeyDown={handleKeyDown}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls={controls}
    />
  );
}

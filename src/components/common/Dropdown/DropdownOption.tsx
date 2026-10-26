import React, { forwardRef } from "react";

interface DropdownOptionProps {
  isSelected: boolean;
  index: number;
  activeIndex: number;
  onOptionClick: () => void;
  customClassName?: string;
  children: React.ReactNode;
}

export const DropdownOption = forwardRef<HTMLLIElement, DropdownOptionProps>(
  (
    {
      isSelected,
      index,
      activeIndex,
      onOptionClick,
      customClassName,
      children,
    },
    refCallback,
  ) => {
    const styles = isSelected
      ? index === activeIndex
        ? "bg-green-600 text-green-950"
        : "bg-green-500 text-green-950"
      : index === activeIndex
        ? "bg-background-500 text-background-900"
        : "hover:bg-background-400 hover:text-background-800";

    return (
      <li
        className={customClassName ?? `w-full p-1 ${styles} cursor-pointer`}
        aria-selected={isSelected}
        onClick={onOptionClick}
        ref={refCallback}
        role="option"
      >
        {children}
      </li>
    );
  },
);

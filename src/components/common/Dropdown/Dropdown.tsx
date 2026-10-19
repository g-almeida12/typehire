"use client";

import { IconKey } from "@/components/icons";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { useRef } from "react";

interface DropdownProps {
  label: string;
  Icon: IconKey;
  field: React.ReactNode
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  disabled: boolean;
  error: string | undefined;
}

export function Dropdown({
  label,
  Icon,
  field,
  children,
  isOpen,
  onClose,
  disabled,
  error,
}: DropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, onClose);

  const containerStyles = disabled
    ? "rounded-md border-background-900 bg-background-900 text-background-200"
    : `group-hover:border-background-300 group-focus-within:bg-background-300 group-focus-within:text-background-800 group-focus-within:border-background-300 ${isOpen ? "rounded-md rounded-b-none bg-background-300 text-background-800 border-background-300" : "rounded-md border-background-800 bg-background-800"}`;
  const iconStyles = disabled
    ? "text-background-500"
    : `text-background-400 group-focus-within:text-background-800 ${isOpen ? "text-background-800" : "text-background-400"}`;

  return (
    <div
      className="relative group w-full flex flex-col items-start"
      ref={containerRef}
    >
      <span className="w-full mb-1 text-left text-sm text-background-300">
        {label}
      </span>

      <div
        className={`w-full flex flex-row gap-2 items-center justify-between border-2 px-2 py-1 transition-colors ${containerStyles}`}
      >
        <Icon size={24} className={`shrink-0 ${iconStyles}`} />
        {field}
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <ul
          className={`absolute z-50 top-full w-full max-h-70 overflow-y-scroll rounded-b-md border-t border-background-700 bg-background-300 text-background-700 ${isOpen ? "shadow-lg" : ""}`}
          id={label}
          role="listbox"
        >
          {children}
        </ul>
      )}
      {error && (
        <p className="text-left text-sm text-red-500 w-full">{error}</p>
      )}
    </div>
  );
}

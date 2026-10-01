"use client";

import { ChevronDownIcon, IconKey } from "@/components/icons";
import { useEffect, useRef, useState } from "react";

interface DropdownProps {
  label: string;
  Icon: IconKey;
  options: string[];
  onOptionClick: (option: string) => void;
  value?: string;
  error?: string;
}

export function Dropdown({
  label,
  Icon,
  options,
  onOptionClick,
  value,
  error,
}: DropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<(HTMLLIElement | null)[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>(
    value ?? options[0],
  );
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Scroll the dropdown to display the selected option
  useEffect(() => {
    if (isOpen && optionsRef.current[selectedIndex]) {
      optionsRef.current[selectedIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [isOpen, selectedIndex]);

  // Close the dropdown  when the user clicks outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Call the callback function and reset the input
  const handleOptionCLick = (option: string) => {
    onOptionClick(option);
    setSelectedOption(option);
    setIsOpen(false);
    setSelectedIndex(0);
  };

  // Handle the native actions for navigation inside the dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        break;

      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        break;

      case "Enter":
        e.preventDefault();
        if (options[selectedIndex]) {
          handleOptionCLick(options[selectedIndex]);
        }
        break;

      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className="group w-full flex flex-col items-start" ref={containerRef}>
      <span className="w-full mb-1 text-left text-sm text-background-300">
        {label}
      </span>

      {/* Selected option */}
      <div
        className={`w-full flex flex-row gap-2 items-center justify-between border-2 px-2 py-1 group-hover:border-background-300 group-focus-within:bg-background-300 group-focus-within:text-background-800 group-focus-within:border-background-300 transition-colors ${isOpen ? "rounded-md rounded-b-none bg-background-300 text-background-800 border-background-300" : "rounded-md border-background-800 bg-background-800"}`}
      >
        <div className="flex flex-row gap-2 w-full">
          <Icon
            size={24}
            className={`shrink-0 text-background-400 group-focus-within:text-background-800 ${isOpen ? "text-background-800" : "text-background-400"}`}
          />

          <button
            className="flex flex-row items-center justify-between w-full text-left cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen((prev) => !prev);
            }}
            onKeyDown={handleKeyDown}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls={label}
            type="button"
          >
            {selectedOption}
            <ChevronDownIcon
              size={24}
              className={`shrink-0 text-background-400 group-focus-within:text-background-800 ${isOpen ? "text-background-800" : "text-background-400"}`}
            />
          </button>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="w-full max-h-70 overflow-y-scroll rounded-b-md border-t border-background-700 bg-background-300 text-background-700"
          id={label}
          role="listbox"
        >
          <ul>
            {options.map((opt, idx) => {
              const styles =
                opt === selectedOption
                  ? idx === selectedIndex
                    ? "bg-green-600 text-green-950"
                    : "bg-green-500 text-green-950"
                  : idx === selectedIndex
                    ? "bg-background-500 text-background-900"
                    : "hover:bg-background-400 hover:text-background-800";

              return (
                <li
                  className={`w-full ${styles} cursor-pointer`}
                  onClick={() => {
                    if (opt !== selectedOption) {
                      handleOptionCLick(opt);
                    }
                  }}
                  ref={(el) => {
                    optionsRef.current[idx] = el;
                  }}
                  key={`select-${opt}`}
                  role="option"
                >
                  <p className="px-2 py-1 text-sm select-none font-medium">
                    {opt}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {error && (
        <p className="text-left text-sm text-red-500 w-full">{error}</p>
      )}
    </div>
  );
}

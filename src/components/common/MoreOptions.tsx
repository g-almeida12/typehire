"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MoreOptionsIcon } from "@/components/icons";

interface MoreOptionsProps {
  options: { text: React.ReactNode; onClick: () => void }[];
}

export function MoreOptions({ options }: MoreOptionsProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const uniqueId = useId();
  const moreOptionsRef = useRef<HTMLDivElement>(null);

  // Close the option list when the user clicks outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        moreOptionsRef.current &&
        !moreOptionsRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={moreOptionsRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="cursor-pointer"
        aria-expanded={isOpen}
        aria-controls={uniqueId}
        aria-label="Abrir menu de opções"
      >
        <MoreOptionsIcon />
      </button>

      {isOpen && (
        <ul
          className="w-max absolute right-0 top-6 z-50 rounded-md shadow-lg bg-background-800"
          id={uniqueId}
          role="listbox"
        >
          {options?.map((opt, idx) => (
            <li
              onClick={() => {
                opt.onClick();
                setIsOpen(false);
              }}
              className="w-full flex whitespace-nowrap flex-row items-center gap-2 rounded-md px-2 py-1 cursor-pointer hover:bg-background-700"
              key={`${uniqueId}-${idx}`}
              role="option"
            >
              {opt.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

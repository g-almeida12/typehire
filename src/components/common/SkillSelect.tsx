"use client";

import { IconKey, BookmarkIcon } from "@/components/icons";
import { Skill } from "@/database/generated/enums";
import {
  forwardRef,
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";

interface SkillSelectProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  skills: { text: string; value: Skill; isInUserSkills: boolean }[];
  onOptionClick: (skill: Skill) => void;
  error?: string;
}

export const SkillSelect = forwardRef<HTMLInputElement, SkillSelectProps>(
  ({ label, skills, onOptionClick, error, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");

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

      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleOptionClick = (skill: Skill) => {
      onOptionClick(skill);
      setSearch("");
      setIsOpen(false);
    };

    return (
      <div
        className="group w-full flex flex-col items-start"
        ref={containerRef}
      >
        <label
          htmlFor={props.id}
          className="w-full mb-1 text-left text-sm text-background-300"
        >
          {label}
        </label>

        {/* Input */}
        <div
          className={`w-full flex flex-row gap-2 items-center justify-between border-2 px-2 py-1 group-hover:border-background-300 group-focus-within:bg-background-300 group-focus-within:text-background-800 group-focus-within:border-background-300 transition-colors ${isOpen ? "rounded-md rounded-b-none bg-background-300 text-background-800 border-background-300" : "rounded-md border-background-800 bg-background-800"}`}
        >
          <div className="flex flex-row gap-2 w-full">
            <BookmarkIcon
              size={24}
              className={`shrink-0 ${isOpen ? "text-background-800" : "text-background-400"}`}
            />
            <input
              {...props}
              className="w-full focus:outline-none"
              ref={ref}
              onFocus={() => setIsOpen(true)}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              role="combobox"
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-controls={label}
            />
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div
            className="w-full max-h-70 overflow-y-scroll rounded-b-md border-t border-background-700 bg-background-300 text-background-700"
            id={label}
            role="listbox"
          >
            {skills.map((s) => (
              <div
                className={`w-full ${s.isInUserSkills ? "bg-green-500 text-green-950" : "cursor-pointer hover:bg-background-400 hover:text-background-800"} `}
                onClick={() => {
                  if (!s.isInUserSkills) {
                    handleOptionClick(s.value);
                  }
                }}
                key={`select-${s.value}`}
              >
                <p className="px-2 py-1 text-sm select-none font-medium">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        )}
        {error && (
          <p className="text-left text-sm text-red-500 w-full">{error}</p>
        )}
      </div>
    );
  },
);

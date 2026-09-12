"use client";

import { SlidersIcon, SearchIcon } from "@/components/icons";
import { forwardRef, InputHTMLAttributes } from "react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ placeholder, ...props }: SearchInputProps, ref) => {
    return (
      <div className="max-w-full">
        <div className="max-w-full flex flex-row gap-2 items-center justify-between border-2 border-background-200 px-2 py-2 rounded-md bg-background-200 text-background-800 transition-all">
          <div className="flex flex-row gap-2 max-w-full min-w-0">
            <SearchIcon size={24} className="shrink-0" />
            <input
              type="text"
              className="min-w-0 max-w-full focus:outline-none"
              ref={ref}
              placeholder={placeholder}
              {...props}
            />
          </div>
          <div className="w-6 h-6 text-background-800">
            <button type="button">
              <SlidersIcon size={24} />
            </button>
          </div>
        </div>
      </div>
    );
  },
);

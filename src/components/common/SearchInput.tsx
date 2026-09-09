"use client";

import { FilterIcon, SearchIcon } from "@/components/icons";
import { forwardRef, InputHTMLAttributes, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  error?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder, error, ...props }: InputProps, ref) => {
    return (
      <div className="max-w-full flex flex-col items-start gap-1">
        <div className="max-w-full flex flex-row items-center justify-between border-2 border-background-200 px-2 py-2 rounded-md bg-background-200 text-background-800 transition-all">
          <div className="flex flex-row gap-2 max-w-full min-w-0">
            <SearchIcon size={24} />
            <input
              type="text"
              className="min-w-0 max-w-full focus:outline-none"
              ref={ref}
              placeholder={placeholder}
              {...props}
            />
          </div>
        </div>

        {error && (
          <p className="text-left text-sm text-red-500 w-full">{error}</p>
        )}
      </div>
    );
  },
);

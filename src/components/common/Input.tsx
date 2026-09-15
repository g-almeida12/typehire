"use client";

import {
  IconKey,
  QuestionMarkIcon,
  EyeIcon,
  EyeOffIcon,
} from "@/components/icons";
import { forwardRef, InputHTMLAttributes, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  Icon: IconKey;
  error?: string;
  helperText?: string;
  showVisibilityToggle?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      Icon,
      error,
      helperText,
      showVisibilityToggle,
      ...props
    }: InputProps,
    ref,
  ) => {
    const [isVisible, setIsVisible] = useState<boolean>(
      showVisibilityToggle ? false : true,
    );

    return (
      <div className="group w-full flex flex-col items-start gap-1">
        <label
          htmlFor={props.id}
          className="w-full text-left text-sm text-background-300"
        >
          {label}
        </label>
        <div className="w-full flex flex-row gap-2 items-center justify-between border-2 border-background-800 px-2 py-1 rounded-md disabled:bg-background-300 disabled:text-background-800 disabled:border-background-300 disabled:hover:border-background-300 bg-background-800 hover:border-background-300 focus-within:bg-background-300 focus-within:text-background-800 focus-within:border-background-300  transition-all">
          <div className="flex flex-row gap-2 w-full">
            <Icon
              size={24}
              className="shrink-0 text-background-400 group-focus-within:text-background-800"
            />
            <input
              type={isVisible ? "text" : "password"}
              className="w-full focus:outline-none"
              ref={ref}
              {...props}
            />
          </div>
          {helperText && (
            <span title={helperText} className="flex-1 cursor-help">
              <QuestionMarkIcon
                size={16}
                className="shrink-0 text-background-400 group-focus-within:text-background-800"
              />
            </span>
          )}
          {!helperText && showVisibilityToggle && (
            <button
              onClick={() => setIsVisible((prev) => !prev)}
              type="button"
              className="size-6 flex-1 cursor-pointer text-background-400 group-focus-within:text-background-700"
              tabIndex={-1}
            >
              {isVisible ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          )}
        </div>

        {error && (
          <p className="text-left text-sm text-red-500 w-full">{error}</p>
        )}
      </div>
    );
  },
);

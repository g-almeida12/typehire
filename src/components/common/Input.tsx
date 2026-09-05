"use client";

import { LucideIcon, CircleQuestionMark, Eye, EyeOff } from "lucide-react";
import { forwardRef, InputHTMLAttributes, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  Icon: LucideIcon;
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
    const [isVisible, setIsVisible] = useState<boolean>(showVisibilityToggle ? false : true);

    return (
      <div className="max-w-full flex flex-col items-start gap-1">
        <label htmlFor={label} className="text-sm text-background-300">
          {label}
        </label>
        <div className="max-w-full flex flex-row items-center justify-between border-2 border-background-800 px-2 py-1 rounded-md bg-background-800 hover:border-background-300 focus-within:bg-background-300 focus-within:text-background-800 focus-within:border-background-300 transition-all">
          <div className="flex flex-row gap-2 max-w-full min-w-0">
            <Icon size={24} />
            <input
              type={isVisible ? "text" : "password"}
              className="min-w-0 max-w-full focus:outline-none"
              id={label}
              ref={ref}
              {...props}
            />
          </div>
          {helperText && (
            <span title={helperText} className="flex-1 cursor-help">
              <CircleQuestionMark size={16} />
            </span>
          )}
          {!helperText && showVisibilityToggle && (
            <button
              onClick={() => setIsVisible((prev) => !prev)}
              type="button"
              className="flex-1 cursor-pointer"
              tabIndex={-1}
            >
              {isVisible ? <Eye /> : <EyeOff />}
            </button>
          )}
        </div>

        {error && <p className="text-left text-sm text-red-500 w-full">{error}</p>}
      </div>
    );
  },
);

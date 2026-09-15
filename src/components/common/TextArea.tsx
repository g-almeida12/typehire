"use client";

import { MessageTextIcon, QuestionMarkIcon } from "@/components/icons";
import { forwardRef, TextareaHTMLAttributes, useState } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, ...props }: TextareaProps, ref) => {
    return (
      <div className="group w-full flex flex-col items-start gap-1">
        <label
          htmlFor={props.id}
          className="w-full text-left text-sm text-background-300"
        >
          {label}
        </label>
        <div className="w-full flex flex-row gap-2 items-start justify-between border-2 border-background-800 px-2 py-1 rounded-md bg-background-800 hover:border-background-300 focus-within:bg-background-300 focus-within:text-background-800 focus-within:border-background-300 transition-all">
          <div className="flex flex-row gap-2 w-full">
            <MessageTextIcon
              size={24}
              className="shrink-0 text-background-400 group-focus-within:text-background-800"
            />
            <textarea
              className="w-full min-h-30 max-h-70 resize-y focus:outline-none"
              ref={ref}
              {...props}
            />
          </div>
          {helperText && (
            <span title={helperText} className="flex-1 cursor-help">
              <QuestionMarkIcon size={16} className="shrink-0 text-background-400 group-focus-within:text-background-800" />
            </span>
          )}
        </div>

        {error && (
          <p className="text-left text-sm text-red-500 w-full">{error}</p>
        )}
      </div>
    );
  },
);

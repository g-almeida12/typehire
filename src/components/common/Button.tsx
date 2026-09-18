"use client";

import Link from "next/link";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  variant?: "primary" | "secondary" | "ghost";
  href?: string;
}

export function Button({
  text,
  variant = "primary",
  href,
  ...props
}: ButtonProps) {
  const buttonStyles = {
    base: "block w-full max-w-125 rounded-md px-1 py-1 border-2 font-medium text-center cursor-pointer transition-all disabled:cursor-auto",
    primary: `
      border-accent-300 bg-accent-300 text-background-100 
      hover:border-accent-400 hover:bg-accent-400 hover:text-background-300
      active:border-accent-500 active:bg-accent-500 active:text-background-300
      disabled:border-accent-500 disabled:bg-accent-500 disabled:text-background-300`,
    secondary: `
      border-background-100 bg-background-100 text-accent-300
      hover:border-background-200 hover:bg-background-200 hover:text-accent-400
      active:border-background-300 active:bg-background-300 active:text-accent-500
      disabled:border-background-300 disabled:bg-background-300 disabled:text-accent-500`,
    ghost: `
      border-accent-100 bg-transparent text-accent-100
      hover:border-accent-200 hover:text-accent-200
      active:border-accent-300 active:text-accent-300
      disabled:border-accent-300 disabled:text-accent-300`,
  };

  return href ? (
    <Link
      href={href}
      className={`${buttonStyles.base} ${buttonStyles[variant]}`}
    >
      {text}
    </Link>
  ) : (
    <button
      {...props}
      className={`${buttonStyles.base} ${props.className ? props.className : buttonStyles[variant]}`}
    >
      {text}
    </button>
  );
}

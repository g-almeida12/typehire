import Link from "next/link";
import React, { HTMLAttributes } from "react";

interface CardContainerProps extends HTMLAttributes<HTMLDivElement> {
  navigateTo?: string;
  children: React.ReactNode;
}

export function CardContainer({
  navigateTo = undefined,
  children,
  ...props
}: CardContainerProps) {
  return navigateTo ? (
    <Link href={navigateTo} prefetch={false}>
      <Card {...props}>{children}</Card>
    </Link>
  ) : (
    <Card {...props}>{children}</Card>
  );
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function Card({ children, ...props }: CardProps) {
  const { className, ...others } = props;
  const baseStyles = "h-full rounded-lg bg-background-900 p-2";
  return (
    <div className={`${baseStyles} ${className}`} {...others}>
      {children}
    </div>
  );
}

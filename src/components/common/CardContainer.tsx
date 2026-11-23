import { HTMLAttributes } from "react";

interface CardContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardContainer({ children, ...props }: CardContainerProps) {
  const { className, ...others } = props;

  return (
    <div
      className={`h-full rounded-lg bg-background-900 p-2 ${className}`}
      {...others}
    >
      {children}
    </div>
  );
}

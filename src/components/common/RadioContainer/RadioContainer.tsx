import { ComponentProps } from "react";

export function RadioContainer({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={`absolute left-0 right-0 top-full z-10 mt-2 flex max-h-80 flex-col gap-5 overflow-y-auto rounded-md border border-background-700 bg-background-900 p-2 shadow-xl ${className}`}
      {...props}
    > 
      {children}
    </div>
  );
}

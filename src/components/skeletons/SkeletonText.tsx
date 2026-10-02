interface SkeletonTextProps {
  height?: string;
  width?: string;
  customClassName?: string;
}

export function SkeletonText({
  height = "3",
  width = "[100%]",
  customClassName = "",
}: SkeletonTextProps) {
  return (
    <span
      className={`block h-${height} w-${width} rounded-sm bg-background-300 animate-pulse ${customClassName}`}
    ></span>
  );
}

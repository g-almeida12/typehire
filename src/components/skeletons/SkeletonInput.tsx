export function SkeletonInput({ variant }: { variant: "input" | "textarea" }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="block w-40 h-3 rounded-md bg-background-400 animate-pulse"></span>

      {variant === "input" && (
        <div className="block w-full h-8 rounded-md bg-background-600 animate-pulse"></div>
      )}
      
      {variant === "textarea" && (
        <div className="block w-full h-30 rounded-md bg-background-600 animate-pulse"></div>
      )}
    </div>
  );
}

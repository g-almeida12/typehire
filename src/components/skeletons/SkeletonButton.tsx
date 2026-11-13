export function SkeletonButton({
  variant = "primary",
}: {
  variant?: "primary" | "secondary" | "ghost" | "critical";
}) {
  const baseStyles = "block w-full h-9 rounded-md border-2 animate-pulse";
  let variantStyles = "";
  switch (variant) {
    case "primary":
      variantStyles = "border-accent-400 bg-accent-400";
      break;
    case "ghost":
      variantStyles = "border-accent-400 bg-transparent";
      break;
    case "secondary":
      variantStyles = "border-background-100 bg-background-100";
      break;
    case "critical":
      variantStyles = "border-red-500 bg-red-500";
      break;
    default:
      variantStyles = "";
  }

  return (
    <div className={`${baseStyles} ${variantStyles}`}></div>
  );
}

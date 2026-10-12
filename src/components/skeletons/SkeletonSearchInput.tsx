import { SearchIcon, SlidersIcon } from "../icons";

export function SkeletonSearchInput() {
  return (
    <div className="min-w-full animate-pulse">
      <div className="min-w-full flex flex-row gap-2 items-center justify-between border-2 border-background-300 px-2 py-2 rounded-md bg-background-300">
        <SearchIcon size={24} className="shrink-0 text-background-800" />
        <SlidersIcon size={24} className="text-background-800" />
      </div>
    </div>
  );
}

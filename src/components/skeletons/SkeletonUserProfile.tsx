import { ArrowUpRightIcon, EditIcon } from "@/components/icons";

export function SkeletonUserProfile({ type }: { type?: "edit" | "link" | "list" }) {
  return (
    <div className="w-full flex flex-row gap-2 flex-1">
      {/* Profile avatar */}
      <div className={`shrink-0 flex justify-center items-center rounded-full bg-accent-600 animate-pulse ${type === "list" ? "size-10" : "size-12.5"}`}></div>

      {/* User name and email */}
      <div className="w-full flex flex-row justify-between items-start  mt-1">
        <div className="flex flex-col gap-2 max-w-[calc(100%-50px-1rem)]">
          <span className={`block w-60 rounded-md bg-background-200 animate-pulse ${type === "list" ? "h-4" : "h-5"}`}></span>
          <span className="block w-40 h-3 rounded-sm bg-background-400 animate-pulse"></span>
        </div>

        {type === "link" && (
          <ArrowUpRightIcon
            size={20}
            className="shrink-0 text-background-400 animate-pulse"
          />
        )}

        {type === "edit" && (
          <EditIcon
            size={20}
            className="shrink-0 text-background-400 animate-pulse"
          />
        )}
      </div>
    </div>
  );
}

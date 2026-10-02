import { ArrowUpRightIcon, EditIcon } from "@/components/icons";

export function SkeletonCompanyProfile({
  type,
}: {
  type?: "edit" | "link";
}) {
  return (
    <div className="w-full flex flex-row gap-2 flex-1">
      {/* Profile avatar */}
      <div className="shrink-0 flex justify-center items-center size-10 rounded-md bg-accent-600 animate-pulse"></div>

      {/* Company name and website */}
      <div className="w-full flex flex-row justify-between items-start">
        <div className="flex flex-col gap-2 max-w-[calc(100%-50px-1rem)]">
          <span className="block w-60 h-5 rounded-md bg-background-200 animate-pulse"></span>
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

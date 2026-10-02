import { SkeletonCompanyProfile } from "./SkeletonCompanyProfile";

export function SkeletonJobCard() {
  return (
    <div className="px-4 py-4 border-y border-y-background-700 not-first:-mt-px">
      {/* Company profile */}
      <SkeletonCompanyProfile />

      {/* Job tags */}
      <div className="flex flex-row gap-2 mt-3">
        <span className="w-25 h-7 rounded-md bg-background-700 animate-pulse"></span>
        <span className="w-25 h-7 rounded-md bg-background-700 animate-pulse"></span>
      </div>

      {/* Job salary and creation date */}
      <div className="flex flex-row justify-between items-baseline mt-6">
        <span className="h-7 w-30 rounded-md bg-background-200 animate-pulse"></span>
        <span className="h-3 w-15 rounded-sm bg-background-400 animate-pulse"></span>
      </div>
    </div>
  );
}

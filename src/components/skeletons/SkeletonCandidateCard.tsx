import { FileIcon } from "../icons";
import { SkeletonUserProfile, SkeletonSocialMedias } from "./";

export function SkeletonCandidateCard() {
  return (
    <div className="px-4 py-4 border-y border-y-background-700 not-first:-mt-px">
      <SkeletonUserProfile type="list" />

      {/* Resume */}
      <div className="flex items-center w-full h-6 mt-3 mb-5 px-1 rounded-md border border-background-500 bg-background-500 animate-pulse">
        <FileIcon size={18} className="text-background-900" aria-hidden="true" />
      </div>

      {/* Social medias */}
      <SkeletonSocialMedias size="small" />

      <div className="flex flex-row justify-between items-baseline mt-6">
        <span className="h-7 w-30 rounded-md bg-background-200 animate-pulse"></span>
        <span className="h-3 w-15 rounded-sm bg-background-400 animate-pulse"></span>
      </div>
    </div>
  );
}

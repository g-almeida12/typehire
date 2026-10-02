import { ArrowLeftIcon } from "@/components/icons";
import {
  SkeletonInput,
  SkeletonSkills,
  SkeletonSocialMedias,
  SkeletonText,
} from "@/components/skeletons";

export default function ProfileUpdateLoading() {
  return (
    <main className="pb-10" aria-busy="true">
      <ArrowLeftIcon className="mt-4" />

      <SkeletonText customClassName="w-80 h-5 mt-8 mb-6 rounded-md bg-background-200" />

      {/* User personal info */}
      <div>
        <SkeletonText customClassName=" w-60 h-5 mb-6 rounded-md bg-background-200" />

        {/* Inputs */}
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <SkeletonInput variant="input" />
          ))}
          <SkeletonInput variant="textarea" />
        </div>
      </div>

      {/* Social medias */}
      <div className="mt-8">
        <SkeletonText customClassName=" w-60 h-5 mb-6 rounded-md bg-background-200" />
        <SkeletonSocialMedias />
      </div>

      {/* Skills */}
      <div className="mt-8">
        <SkeletonText customClassName="w-60 h-5 mb-6 rounded-md bg-background-200" />
        <SkeletonInput variant="input" />
        <div className="mt-4">
          <SkeletonSkills />
        </div>
      </div>
    </main>
  );
}

import { ArrowLeftIcon } from "@/components/icons";
import {
  SkeletonCompanyProfile,
  SkeletonInput,
  SkeletonSkills,
  SkeletonText,
} from "@/components/skeletons";

export default function JobCreateLoading() {
  return (
    <main className="pb-4">
      <ArrowLeftIcon className="mt-4 mb-6 animate-pulse" />

      <SkeletonCompanyProfile />

      {/* Title and description */}
      <SkeletonText customClassName="w-80 h-6 mb-6 mt-8 rounded-md bg-background-200" />
      <div className="flex flex-col gap-1 mb-2">
        <SkeletonText customClassName="w-full h-5 bg-background-600" />
        <SkeletonText customClassName="w-[97%] h-5 bg-background-600" />
      </div>

      {/* Form */}
      <div className="mt-6">
        <SkeletonText customClassName="w-60 h-5 mb-6 rounded-md bg-background-200" />
        <div className="flex flex-col gap-4">
          {/* Company base info */}
          <SkeletonInput variant="input" />
          <SkeletonInput variant="textarea" />

          <div>
            <SkeletonText customClassName="w-40 h-3 mb-1 rounded-md bg-background-400" />
            <div className="w-full flex flex-col gap-2 px-2 py-1 mb-1 rounded-md border-background-800 bg-background-800">
              <div className="flex flex-row gap-2">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <span
                    className="block w-40 h-6 rounded-md bg-background-500 animate-pulse"
                    key={`salary-type-${idx}`}
                  ></span>
                ))}
              </div>
            </div>
            <div className="block w-full h-8 rounded-md bg-background-600 animate-pulse"></div>
          </div>

          <SkeletonInput variant="input" />
          <SkeletonInput variant="input" />
          <SkeletonInput variant="input" />

          {/* Skills */}
          <div className="mt-8">
            <SkeletonText customClassName="w-60 h-5 mb-6 rounded-md bg-background-200" />
            <SkeletonInput variant="input" />
            <div className="mt-4">
              <SkeletonSkills />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

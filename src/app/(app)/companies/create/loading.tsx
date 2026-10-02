import { ArrowLeftIcon } from "@/components/icons";
import {
  SkeletonInput,
  SkeletonText,
  SkeletonUserProfile,
} from "@/components/skeletons";

export default function CompanyCreateLoading() {
  return (
    <main className="pb-4">
      <ArrowLeftIcon className="mt-4 animate-pulse" />

      {/* Title */}
      <SkeletonText customClassName="w-80 h-6 mt-8 rounded-md bg-background-200" />

      {/* Form */}
      <div className="mt-6">
        <div className="flex flex-col gap-8">
          {/* Company base info */}
          <div>
            <SkeletonText customClassName="w-60 h-5 mb-6 rounded-md bg-background-200" />

            <div className="flex flex-col gap-2 mb-2">
              {Array.from({ length: 3 }).map((_, idx) => (
                <SkeletonInput variant="input" key={`input-${idx}`} />
              ))}
            </div>
            <SkeletonInput variant="textarea" />
          </div>

          {/* Memberships */}
          <div>
            <SkeletonText customClassName="w-60 h-5 mb-3 rounded-md bg-background-200" />
            <SkeletonText customClassName="w-full h-4 mb-1 rounded-sm bg-background-200" />
            <SkeletonText customClassName="w-40 h-4 mb-5 rounded-sm bg-background-200" />
  
            <SkeletonInput variant="input" />
            <ul className="flex flex-row flex-wrap gap-0 mt-4 rounded-md bg-background-700">
              {Array.from({ length: 2 }).map((_, idx) => (
                <li
                  className="w-full rounded-sm px-2 py-1 bg-background-700"
                  key={`user-${idx}`}
                >
                  {idx >= 1 && (
                    <hr className="mb-2 mx-2 text-background-500" />
                  )}
  
                  <SkeletonUserProfile />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

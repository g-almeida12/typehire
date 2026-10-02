import { ArrowLeftIcon } from "@/components/icons";
import {
  SkeletonCompanyProfile,
  SkeletonNavbar,
  SkeletonText,
  SkeletonSkills,
  SkeletonDescription,
} from "@/components/skeletons";

export default function JobLoading() {
  return (
    <div aria-busy="true">
      {/* Navbar */}
      <SkeletonNavbar />
      <main>
        <ArrowLeftIcon className="mt-4 mb-6 animate-pulse" />

        {/* Company profile */}
        <SkeletonCompanyProfile type="link" />

        {/* Job main info */}
        <div className="mt-11">
          {/* Title */}
          <SkeletonText customClassName="w-80 h-6 rounded-md bg-background-200" />

          {/* Tags */}
          <div className="flex flex-row gap-2 mt-2">
            <SkeletonText customClassName="w-20 h-7 bg-background-700" />
            <SkeletonText customClassName="w-20 h-7 bg-background-700" />
          </div>

          {/* Salary and modality */}
          <div className="flex flex-col gap-2 mt-5">
            <SkeletonText customClassName="w-40 h-7 rounded-md bg-background-200" />
            <SkeletonText customClassName="w-20 h-3 bg-background-700" />
          </div>

          <div className="block w-full h-9 mt-6 rounded-sm bg-accent-400 animate-pulse"></div>
        </div>

        <hr className="my-8 animate-pulse" />

        {/* Job skills */}
        <div className="mt-8">
          <SkeletonText customClassName="w-50 h-6 mb-4 rounded-md bg-background-200" />
          <div className="flex flex-row flex-wrap gap-2">
            <SkeletonSkills />
          </div>
        </div>

        {/* Job description */}
        <SkeletonText customClassName="w-60 h-6 mt-8 mb-4 rounded-md bg-background-200" />
        <div className="w-[calc(100%+2rem)] p-4 -ml-4 bg-background-800">
          <SkeletonText customClassName="w-80 h-6 mb-4 rounded-md bg-background-200" />
          <SkeletonDescription customKey="desc-1" />

          <SkeletonText customClassName="w-80 h-6 mb-4 mt-8 rounded-md bg-background-200" />
          <SkeletonDescription customKey="desc-2" length={2} />
        </div>
      </main>
    </div>
  );
}

import { ArrowLeftIcon } from "@/components/icons";
import {
  SkeletonCompanyProfile,
  SkeletonJobCard,
  SkeletonNavbar,
  SkeletonText,
} from "@/components/skeletons";
import { SkeletonSearchInput } from "@/components/skeletons";

export default function CompanyJobsLoading() {
  return (
    <div aria-busy="true">
      {/* Navbar */}
      <SkeletonNavbar />
      <main className="pb-4">
        <ArrowLeftIcon className="mt-4 mb-6 animate-pulse" aria-hidden="true" />

        {/* Company info */}
        <div>
          <SkeletonCompanyProfile />
        </div>

        <div className="mt-6 mb-12">
          <SkeletonText
            height="6"
            width="80"
            customClassName="mb-2 rounded-md bg-background-200"
          />
          <SkeletonSearchInput />
        </div>

          {/* Job card list */}
          <div className="flex flex-col gap-0 -ml-4 w-[calc(100%+2rem)]">
            {Array.from({ length: 4 }).map((_, idx) => (
              <SkeletonJobCard key={`job-${idx}`} />
            ))}
          </div>
      </main>
    </div>
  );
}

import {
  SkeletonApplicationCard,
  SkeletonNavbar,
  SkeletonText,
} from "@/components/skeletons";
import { ArrowLeftIcon } from '@/components/icons';
import { SkeletonSearchInput } from "@/components/skeletons";

export default function ApplicationsLoading() {
  return (
    <div aria-busy="true">
      <SkeletonNavbar />
      <main>
      <ArrowLeftIcon className="mt-4 mb-6 animate-pulse" />

        <div className="flex flex-col gap-2 mt-10 mb-12">
          <SkeletonText height="6" width="[80%]" customClassName="mb-2" />

          {/* Search input */}
          <SkeletonSearchInput />
        </div>

        {/* Job card list */}
        <div className="flex flex-col gap-0 -ml-4 w-[calc(100%+2rem)]">
          {Array.from({ length: 4 }).map((_, idx) => (
            <SkeletonApplicationCard key={`job-${idx}`} />
          ))}
        </div>
      </main>
    </div>
  );
}

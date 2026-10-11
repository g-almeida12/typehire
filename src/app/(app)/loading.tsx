import {
  SkeletonJobCard,
  SkeletonNavbar,
  SkeletonText,
} from "@/components/skeletons";
import { SkeletonSearchInput } from "@/components/skeletons/SkeletonSearchInput";

export default function AppLoading() {
  return (
    <div aria-busy="true">
      <SkeletonNavbar />
      <main>
        <div className="flex flex-col gap-2 mt-10 mb-12">
          <SkeletonText height="7" width="[80%]" customClassName="mx-auto" />

          {/* Search input */}
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

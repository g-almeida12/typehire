import { SlidersIcon, SearchIcon } from "@/components/icons";
import {
  SkeletonJobCard,
  SkeletonNavbar,
  SkeletonText,
} from "@/components/skeletons";

export default function AppLoading() {
  return (
    <div aria-busy="true">
      <SkeletonNavbar />
      <main>
        <div className="flex flex-col gap-2 mt-10 mb-12">
          <SkeletonText height="7" width="[80%]" customClassName="mx-auto" />

          {/* Search input */}
          <div className="min-w-full animate-pulse">
            <div className="min-w-full flex flex-row gap-2 items-center justify-between border-2 border-background-300 px-2 py-2 rounded-md bg-background-300">
              <SearchIcon size={24} className="shrink-0 text-background-800" />
              <SlidersIcon size={24} className="text-background-800" />
            </div>
          </div>
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

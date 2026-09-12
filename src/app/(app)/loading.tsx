import { SlidersIcon, SearchIcon } from "@/components/icons";
import { Navbar } from "@/components/ui/Navbar";

export default function AppLoading() {
  return (
    <>
      <Navbar />
      <main>
        <div className="flex flex-col gap-2 mt-10 mb-12">
          <span className="block h-7 w-[80%] rounded-sm bg-background-300 mx-auto animate-pulse"></span>

          {/* Input */}
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
            <div
              className="px-4 py-4 border-y border-y-background-700 not-first:-mt-px"
              key={idx}
            >
              {/* Company profile */}
              <div className="flex flex-row gap-2">
                <div className="shrink-0 size-10 bg-background-200 rounded-md animate-pulse"></div>
                <div className="flex flex-col gap-1 w-full">
                  <span className="block h-5 w-[80%] rounded-sm bg-background-300 animate-pulse"></span>
                  <span className="block h-3 w-40 rounded-sm bg-background-400 animate-pulse"></span>
                </div>
              </div>

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
          ))}
        </div>
      </main>
    </>
  );
}

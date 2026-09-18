import {
  ArrowLeftIcon,
  LayersIcon,
  SearchIcon,
  UserCircleIcon,
  ArrowUpRightIcon,
} from "@/components/icons";

export default function CompanyLoading() {
  return (
    <div aria-busy="true">
      {/* Navbar */}
      <nav className="flex flex-row justify-between items-center w-full h-13 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-4xl rounded-tr-[5px] bg-accent-400 animate-pulse" />
          <div className="w-20 h-4 bg-background-200 rounded animate-pulse" />
        </div>

        <div className="flex flex-row gap-6">
          <SearchIcon
            className="text-background-200 animate-pulse"
            aria-hidden={true}
          />
          <LayersIcon
            className="text-background-200 animate-pulse"
            aria-hidden={true}
          />
          <UserCircleIcon
            className="text-background-200 animate-pulse"
            aria-hidden={true}
          />
        </div>
      </nav>
      <main className="pb-4">
        <ArrowLeftIcon className="mt-4 animate-pulse" />

        {/* Company info */}
        <div>
          <div className="w-full flex flex-row gap-2 flex-1 mt-6">
            {/* Profile avatar */}
            <div className="shrink-0 flex justify-center items-center size-10 rounded-md bg-accent-600 animate-pulse"></div>

            {/* Company name and website */}
            <div className="w-full flex flex-row justify-between items-start">
              <div className="flex flex-col gap-2 max-w-[calc(100%-50px-1rem)]">
                <span className="block w-60 h-5 rounded-md bg-background-200 animate-pulse"></span>
                <span className="block w-40 h-3 rounded-sm bg-background-400 animate-pulse"></span>
              </div>

              <ArrowUpRightIcon
                size={20}
                className="shrink-0 text-background-400 animate-pulse"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <span className="block w-80 h-6 mt-8 mb-4 rounded-md bg-background-200 animate-pulse"></span>

            {Array.from({ length: 2 }).map((_, idx) => (
              <div
                className="flex flex-col gap-1 mb-2"
                key={`description-${idx}`}
              >
                <span className="block w-full h-5 rounded-sm bg-background-600 animate-pulse"></span>
                <span className="block w-[80%] h-5 rounded-sm bg-background-600 animate-pulse"></span>
                <span className="block w-[95%] h-5 rounded-sm bg-background-600 animate-pulse"></span>
                <span className="block w-[70%] h-5 rounded-sm bg-background-600 animate-pulse"></span>
                <span className="block w-[93%] h-5 rounded-sm bg-background-600 animate-pulse"></span>
                <span className="block w-[73%] h-5 rounded-sm bg-background-600 animate-pulse"></span>
              </div>
            ))}
          </div>
        </div>

        {/* Jobs */}
        <div className="mt-8">
          <span className="block w-80 h-6 mt-8 mb-4 rounded-md bg-background-200 animate-pulse"></span>

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
        </div>

        {/* Memberships */}
        <div className="mt-8">
          <span className="block w-80 h-6 mb-2 rounded-md bg-background-200 animate-pulse"></span>

          {/* Creator */}
          <span className="block w-30 h-5 mb-2 rounded-sm bg-background-600 animate-pulse"></span>
          <div className="w-full flex flex-row gap-2 flex-1">
            {/* Profile avatar */}
            <div className="shrink-0 flex justify-center items-center size-12.5 rounded-full bg-accent-600 animate-pulse"></div>

            {/* User name and email */}
            <div className="w-full flex flex-row justify-between items-start  mt-1">
              <div className="flex flex-col gap-2 max-w-[calc(100%-50px-1rem)]">
                <span className="block w-60 h-5 rounded-md bg-background-200 animate-pulse"></span>
                <span className="block w-40 h-3 rounded-sm bg-background-400 animate-pulse"></span>
              </div>

              <ArrowUpRightIcon
                size={20}
                className="shrink-0 text-background-300 animate-pulse"
              />
            </div>
          </div>

          {/* members */}
          <span className="block w-30 h-5 mb-2 mt-4 rounded-sm bg-background-600 animate-pulse"></span>
          <ul className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                className="w-full flex flex-row gap-2 flex-1"
                key={`member-${idx}`}
              >
                {/* Profile avatar */}
                <div className="shrink-0 flex justify-center items-center size-12.5 rounded-full bg-accent-600 animate-pulse"></div>

                {/* User name and email */}
                <div className="w-full flex flex-row justify-between items-start mt-1">
                  <div className="flex flex-col gap-2 max-w-[calc(100%-50px-1rem)]">
                    <span className="block w-60 h-5 rounded-md bg-background-200 animate-pulse"></span>
                    <span className="block w-40 h-3 rounded-sm bg-background-400 animate-pulse"></span>
                  </div>

                  <ArrowUpRightIcon
                    size={20}
                    className="shrink-0 text-background-300 animate-pulse"
                  />
                </div>
              </div>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

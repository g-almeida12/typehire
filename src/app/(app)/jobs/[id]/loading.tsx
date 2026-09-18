import {
  ArrowLeftIcon,
  LayersIcon,
  SearchIcon,
  UserCircleIcon,
  ArrowUpRightIcon,
} from "@/components/icons";

export default function JobLoading() {
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
      <main>
        <ArrowLeftIcon className="mt-4 animate-pulse" />

        {/* Company profile */}
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

        {/* Job main info */}
        <div className="mt-11">
          {/* Title */}
          <span className="block w-80 h-6 rounded-md bg-background-200 animate-pulse"></span>

          {/* Tags */}
          <div className="flex flex-row gap-2 mt-2">
            <span className="block w-20 h-7 rounded-sm bg-background-700 animate-pulse"></span>
            <span className="block w-20 h-7 rounded-sm bg-background-700 animate-pulse"></span>
          </div>

          {/* Salary and modality */}
          <div className="flex flex-col gap-2 mt-5">
            <span className="block w-40 h-7 rounded-md bg-background-200 animate-pulse"></span>
            <span className="block w-20 h-3 rounded-sm bg-background-700 animate-pulse"></span>
          </div>

          <div className="block w-full h-9 mt-6 rounded-sm bg-accent-400 animate-pulse"></div>
        </div>

        <hr className="my-8 animate-pulse" />

        {/* Job skills */}
        <div className="mt-8">
          <span className="block w-50 h-6 mb-4 rounded-md bg-background-200 animate-pulse"></span>
          <div className="flex flex-row flex-wrap gap-2">
            <span className="block w-20 h-5 rounded-sm bg-background-700 animate-pulse"></span>
            <span className="block w-25 h-5 rounded-sm bg-background-700 animate-pulse"></span>
            <span className="block w-22 h-5 rounded-sm bg-background-700 animate-pulse"></span>
            <span className="block w-30 h-5 rounded-sm bg-background-700 animate-pulse"></span>
            <span className="block w-29 h-5 rounded-sm bg-background-700 animate-pulse"></span>
            <span className="block w-21 h-5 rounded-sm bg-background-700 animate-pulse"></span>
            <span className="block w-22 h-5 rounded-sm bg-background-700 animate-pulse"></span>
            <span className="block w-24 h-5 rounded-sm bg-background-700 animate-pulse"></span>
          </div>
        </div>

        {/* Job description */}
        <span className="block w-60 h-6 mt-8 mb-4 rounded-md bg-background-200 animate-pulse"></span>
        <div className="w-[calc(100%+2rem)] p-4 -ml-4 bg-background-800">
          <span className="block w-80 h-6 mb-4 rounded-md bg-background-200 animate-pulse"></span>
          <div className="flex flex-col gap-1">
            <span className="block w-full h-5 rounded-sm bg-background-600 animate-pulse"></span>
            <span className="block w-[80%] h-5 rounded-sm bg-background-600 animate-pulse"></span>
            <span className="block w-[95%] h-5 rounded-sm bg-background-600 animate-pulse"></span>
            <span className="block w-[70%] h-5 rounded-sm bg-background-600 animate-pulse"></span>
          </div>
        </div>
      </main>
    </div>
  );
}

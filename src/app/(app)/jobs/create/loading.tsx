import { ArrowLeftIcon } from "@/components/icons";

export default function JobCreateLoading() {
  return (
    <main className="pb-4">
      <ArrowLeftIcon className="mt-4 animate-pulse" />

      <div>
        <div className="w-full flex flex- row gap-2 flex-1 mt-6">
          {/* Profile avatar */}
          <div className="shrink-0 flex justify-center items-center size-10 rounded-md bg-accent-600 animate-pulse"></div>

          {/* Company name and website */}
          <div className="w-full flex flex-row justify-between items-start">
            <div className="flex flex-col gap-2 max-w-[calc(100%-50px-1rem)]">
              <span className="block w-60 h-5 rounded-md bg-background-200 animate-pulse"></span>
              <span className="block w-40 h-3 rounded-sm bg-background-400 animate-pulse"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Title and description */}
      <span className="block w-80 h-6 mb-6 mt-8 rounded-md bg-background-200 animate-pulse"></span>
      <div className="flex flex-col gap-1 mb-2">
        <span className="block w-full h-5 rounded-sm bg-background-600 animate-pulse"></span>
        <span className="block w-[97%] h-5 rounded-sm bg-background-600 animate-pulse"></span>
      </div>

      {/* Form */}
      <div className="mt-6">
        <span className="block w-60 h-5 mb-6 rounded-md bg-background-200 animate-pulse"></span>
        <div className="flex flex-col gap-4">
          {/* Company base info */}
          <div className="flex flex-col gap-1">
            <span className="block w-40 h-3 rounded-md bg-background-400 animate-pulse"></span>
            <div className="block w-full h-8 rounded-md bg-background-600 animate-pulse"></div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="block w-40 h-3 rounded-md bg-background-400 animate-pulse"></span>
            <div className="block w-full h-30 rounded-md bg-background-600 animate-pulse"></div>
          </div>

          <div>
            <span className="block w-40 h-3 mb-1 rounded-md bg-background-400 animate-pulse"></span>
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

          {Array.from({ length: 3 }).map((_, idx) => (
            <div className="flex flex-col gap-1" key={`personal-input-${idx}`}>
              <span className="block w-40 h-3 rounded-md bg-background-400 animate-pulse"></span>
              <div className="block w-full h-8 rounded-md bg-background-600 animate-pulse"></div>
            </div>
          ))}

          {/* Skills */}
          <div className="mt-8">
            <span className="block w-60 h-5 mb-6 rounded-md bg-background-200 animate-pulse"></span>
            <div className="flex flex-col gap-1">
              <span className="block w-40 h-3 rounded-md bg-background-400 animate-pulse"></span>
              <div className="block w-full h-8 rounded-md bg-background-600 animate-pulse"></div>
            </div>

            <div className="flex flex-row flex-wrap gap-2 mt-4">
              <span className="block w-20 h-5 rounded-sm bg-background-700"></span>
              <span className="block w-25 h-5 rounded-sm bg-background-700"></span>
              <span className="block w-22 h-5 rounded-sm bg-background-700"></span>
              <span className="block w-30 h-5 rounded-sm bg-background-700"></span>
              <span className="block w-29 h-5 rounded-sm bg-background-700"></span>
              <span className="block w-21 h-5 rounded-sm bg-background-700"></span>
              <span className="block w-22 h-5 rounded-sm bg-background-700"></span>
              <span className="block w-24 h-5 rounded-sm bg-background-700"></span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

import { ArrowLeftIcon, EditIcon } from "@/components/icons";

export default function ProfileLoading() {
  return (
    <main className="pb-10" aria-busy="true">
      <ArrowLeftIcon className="mt-4 animate-pulse" />

      {/* Profile */}
      <div>
        <div className="w-full flex flex-row gap-2 flex-1 mt-6">
          {/* Profile avatar */}
          <div className="shrink-0 flex justify-center items-center size-12.5 rounded-full bg-accent-600 animate-pulse"></div>

          {/* User name and email */}
          <div className="w-full flex flex-row justify-between items-start  mt-1">
            <div className="flex flex-col gap-2 max-w-[calc(100%-50px-1rem)]">
              <span className="block w-60 h-5 rounded-md bg-background-200 animate-pulse"></span>
              <span className="block w-40 h-3 rounded-sm bg-background-400 animate-pulse"></span>
            </div>

            <EditIcon size={20} className="shrink-0 text-background-300" />
          </div>
        </div>

        {/* User phone number and location */}
        <div className="w- max-w-80 flex flex-row items-center gap-4 mt-2">
          <span className="block w-30 h-5 rounded-md bg-background-400 animate-pulse"></span>
          <span className="block w-40 h-5 rounded-md bg-background-400 animate-pulse"></span>
        </div>
      </div>

      <hr className="mt-4 mb-8" />

      {/* Social medias */}
      <div>
        <span className="block w-80 h-6 mb-4 rounded-md bg-background-200 animate-pulse"></span>

        <div className="flex flex-col gap-2">
          <div className="w-80 h-8 rounded-md border border-background-600 bg-background-800 animate-pulse"></div>
          <div className="w-80 h-8 rounded-md border border-background-600 bg-background-800 animate-pulse"></div>
          <div className="w-80 h-8 rounded-md border border-background-600 bg-background-800 animate-pulse"></div>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-10">
        <span className="block w-80 h-6 mb-4 rounded-md bg-background-200 animate-pulse"></span>
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

      {/* Companies */}
      <div className="mt-10">
        <span className="block w-80 h-6 mb-4 rounded-md bg-background-200 animate-pulse"></span>

        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div className="flex flex-row gap-2" key={`company-${idx}`}>
              <div className="shrink-0 size-10 bg-background-100 rounded-md animate-pulse"></div>

              <div className="flex flex-col gap-1">
                <span className="block w-60 h-5 rounded-md bg-background-200 animate-pulse"></span>
                <span className="block w-40 h-3 rounded-sm bg-background-400 animate-pulse"></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

import { ArrowLeftIcon } from "@/components/icons";

export default function ProfileUpdateLoading() {
  return (
    <main className="pb-10" aria-busy="true">
      <ArrowLeftIcon className="mt-4" />

      <span className="block w-80 h-6 mb-8 mt-6 rounded-md bg-background-200 animate-pulse"></span>

      {/* User personal info */}
      <div>
        <span className="block w-60 h-4 mb-6 rounded-md bg-background-200 animate-pulse"></span>

        {/* Inputs */}
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div className="flex flex-col gap-1" key={`personal-input-${idx}`}>
              <span className="block w-40 h-3 rounded-md bg-background-400 animate-pulse"></span>
              <div className="block w-full h-8 rounded-md bg-background-600 animate-pulse"></div>
            </div>
          ))}
          <div className="flex flex-col gap-1">
            <span className="block w-40 h-3 rounded-md bg-background-400 animate-pulse"></span>
            <div className="block w-full h-30 rounded-md bg-background-600 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Social medias */}
      <div className="mt-8">
        <span className="block w-60 h-4 mb-6 rounded-md bg-background-200 animate-pulse"></span>
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div className="flex flex-col gap-1" key={`social-input-${idx}`}>
              <span className="block w-40 h-3 rounded-md bg-background-400 animate-pulse"></span>
              <div className="block w-full h-8 rounded-md bg-background-600 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="mt-8">
        <span className="block w-60 h-4 mb-6 rounded-md bg-background-200 animate-pulse"></span>
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
    </main>
  );
}

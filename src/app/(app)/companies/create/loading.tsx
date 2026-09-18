import { ArrowLeftIcon } from "lucide-react";

export default function CompanyCreateLoading() {
  return (
    <main className="pb-4">
      <ArrowLeftIcon className="mt-4 animate-pulse" />

      {/* Title and description */}
      <span className="block w-80 h-6 mb-6 mt-8 rounded-md bg-background-200 animate-pulse"></span>
      <div className="flex flex-col gap-1 mb-2">
        <span className="block w-full h-5 rounded-sm bg-background-600 animate-pulse"></span>
        <span className="block w-[97%] h-5 rounded-sm bg-background-600 animate-pulse"></span>
        <span className="block w-[95%] h-5 rounded-sm bg-background-600 animate-pulse"></span>
        <span className="block w-[99%] h-5 rounded-sm bg-background-600 animate-pulse"></span>
        <span className="block w-[80%] h-5 rounded-sm bg-background-600 animate-pulse"></span>
      </div>

      {/* Form */}
      <div className="mt-6">
        <span className="block w-60 h-5 mb-6 rounded-md bg-background-200 animate-pulse"></span>
        <div className="flex flex-col gap-4">
          {/* Company base info */}
          {Array.from({ length: 4 }).map((_, idx) => (
            <div className="flex flex-col gap-1" key={`personal-input-${idx}`}>
              <span className="block w-40 h-3 rounded-md bg-background-400 animate-pulse"></span>
              <div className="block w-full h-8 rounded-md bg-background-600 animate-pulse"></div>
            </div>
          ))}
          <div className="flex flex-col gap-1">
            <span className="block w-40 h-3 rounded-md bg-background-400 animate-pulse"></span>
            <div className="block w-full h-30 rounded-md bg-background-600 animate-pulse"></div>
          </div>

          {/* Memberships */}
          <span className="block w-60 h-5 mt-8 rounded-md bg-background-200 animate-pulse"></span>
          <div className="flex flex-col gap-1 mb-2">
            <span className="block w-full h-5 rounded-sm bg-background-600 animate-pulse"></span>
            <span className="block w-[97%] h-5 rounded-sm bg-background-600 animate-pulse"></span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="block w-40 h-3 rounded-md bg-background-400 animate-pulse"></span>
            <div className="block w-full h-8 rounded-md bg-background-600 animate-pulse"></div>
          </div>
        </div>
      </div>
    </main>
  );
}

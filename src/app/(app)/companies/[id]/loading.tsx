import {
  ArrowLeftIcon,
} from "@/components/icons";
import {
  SkeletonCompanyProfile,
  SkeletonJobCard,
  SkeletonNavbar,
  SkeletonText,
  SkeletonUserProfile,
} from "@/components/skeletons";

export default function CompanyLoading() {
  return (
    <div aria-busy="true">
      {/* Navbar */}
      <SkeletonNavbar />
      <main className="pb-4">
        <ArrowLeftIcon className="mt-4 mb-6 animate-pulse" />

        {/* Company info */}
        <div>
          <SkeletonCompanyProfile type="link" />

          {/* Description */}
          <div>
            <SkeletonText
              height="6"
              width="80"
              customClassName="mt-8 mb-4 bg-background-200"
            />

            {Array.from({ length: 2 }).map((_, idx) => (
              <div
                className="flex flex-col gap-1 mb-2"
                key={`description-${idx}`}
              >
                {[100, 80, 95, 70, 93, 73].map((w) => (
                  <SkeletonText
                    height="5"
                    width={`${w}%`}
                    customClassName="bg-background-600"
                    key={`text-${w}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Jobs */}
        <div className="mt-8">
          <SkeletonText
            height="6"
            width="80"
            customClassName="mt-8 mb-6 rounded-md bg-background-200"
          />

          {/* Job card list */}
          <div className="flex flex-col gap-0 -ml-4 w-[calc(100%+2rem)]">
            {Array.from({ length: 4 }).map((_, idx) => (
              <SkeletonJobCard key={`job-${idx}`} />
            ))}
          </div>
        </div>

        {/* Memberships */}
        <div className="mt-8">
          <SkeletonText
            height="6"
            width="80"
            customClassName="mb-2 rounded-md bg-background-200"
          />

          {/* Creator */}
          <SkeletonText
            height="5"
            width="30"
            customClassName="mb-2 bg-background-600"
          />
          <SkeletonUserProfile type="link" />

          {/* members */}
          <SkeletonText
            height="5"
            width="30"
            customClassName="mb-2 mt-4 bg-background-600"
          />
          <ul className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <SkeletonUserProfile type="link" key={`user-${idx}`} />
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

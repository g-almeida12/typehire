import { SkeletonText } from "./SkeletonText";

export function SkeletonDescription({
  length = 1,
  customKey = "text",
}: {
  length?: number;
  customKey?: string;
}) {
  return Array.from({ length }).map((_, idx) => (
    <div className="flex flex-col gap-1 mb-2 mt-4">
      {[100, 80, 95, 70, 93, 73].map((w) => (
        <SkeletonText
          customClassName={`w-[${w}%] h-5 bg-background-600`}
          key={`${customKey}-${idx}-${w}`}
        />
      ))}
    </div>
  ));
}

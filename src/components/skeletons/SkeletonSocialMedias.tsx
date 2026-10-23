import { GitHubIcon, LinkedInIcon, GlobeIcon } from "@/components/icons";

export function SkeletonSocialMedias({
  size = "default",
}: {
  size?: "default" | "small";
}) {
  return (
    <ul className={`flex flex-col ${size === "small" ? "gap-1" : "gap-2"}`}>
      {[GitHubIcon, LinkedInIcon, GlobeIcon].map((Icon) => (
        <li
          className={`flex items-center w-full rounded-md border border-background-600 bg-background-800 animate-pulse ${size === "small" ? "h-7 px-1 py-0.5" : "h-8 px-2"}`}
          key={`${Icon}`}
        >
          <Icon size={size === "small" ? 18 : 20} />
        </li>
      ))}
    </ul>
  );
}

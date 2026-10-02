import { GitHubIcon, LinkedInIcon, GlobeIcon } from "@/components/icons";

export function SkeletonSocialMedias() {
  return (
    <div className="flex flex-col gap-2">
      {[GitHubIcon, LinkedInIcon, GlobeIcon].map((Icon) => (
        <div className="flex items-center px-2 w-full h-8 rounded-md border border-background-600 bg-background-800 animate-pulse">
          <Icon size={20} />
        </div>
      ))}
    </div>
  );
}

import { SearchIcon, LayersIcon, UserCircleIcon } from '@/components/icons';

export function SkeletonNavbar() {
  return (
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
  );
}

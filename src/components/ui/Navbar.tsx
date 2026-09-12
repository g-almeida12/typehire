import Link from "next/link";
import { SearchIcon, UserCircleIcon, LayersIcon } from "@/components/icons";
import { APP_URLS } from "@/utils/constants";

interface NavbarProps {
  onlyBrand?: boolean;
}

export function Navbar({ onlyBrand = false }: NavbarProps) {
  return (
    <nav className="flex flex-row justify-between items-center w-full h-13 px-4 py-2">
      <div className="h-full flex flex-row items-center gap-2">
        <div className="h-full flex items-center justify-center aspect-square rounded-4xl rounded-tr-[5px] bg-accent-300 font-medium">
          TH
        </div>
        <span className="font-medium">TypeHire</span>
      </div>
      {!onlyBrand && (
        <div className="flex flex-row gap-6">
          <Link href={APP_URLS.home} aria-label="Ir para página inicial">
            <SearchIcon aria-hidden={true} />
          </Link>
          <Link
            href={APP_URLS.applications}
            aria-label="Ir para página de aplicações"
          >
            <LayersIcon aria-hidden={true} />
          </Link>
          <Link
            href={APP_URLS.profile}
            aria-label="Acessar informações do usuário"
          >
            <UserCircleIcon aria-hidden={true} />
          </Link>
        </div>
      )}
    </nav>
  );
}

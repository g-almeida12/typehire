'use client';

interface NavbarProps {
  onlyBrand?: boolean;
}

export function Navbar({ onlyBrand = false }: NavbarProps) {
  return (
    <nav className="w-full h-13 px-4 py-2">
      <div className="h-full flex flex-row items-center gap-2">
        <div className="h-full flex items-center justify-center aspect-square rounded-4xl rounded-tr-[5px] bg-accent-300 font-medium">TH</div>
        <span className="font-medium">TypeHire</span>
      </div>
      {!onlyBrand && <div></div>}
    </nav>
  );
}

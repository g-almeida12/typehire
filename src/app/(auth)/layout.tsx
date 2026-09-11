import { Navbar } from "@/components/ui/Navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar onlyBrand />
      <main className="pb-8 px-4 text-center">{children}</main>
    </>
  );
}

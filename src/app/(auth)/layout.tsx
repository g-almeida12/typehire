import { Navbar } from "@/components/ui/Navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="px-4 text-center">{children}</main>
    </>
  );
}

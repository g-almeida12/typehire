import { Navbar } from "@/components/ui/Navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="px-4 text-center">{children}</div>
    </>
  );
}

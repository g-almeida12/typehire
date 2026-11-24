import { getCurrentUserData } from "@/lib/data/user";
import { Suspense } from "react";

export function Greeting() {
  return <Suspense fallback={<p className="text-xl font-medium text-center">Olá.</p>}>
    <GreetingContent />
  </Suspense>;
}

async function GreetingContent() {
  const user = await getCurrentUserData();

  return (
    <p className="text-xl font-medium text-center">
      {user?.name ? `Olá, ${user.name.split(" ")[0]}.` : "Olá"}
    </p>
  );
}

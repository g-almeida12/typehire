import Image from "next/image";

interface ModuleNotFoundProps {
  title: string;
  description: string;
}

export function ModuleNotFound({ title, description }: ModuleNotFoundProps) {
  return (
    <div className="p-4 md:p-2 md:border md:rounded-md md:border-background-500">
      <div className="w-full max-w-80 flex items-center justify-center mx-auto">
        <Image
          src="/images/global-not-found-img.png"
          alt="Ilustração de erro"
          width={500}
          height={500}
          priority
        />
      </div>

      <div className="mt-5">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-2 mb-10 text-background-300 text-sm leading-relaxed">
          {description}
        </p>
      </div>

      <a
        href="https://storyset.com/internet"
        className="mt-10 text-[12px] text-background-300 text-center"
      >
        Internet illustrations by Storyset
      </a>
    </div>
  );
}

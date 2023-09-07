import { ToggleTheme } from "@/components/button/ToggleTheme";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 overflow-hidden md:grid-cols-3 lg:grid-cols-2">
      <AspectRatio ratio={16 / 9}>
        <Image
          src="/assets/auth-image.jpg"
          alt="A skateboarder doing a high drop"
          fill
          className="absolute inset-0 object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/20 md:to-background/5 hidden dark:block" />
        <Link
          href="/"
          className="absolute left-8 top-6 z-20 flex items-center text-xl font-bold tracking-tight gap-1"
        >
          <Image alt="quixy" src="/assets/logo.svg" width={40} height={40} />
          <span>Quixy</span>
        </Link>
      </AspectRatio>
      <main className="container absolute top-1/2 col-span-1 flex -translate-y-1/2 items-center md:static md:top-0 md:col-span-2 md:flex md:translate-y-0 lg:col-span-1">
        {children}
      </main>
      <div className="absolute right-8 top-4 md:right-8 md:top-8">
        <ToggleTheme />
      </div>
    </div>
  );
}

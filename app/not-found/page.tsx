import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 h-screen">
      <h2 className="text-xl font-semibold">404 PAGE NOT FOUND</h2>
      <Image
        src="/assets/not-found.png"
        alt="Not Found"
        width={400}
        height={400}
      />
      <Link href="/" className={cn(buttonVariants({ variant: "default" }))}>
        Go back
      </Link>
    </div>
  );
}

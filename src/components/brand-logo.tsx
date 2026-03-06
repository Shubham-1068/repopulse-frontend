import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  compact?: boolean;
  href?: string;
};

export function BrandLogo({ className, compact = false, href = "/" }: BrandLogoProps) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2 text-neutral-100", className)}>
      <Image
        src="/Logo.png"
        alt="RepoPulse logo"
        width={compact ? 28 : 34}
        height={compact ? 28 : 34}
        className="h-7 w-7 object-contain"
        priority
      />
      <span className={cn("font-semibold tracking-tight", compact ? "text-base" : "text-lg")}>RepoPulse</span>
    </Link>
  );
}

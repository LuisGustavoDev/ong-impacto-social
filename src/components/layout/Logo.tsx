import Link from "next/link";

import { SITE } from "@/data/site";
import { cn } from "@/lib/cn";

const HEART_PATH =
  "M16 28S5 21.4 2.6 14.6C1 10 3.8 5 8.8 5c3 0 5.2 1.6 7.2 4.1C18 6.6 20.2 5 23.2 5 28.2 5 31 10 29.4 14.6 27 21.4 16 28 16 28Z";

interface LogoProps {
  /** "light" para fundos escuros (footer). */
  tone?: "dark" | "light";
  className?: string;
}

export function Logo({ tone = "dark", className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${SITE.name} — página inicial`}
      className={cn("flex shrink-0 items-center gap-2", className)}
    >
      {/* Coração metade verde / metade amarelo, recortado com clipPath */}
      <svg viewBox="0 0 32 32" className="size-9" aria-hidden>
        <defs>
          <clipPath id="logo-left">
            <rect x="0" y="0" width="16" height="32" />
          </clipPath>
        </defs>
        <path d={HEART_PATH} className="fill-accent-500" />
        <path d={HEART_PATH} className="fill-brand-600" clipPath="url(#logo-left)" />
      </svg>

      <span
        className={cn(
          "text-sm leading-tight font-bold",
          tone === "dark" ? "text-ink" : "text-white",
        )}
      >
        Juntos
        <br />
        pelo Amanhã
      </span>
    </Link>
  );
}
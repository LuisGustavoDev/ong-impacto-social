import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  /** id do <h2>, usado pela <section> em aria-labelledby. */
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}

/** Cabeçalho padrão das seções: sobretítulo + h2 + texto de apoio. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = "center",
  tone = "dark",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <p
        className={cn(
          "text-sm font-semibold tracking-wide uppercase",
          tone === "dark" ? "text-brand-600" : "text-accent-400",
        )}
      >
        {eyebrow}
      </p>
      <h2
        id={id}
        className={cn(
          "mt-2 text-3xl font-bold text-balance sm:text-4xl",
          tone === "dark" ? "text-ink" : "text-white",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-lg text-pretty",
            tone === "dark" ? "text-slate-600" : "text-white/80",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

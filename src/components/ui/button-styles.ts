import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "outline-light";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-accent-500 text-ink hover:bg-accent-600",
  outline: "border border-brand-700 text-brand-700 hover:bg-brand-50",
  "outline-light": "border border-white/80 text-white hover:bg-white/10",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-7 text-base",
};

/**
 * Retorna só as classes — assim o mesmo visual serve para <button> e <a>/<Link>
 * sem precisar de um componente polimórfico complexo.
 */
export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export type ButtonVariant = Variant;
export type ButtonSize = Size;
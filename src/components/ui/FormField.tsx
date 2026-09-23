import type { InputHTMLAttributes, Ref } from "react";

import { cn } from "@/lib/cn";

interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  ref?: Ref<HTMLInputElement>;
  className?: string;
}

/**
 * Label + input + mensagem de erro, já ligados por id/aria-describedby.
 * Com erro, o campo recebe aria-invalid e a borda vermelha vem acompanhada de texto
 * (nunca só cor, conforme WCAG 1.4.1).
 */
export function FormField({ id, label, error, hint, className, ref, ...inputProps }: FormFieldProps) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "h-12 w-full rounded-xl border bg-white px-4 text-ink placeholder:text-slate-400",
          "focus-visible:outline-2 focus-visible:outline-offset-2",
          error
            ? "border-red-600 focus-visible:outline-red-600"
            : "border-slate-300 focus-visible:outline-brand-600",
        )}
        {...inputProps}
      />
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

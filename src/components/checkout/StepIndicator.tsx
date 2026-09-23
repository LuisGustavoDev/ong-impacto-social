import { Check } from "lucide-react";

import { cn } from "@/lib/cn";
import type { CheckoutStep } from "@/types/donation";

import { CHECKOUT_STEPS } from "./steps";

/** Barra de progresso do checkout. aria-current="step" marca a etapa atual. */
export function StepIndicator({ current }: { current: CheckoutStep }) {
  const currentIndex = CHECKOUT_STEPS.findIndex((step) => step.id === current);

  return (
    <ol aria-label="Etapas da doação" className="flex items-center gap-2">
      {CHECKOUT_STEPS.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <li
            key={step.id}
            aria-current={isCurrent ? "step" : undefined}
            className="flex flex-1 items-center gap-2 text-xs font-semibold sm:text-sm"
          >
            <span
              className={cn(
                "grid size-7 shrink-0 place-items-center rounded-full",
                isDone && "bg-brand-600 text-white",
                isCurrent && "bg-accent-500 text-ink",
                !isDone && !isCurrent && "bg-slate-100 text-slate-500",
              )}
            >
              {isDone ? <Check aria-hidden className="size-4" /> : index + 1}
            </span>
            <span className={isCurrent ? "text-ink" : "text-slate-500"}>
              {step.label}
              {isDone && <span className="sr-only"> (concluída)</span>}
            </span>
            {index < CHECKOUT_STEPS.length - 1 && (
              <span aria-hidden className="h-px flex-1 bg-slate-200" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

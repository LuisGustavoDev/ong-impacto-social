"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

import { cn } from "@/lib/cn";
import type { FaqItem } from "@/types/content";

/**
 * Accordion no padrão WAI-ARIA: cada pergunta é um <button> dentro de um
 * heading, com aria-expanded + aria-controls apontando para o painel (role="region").
 * Enter/Espaço funcionam nativamente por serem botões.
 */
export function FaqAccordion({ items }: { items: readonly FaqItem[] }) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <ul className="divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-button-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <li key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-ink hover:text-brand-600 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-600"
              >
                {item.question}
                <ChevronDown
                  aria-hidden
                  className={cn(
                    "size-5 shrink-0 text-brand-600 transition-transform motion-reduce:transition-none",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-6 pb-5 text-slate-600"
            >
              {item.answer}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

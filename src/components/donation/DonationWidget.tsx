"use client";

import { ArrowRight, Lock } from "lucide-react";

import { buttonStyles } from "@/components/ui/button-styles";
import { useDonation } from "@/context/DonationContext";
import { formatCurrency } from "@/lib/format";

import { AmountPicker, isAmountValid } from "./AmountPicker";

/** Card de doação do Hero: valor já escolhido, o checkout abre direto nos dados do doador. */
export function DonationWidget() {
  const { state, openCheckout } = useDonation();
  const { amount, frequency } = state.selection;
  const canDonate = isAmountValid(amount);

  return (
    <div
      role="region"
      aria-labelledby="widget-title"
      className="rounded-3xl bg-white p-6 shadow-2xl shadow-brand-950/30 sm:p-8"
    >
      <h2 id="widget-title" className="mb-5 text-xl font-bold text-ink">
        Faça sua doação
      </h2>

      <AmountPicker />

      <button
        type="button"
        disabled={!canDonate}
        onClick={() => openCheckout("donor")}
        className={buttonStyles({ size: "lg", className: "mt-6 w-full" })}
      >
        {canDonate
          ? `Doar ${formatCurrency(amount)}${frequency === "monthly" ? " por mês" : ""}`
          : "Escolha um valor"}
        <ArrowRight aria-hidden className="size-5" />
      </button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500">
        <Lock aria-hidden className="size-3.5" />
        Ambiente seguro · Pix ou cartão de crédito
      </p>
    </div>
  );
}

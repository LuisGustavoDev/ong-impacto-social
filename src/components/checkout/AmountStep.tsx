"use client";

import { ArrowRight } from "lucide-react";

import { AmountPicker, isAmountValid } from "@/components/donation/AmountPicker";
import { buttonStyles } from "@/components/ui/button-styles";
import { useDonation } from "@/context/DonationContext";

export function AmountStep() {
  const { state, goToStep } = useDonation();
  const canContinue = isAmountValid(state.selection.amount);

  return (
    <div>
      <AmountPicker />
      <button
        type="button"
        disabled={!canContinue}
        onClick={() => goToStep("donor")}
        className={buttonStyles({ size: "lg", className: "mt-6 w-full" })}
      >
        Continuar
        <ArrowRight aria-hidden className="size-5" />
      </button>
    </div>
  );
}

"use client";

import { ArrowRight } from "lucide-react";

import {
  buttonStyles,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button-styles";
import { useDonation } from "@/context/DonationContext";
import { isPresetAmount } from "@/data/donation";
import type { Cents, CheckoutStep } from "@/types/donation";

interface DonateButtonProps {
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  /** Em qual etapa o checkout abre (padrão: escolha do valor). */
  step?: CheckoutStep;
  /** Se informado, pré-seleciona esse valor antes de abrir o checkout. */
  amount?: Cents;
  withIcon?: boolean;
  /** Ação extra ao clicar (ex.: fechar o menu mobile). */
  onClick?: () => void;
}

/**
 * CTA de doação reutilizável. É a única parte "client" da Navbar:
 * o resto do header continua sendo Server Component.
 */
export function DonateButton({
  label = "Doe agora",
  variant = "primary",
  size = "md",
  className,
  step = "amount",
  amount,
  withIcon = true,
  onClick,
}: DonateButtonProps) {
  const { setAmount, openCheckout } = useDonation();

  return (
    <button
      type="button"
      className={buttonStyles({ variant, size, className })}
      onClick={() => {
        onClick?.();
        if (amount !== undefined) setAmount(amount, !isPresetAmount(amount));
        openCheckout(step);
      }}
    >
      {label}
      {withIcon && <ArrowRight aria-hidden className="size-4" />}
    </button>
  );
}

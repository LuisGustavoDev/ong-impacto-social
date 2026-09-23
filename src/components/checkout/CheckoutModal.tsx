"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type MouseEvent, type PointerEvent } from "react";

import { useDonation } from "@/context/DonationContext";
import { FREQUENCY_LABELS } from "@/data/donation";
import { formatCurrency } from "@/lib/format";

import { AmountStep } from "./AmountStep";
import { DonorStep } from "./DonorStep";
import { PaymentStep } from "./PaymentStep";
import { StepIndicator } from "./StepIndicator";
import { CHECKOUT_STEPS } from "./steps";

/** Montado no layout: o CTA de qualquer página pode abrir o checkout. */
export function CheckoutModal() {
  const { state } = useDonation();
  // Montar só quando aberto zera o estado local (erros, cartão) a cada abertura.
  return state.isCheckoutOpen ? <CheckoutDialog /> : null;
}

/**
 * Usa o <dialog> nativo com showModal(), que já entrega:
 * - foco preso no modal (o resto da página fica inerte);
 * - tecla Esc (evento `cancel`) e fundo escurecido (::backdrop);
 * - role="dialog" + aria-modal implícitos.
 */
function CheckoutDialog() {
  const { state, closeCheckout } = useDonation();
  const { currentStep, status, selection } = state;
  const isProcessing = status === "processing";

  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const pointerDownOnBackdrop = useRef(false);

  const step = CHECKOUT_STEPS.find((item) => item.id === currentStep) ?? CHECKOUT_STEPS[0];

  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement as HTMLElement | null;
    // Guarda: no StrictMode o efeito roda duas vezes.
    if (dialog && !dialog.open) dialog.showModal();
    // Ao fechar, devolve o foco para o botão que abriu o modal.
    return () => trigger?.focus();
  }, []);

  // A cada etapa, o foco vai para o título: o leitor de tela anuncia onde a pessoa está.
  useEffect(() => {
    headingRef.current?.focus();
  }, [currentStep]);

  /* Clique fora: o ::backdrop pertence ao próprio <dialog>, então o alvo é o dialog.
     Exigimos que o clique tenha COMEÇADO fora, para não fechar ao arrastar uma seleção de texto. */
  function handlePointerDown(event: PointerEvent<HTMLDialogElement>) {
    pointerDownOnBackdrop.current = event.target === event.currentTarget;
  }

  function handleClick(event: MouseEvent<HTMLDialogElement>) {
    if (pointerDownOnBackdrop.current && event.target === event.currentTarget) {
      closeCheckout(); // o reducer ignora se estiver processando
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="checkout-title"
      aria-describedby="checkout-step-title"
      onCancel={(event) => {
        // Esc: o fechamento é decidido pelo reducer (bloqueado durante o processamento).
        event.preventDefault();
        closeCheckout();
      }}
      onClose={() => {
        // Alguns navegadores forçam o fechamento no 2º Esc; se estiver processando, reabre.
        if (isProcessing) dialogRef.current?.showModal();
        else closeCheckout();
      }}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto overscroll-contain rounded-3xl bg-white p-0 text-slate-700 shadow-2xl backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
    >
      <div className="p-6 sm:p-8">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2 id="checkout-title" className="text-xl font-bold text-ink">
              Sua doação
            </h2>
            {currentStep !== "amount" && (
              <p className="mt-1 text-sm text-slate-600">
                <strong className="text-brand-700">
                  {formatCurrency(selection.amount)}
                  {selection.frequency === "monthly" && "/mês"}
                </strong>{" "}
                · {FREQUENCY_LABELS[selection.frequency]}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={closeCheckout}
            disabled={isProcessing}
            aria-label="Fechar checkout"
            className="grid size-10 shrink-0 place-items-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-ink focus-visible:outline-2 focus-visible:outline-brand-600 disabled:opacity-40"
          >
            <X aria-hidden className="size-5" />
          </button>
        </header>

        <div className="mt-6">
          <StepIndicator current={currentStep} />
        </div>

        <h3
          id="checkout-step-title"
          ref={headingRef}
          tabIndex={-1}
          className="mt-6 mb-5 text-lg font-bold text-ink outline-none"
        >
          {step.title}
        </h3>

        {currentStep === "amount" && <AmountStep />}
        {currentStep === "donor" && <DonorStep />}
        {currentStep === "payment" && <PaymentStep />}

        <p className="mt-6 text-center text-xs text-slate-500">
          Ambiente de demonstração: nenhuma cobrança real será feita.
        </p>
      </div>
    </dialog>
  );
}

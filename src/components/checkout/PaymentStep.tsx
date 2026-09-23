"use client";

import { ArrowLeft, CreditCard, LoaderCircle, Lock, QrCode } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState, type FormEvent } from "react";
import { flushSync } from "react-dom";

import { buttonStyles } from "@/components/ui/button-styles";
import { CopyButton } from "@/components/ui/CopyButton";
import { FormField } from "@/components/ui/FormField";
import { useDonation } from "@/context/DonationContext";
import { cn } from "@/lib/cn";
import { formatCardExpiry, formatCardNumber, formatCurrency, onlyDigits } from "@/lib/format";
import { buildPixPayload } from "@/lib/pix";
import { hasErrors, validateCard, type CardForm, type CardFormErrors } from "@/lib/validation";
import type { PaymentDetails, PaymentMethod } from "@/types/donation";

import { PixQrCode } from "./PixQrCode";

const METHODS: ReadonlyArray<{ id: PaymentMethod; label: string; badge?: string; icon: typeof QrCode }> = [
  { id: "pix", label: "Pix", badge: "Aprovação imediata", icon: QrCode },
  { id: "credit-card", label: "Cartão de crédito", icon: CreditCard },
];

const EMPTY_CARD: CardForm = { number: "", holderName: "", expiry: "", cvv: "" };

export function PaymentStep() {
  const router = useRouter();
  const { state, goToStep, submitDonation } = useDonation();
  const { amount, frequency } = state.selection;
  const isProcessing = state.status === "processing";
  const id = useId();

  const [method, setMethod] = useState<PaymentMethod>(state.payment?.method ?? "pix");
  // Os dados do cartão vivem SÓ aqui: nunca vão para o Context nem para o storage.
  const [card, setCard] = useState<CardForm>(EMPTY_CARD);
  const [errors, setErrors] = useState<CardFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const pixPayload = buildPixPayload(amount);

  // Pré-carrega a rota de agradecimento: o redirecionamento após o pagamento fica instantâneo.
  useEffect(() => {
    router.prefetch("/obrigado");
  }, [router]);

  function updateCard(field: keyof CardForm, value: string) {
    const next = { ...card, [field]: value };
    setCard(next);
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: validateCard(next)[field] }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isProcessing) return;

    let payment: PaymentDetails;
    if (method === "credit-card") {
      const nextErrors = validateCard(card);
      if (hasErrors(nextErrors)) {
        flushSync(() => setErrors(nextErrors));
        event.currentTarget.querySelector<HTMLInputElement>("[aria-invalid]")?.focus();
        return;
      }
      payment = { method: "credit-card", cardLastDigits: onlyDigits(card.number).slice(-4) };
    } else {
      payment = { method: "pix" };
    }

    setSubmitError(null);
    try {
      await submitDonation(payment);
      router.push("/obrigado");
    } catch {
      setSubmitError("Não foi possível concluir a doação. Revise seus dados e tente novamente.");
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit} aria-busy={isProcessing} className="space-y-5">
      <fieldset disabled={isProcessing}>
        <legend className="sr-only">Forma de pagamento</legend>
        <div className="grid grid-cols-2 gap-3">
          {METHODS.map(({ id: methodId, label, badge, icon: Icon }) => (
            <label
              key={methodId}
              className={cn(
                "relative flex cursor-pointer flex-col items-center gap-1 rounded-2xl border-2 border-slate-200 p-4 text-center transition-colors",
                "hover:border-brand-500 has-checked:border-brand-600 has-checked:bg-brand-50",
                "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand-600",
              )}
            >
              <input
                type="radio"
                name={`${id}-method`}
                value={methodId}
                checked={method === methodId}
                onChange={() => setMethod(methodId)}
                className="sr-only"
              />
              <Icon aria-hidden className="size-6 text-brand-600" />
              <span className="font-semibold text-ink">{label}</span>
              {badge && <span className="text-xs text-brand-700">{badge}</span>}
            </label>
          ))}
        </div>
      </fieldset>

      {method === "pix" ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-surface p-5 text-center">
          <PixQrCode
            payload={pixPayload}
            label={`QR Code Pix simulado no valor de ${formatCurrency(amount)}`}
          />
          <p className="text-sm text-slate-600">
            Escaneie o QR Code no app do seu banco ou use o Pix Copia e Cola:
          </p>
          <label htmlFor={`${id}-pix`} className="sr-only">
            Código Pix Copia e Cola
          </label>
          <textarea
            id={`${id}-pix`}
            readOnly
            rows={3}
            value={pixPayload}
            onFocus={(event) => event.currentTarget.select()}
            className="w-full resize-none rounded-xl border border-slate-300 bg-white p-3 font-mono text-xs break-all text-slate-700"
          />
          <CopyButton text={pixPayload} label="Copiar código Pix" className="w-full" />
          {frequency === "monthly" && (
            <p className="text-xs text-slate-500">
              Na doação mensal via Pix, enviaremos um novo código por e-mail todo mês.
            </p>
          )}
        </div>
      ) : (
        <fieldset disabled={isProcessing} className="grid grid-cols-2 gap-4">
          <legend className="sr-only">Dados do cartão</legend>
          <FormField
            id={`${id}-card-number`}
            label="Número do cartão"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="0000 0000 0000 0000"
            value={formatCardNumber(card.number)}
            onChange={(event) => updateCard("number", onlyDigits(event.target.value).slice(0, 16))}
            error={errors.number}
            className="col-span-2"
          />
          <FormField
            id={`${id}-card-name`}
            label="Nome impresso no cartão"
            autoComplete="cc-name"
            value={card.holderName}
            onChange={(event) => updateCard("holderName", event.target.value.toUpperCase())}
            error={errors.holderName}
            className="col-span-2"
          />
          <FormField
            id={`${id}-card-expiry`}
            label="Validade"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/AA"
            value={card.expiry}
            onChange={(event) => updateCard("expiry", formatCardExpiry(event.target.value))}
            error={errors.expiry}
          />
          <FormField
            id={`${id}-card-cvv`}
            label="CVV"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="123"
            value={card.cvv}
            onChange={(event) => updateCard("cvv", onlyDigits(event.target.value).slice(0, 4))}
            error={errors.cvv}
          />
          {frequency === "monthly" && (
            <p className="col-span-2 text-xs text-slate-500">
              A cobrança será feita automaticamente todo mês neste cartão.
            </p>
          )}
        </fieldset>
      )}

      {submitError && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        <button
          type="button"
          disabled={isProcessing}
          onClick={() => goToStep("donor")}
          className={buttonStyles({ variant: "outline", size: "lg", className: "sm:flex-1" })}
        >
          <ArrowLeft aria-hidden className="size-5" />
          Voltar
        </button>
        <button
          type="submit"
          disabled={isProcessing}
          className={buttonStyles({ size: "lg", className: "sm:flex-[2]" })}
        >
          {isProcessing ? (
            <>
              <LoaderCircle aria-hidden className="size-5 animate-spin motion-reduce:animate-none" />
              Processando…
            </>
          ) : (
            <>
              <Lock aria-hidden className="size-4" />
              Finalizar doação
            </>
          )}
        </button>
      </div>

      {/* Anuncia o início do processamento para quem usa leitor de tela. */}
      <p role="status" className="sr-only">
        {isProcessing && "Processando sua doação, aguarde."}
      </p>
    </form>
  );
}

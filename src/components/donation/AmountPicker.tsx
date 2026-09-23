"use client";

import { HeartHandshake } from "lucide-react";
import { useId, useState } from "react";

import { useDonation } from "@/context/DonationContext";
import {
  FREQUENCY_LABELS,
  MIN_DONATION_AMOUNT,
  PRESET_AMOUNTS,
  findImpactTier,
} from "@/data/donation";
import { cn } from "@/lib/cn";
import { centsToReaisInput, formatCurrency, reaisToCents } from "@/lib/format";
import type { Cents, DonationFrequency } from "@/types/donation";

const FREQUENCIES = Object.keys(FREQUENCY_LABELS) as DonationFrequency[];

export function isAmountValid(amount: Cents): boolean {
  return amount >= MIN_DONATION_AMOUNT;
}

/** Aceita só dígitos e uma vírgula com até 2 casas: "1a0,555" -> "10,55". */
function sanitizeReais(value: string): string {
  const [integer = "", ...rest] = value.replace(/[^\d,]/g, "").split(",");
  const trimmedInteger = integer.slice(0, 6);
  return rest.length > 0 ? `${trimmedInteger},${rest.join("").slice(0, 2)}` : trimmedInteger;
}

/* Botões de opção: <input type="radio"> nativo (escondido) + <label> estilizado.
   Assim as setas do teclado, o Tab e os leitores de tela funcionam sem JS extra. */
const optionClass =
  "relative flex cursor-pointer items-center justify-center rounded-full border border-slate-300 " +
  "font-semibold text-ink transition-colors hover:border-brand-600 " +
  "has-checked:border-brand-600 has-checked:bg-brand-600 has-checked:text-white " +
  "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand-600";

/**
 * Escolha de frequência + valor. Lê e escreve direto no Context,
 * por isso o Hero e a etapa 1 do checkout ficam sempre sincronizados.
 */
export function AmountPicker() {
  const { state, setFrequency, setAmount } = useDonation();
  const { frequency, amount, isCustomAmount } = state.selection;

  const id = useId();
  const customInputId = `${id}-custom`;
  const errorId = `${id}-error`;
  const impactId = `${id}-impact`;

  // Texto "cru" do campo; o valor oficial (em centavos) fica no Context.
  const [customText, setCustomText] = useState(() =>
    isCustomAmount && amount > 0 ? centsToReaisInput(amount) : "",
  );
  const [touched, setTouched] = useState(false);

  // Se outro componente mudou o valor (ex.: card da seção de impacto), o texto
  // local fica desatualizado: nesse caso exibimos o valor que está no Context.
  const displayText = !isCustomAmount
    ? ""
    : reaisToCents(customText) === amount
      ? customText
      : centsToReaisInput(amount);

  const showError = isCustomAmount && touched && !isAmountValid(amount);
  const tier = findImpactTier(amount);
  const suffix = frequency === "monthly" ? "/mês" : "";

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="sr-only">Frequência da doação</legend>
        <div className="grid grid-cols-2 gap-1 rounded-full bg-slate-100 p-1">
          {FREQUENCIES.map((option) => (
            <label
              key={option}
              className={cn(
                optionClass,
                "h-10 border-transparent text-sm hover:border-transparent",
              )}
            >
              <input
                type="radio"
                name={`${id}-frequency`}
                value={option}
                checked={frequency === option}
                onChange={() => setFrequency(option)}
                className="sr-only"
              />
              {FREQUENCY_LABELS[option]}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-ink">Escolha um valor</legend>
        <div className="grid grid-cols-3 gap-2">
          {PRESET_AMOUNTS.map((preset) => (
            <label key={preset} className={cn(optionClass, "h-12")}>
              <input
                type="radio"
                name={`${id}-amount`}
                value={preset}
                checked={!isCustomAmount && amount === preset}
                onChange={() => {
                  setAmount(preset, false);
                  setCustomText("");
                  setTouched(false);
                }}
                className="sr-only"
              />
              {formatCurrency(preset).replace(",00", "")}
            </label>
          ))}
        </div>

        <label htmlFor={customInputId} className="mt-4 mb-2 block text-sm font-semibold text-ink">
          Outro valor
        </label>
        <div
          className={cn(
            "flex h-12 items-center rounded-full border px-4 focus-within:outline-2 focus-within:outline-offset-2",
            showError
              ? "border-red-600 focus-within:outline-red-600"
              : "border-slate-300 focus-within:outline-brand-600",
            isCustomAmount && !showError && "border-brand-600",
          )}
        >
          <span aria-hidden className="mr-2 font-semibold text-slate-500">
            R$
          </span>
          <input
            id={customInputId}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder={`mínimo ${centsToReaisInput(MIN_DONATION_AMOUNT)}`}
            value={displayText}
            onChange={(event) => {
              const text = sanitizeReais(event.target.value);
              setCustomText(text);
              setAmount(reaisToCents(text), true);
            }}
            onBlur={() => {
              if (displayText) setTouched(true);
            }}
            aria-invalid={showError || undefined}
            aria-describedby={showError ? errorId : impactId}
            className="w-full bg-transparent font-semibold text-ink outline-none placeholder:font-normal placeholder:text-slate-400"
          />
        </div>
        {showError && (
          <p id={errorId} role="alert" className="mt-2 text-sm text-red-700">
            O valor mínimo é {formatCurrency(MIN_DONATION_AMOUNT)}.
          </p>
        )}
      </fieldset>

      {/* aria-live: o leitor de tela anuncia o novo impacto quando o valor muda. */}
      <p
        id={impactId}
        aria-live="polite"
        className="flex items-start gap-3 rounded-2xl bg-brand-50 p-4 text-sm text-brand-900"
      >
        <HeartHandshake aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-600" />
        {isAmountValid(amount) ? (
          <span>
            Doando <strong>{formatCurrency(amount)}{suffix}</strong>
            {tier ? (
              <>
                : {formatCurrency(tier.amount).replace(",00", "")} {tier.description}.
              </>
            ) : (
              <>, você já ajuda a manter nossos projetos de pé.</>
            )}
          </span>
        ) : (
          <span>Toda contribuição a partir de {formatCurrency(MIN_DONATION_AMOUNT)} faz diferença.</span>
        )}
      </p>
    </div>
  );
}

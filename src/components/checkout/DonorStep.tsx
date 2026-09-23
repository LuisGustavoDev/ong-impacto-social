"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { flushSync } from "react-dom";

import { buttonStyles } from "@/components/ui/button-styles";
import { FormField } from "@/components/ui/FormField";
import { useDonation } from "@/context/DonationContext";
import { formatCpf, onlyDigits } from "@/lib/format";
import { hasErrors, validateDonor } from "@/lib/validation";
import type { DonorFormErrors, DonorInfo } from "@/types/donation";

const EMPTY_DONOR: DonorInfo = { fullName: "", email: "", cpf: "" };

export function DonorStep() {
  const { state, setDonor, goToStep } = useDonation();
  const id = useId();

  // Reabrindo o checkout, os dados já digitados voltam preenchidos.
  const [values, setValues] = useState<DonorInfo>(state.donor ?? EMPTY_DONOR);
  const [errors, setErrors] = useState<DonorFormErrors>({});

  function update(field: keyof DonorInfo, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    // Se o campo estava com erro, revalida enquanto a pessoa corrige.
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: validateDonor(next)[field] }));
    }
  }

  /** Valida no blur, mas só se algo foi digitado (não acusa erro só por passar pelo campo). */
  function validateField(field: keyof DonorInfo) {
    if (!values[field]) return;
    setErrors((current) => ({ ...current, [field]: validateDonor(values)[field] }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateDonor(values);

    if (hasErrors(nextErrors)) {
      // flushSync: o erro precisa estar no DOM antes do foco, para o leitor de tela lê-lo.
      flushSync(() => setErrors(nextErrors));
      const firstInvalid = event.currentTarget.querySelector<HTMLInputElement>("[aria-invalid]");
      firstInvalid?.focus();
      return;
    }

    setDonor({ ...values, fullName: values.fullName.trim(), email: values.email.trim() });
    goToStep("payment");
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4">
      <FormField
        id={`${id}-name`}
        name="fullName"
        label="Nome completo"
        autoComplete="name"
        value={values.fullName}
        onChange={(event) => update("fullName", event.target.value)}
        onBlur={() => validateField("fullName")}
        error={errors.fullName}
      />
      <FormField
        id={`${id}-email`}
        name="email"
        type="email"
        label="E-mail"
        autoComplete="email"
        inputMode="email"
        hint="Enviaremos o recibo da doação para este e-mail."
        value={values.email}
        onChange={(event) => update("email", event.target.value)}
        onBlur={() => validateField("email")}
        error={errors.email}
      />
      <FormField
        id={`${id}-cpf`}
        name="cpf"
        label="CPF"
        inputMode="numeric"
        autoComplete="off"
        placeholder="000.000.000-00"
        hint="Necessário para emitir o recibo para o Imposto de Renda."
        value={formatCpf(values.cpf)}
        onChange={(event) => update("cpf", onlyDigits(event.target.value).slice(0, 11))}
        onBlur={() => validateField("cpf")}
        error={errors.cpf}
      />

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
        <button
          type="button"
          onClick={() => goToStep("amount")}
          className={buttonStyles({ variant: "outline", size: "lg", className: "sm:flex-1" })}
        >
          <ArrowLeft aria-hidden className="size-5" />
          Voltar
        </button>
        <button type="submit" className={buttonStyles({ size: "lg", className: "sm:flex-[2]" })}>
          Ir para o pagamento
          <ArrowRight aria-hidden className="size-5" />
        </button>
      </div>
    </form>
  );
}

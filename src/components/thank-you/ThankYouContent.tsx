"use client";

import { CircleCheck, House, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

import { buttonStyles } from "@/components/ui/button-styles";
import { Container } from "@/components/ui/Container";
import { CopyButton } from "@/components/ui/CopyButton";
import { useDonation } from "@/context/DonationContext";
import { FREQUENCY_LABELS, findImpactTier } from "@/data/donation";
import { parseConfirmation, readConfirmationRaw } from "@/lib/donation-storage";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { buildPixPayload } from "@/lib/pix";
import type { DonationConfirmation, PaymentDetails } from "@/types/donation";

import { ShareButton } from "./ShareButton";

/* O sessionStorage não muda sozinho durante a visita, então não há o que "assinar". */
const noopSubscribe = () => () => {};

/**
 * Snapshot do storage sem quebrar a hidratação: no servidor (e na 1ª renderização
 * do cliente) devolve `undefined` = "ainda não sei"; depois, string ou null.
 */
function useStoredConfirmationRaw(): string | null | undefined {
  return useSyncExternalStore(noopSubscribe, readConfirmationRaw, () => undefined);
}

function describePayment(payment: PaymentDetails): string {
  // Graças à união discriminada, cardLastDigits só existe no ramo "credit-card".
  switch (payment.method) {
    case "pix":
      return "Pix";
    case "credit-card":
      return `Cartão de crédito final ${payment.cardLastDigits}`;
  }
}

export function ThankYouContent() {
  const router = useRouter();
  const { state, resetDonation } = useDonation();
  const raw = useStoredConfirmationRaw();

  // 1º o Context (fluxo normal); se vier de um F5, o sessionStorage.
  const confirmation = state.confirmation ?? (raw ? parseConfirmation(raw) : null);
  const isResolved = raw !== undefined;

  // Acesso direto a /obrigado sem doação: volta para a home.
  useEffect(() => {
    if (isResolved && !confirmation) router.replace("/");
  }, [isResolved, confirmation, router]);

  if (!confirmation) {
    return (
      <div role="status" className="grid min-h-[50vh] place-items-center">
        <LoaderCircle aria-hidden className="size-8 animate-spin text-brand-600 motion-reduce:animate-none" />
        <span className="sr-only">Carregando o resumo da doação…</span>
      </div>
    );
  }

  return <Receipt confirmation={confirmation} onBackHome={resetDonation} />;
}

function Receipt({
  confirmation,
  onBackHome,
}: {
  confirmation: DonationConfirmation;
  onBackHome: () => void;
}) {
  const { id, amount, frequency, donorName, donorEmail, payment, createdAt } = confirmation;
  const firstName = donorName.split(" ")[0];
  const tier = findImpactTier(amount);
  const pixPayload = payment.method === "pix" ? buildPixPayload(amount) : null;
  const amountLabel = `${formatCurrency(amount)}${frequency === "monthly" ? "/mês" : ""}`;

  const rows: Array<[string, string]> = [
    ["Protocolo", id],
    ["Doador", donorName],
    ["E-mail", donorEmail],
    ["Valor", amountLabel],
    ["Tipo", FREQUENCY_LABELS[frequency]],
    ["Pagamento", describePayment(payment)],
    ["Data", formatDateTime(createdAt)],
  ];

  return (
    <Container className="py-16 lg:py-24">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-brand-50 text-brand-600">
            <CircleCheck aria-hidden className="size-9" />
          </span>
          <h1 className="mt-6 text-3xl font-bold text-balance text-ink sm:text-4xl">
            Obrigado, {firstName}!
          </h1>
          <p className="mt-4 text-lg text-pretty text-slate-600">
            Sua doação foi confirmada. Enviamos o recibo para{" "}
            <strong className="text-ink">{donorEmail}</strong>.
          </p>
          {tier && (
            <p className="mt-2 text-pretty text-brand-700">
              Na prática, {formatCurrency(tier.amount).replace(",00", "")} {tier.description}.
            </p>
          )}
        </div>

        <section
          aria-labelledby="recibo-title"
          className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <h2 id="recibo-title" className="text-lg font-bold text-ink">
            Resumo da doação
          </h2>
          <dl className="mt-4 divide-y divide-slate-100">
            {rows.map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between sm:gap-6">
                <dt className="text-sm text-slate-500">{label}</dt>
                <dd className="font-semibold break-all text-ink sm:text-right">{value}</dd>
              </div>
            ))}
          </dl>

          {pixPayload && (
            <div className="mt-6 rounded-2xl bg-surface p-5">
              <h3 className="font-semibold text-ink">Ainda não pagou o Pix?</h3>
              <p className="mt-1 text-sm text-slate-600">
                Copie o código abaixo e cole na área Pix do app do seu banco.
              </p>
              <p className="mt-3 rounded-xl bg-white p-3 font-mono text-xs break-all text-slate-700">
                {pixPayload}
              </p>
              <CopyButton text={pixPayload} label="Copiar código Pix" className="mt-3 w-full sm:w-auto" />
            </div>
          )}
        </section>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <ShareButton />
          <Link
            href="/"
            onClick={onBackHome}
            className={buttonStyles({ size: "lg", className: "w-full" })}
          >
            <House aria-hidden className="size-5" />
            Voltar ao início
          </Link>
        </div>
      </div>
    </Container>
  );
}

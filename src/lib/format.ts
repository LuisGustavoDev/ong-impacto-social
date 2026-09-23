import type { Cents } from "@/types/donation";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** 10000 -> "R$ 100,00" */
export function formatCurrency(amount: Cents): string {
  return brl.format(amount / 100);
}

/** Converte reais digitados pelo usuário ("25,50" ou "25") para centavos. */
export function reaisToCents(value: string): Cents {
  const normalized = value.replace(/\./g, "").replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) : 0;
}
/** 2550 -> "25,50": valor inicial do campo "Outro valor". */
export function centsToReaisInput(amount: Cents): string {
  return (amount / 100).toFixed(2).replace(".", ",");
}

/** Mantém só os dígitos: "123.456-78" -> "12345678". */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Máscara progressiva de CPF: "12345678901" -> "123.456.789-01". */
export function formatCpf(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
}

/** Agrupa o número do cartão de 4 em 4 dígitos (até 16). */
export function formatCardNumber(value: string): string {
  return onlyDigits(value)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

/** Máscara de validade: "1228" -> "12/28". */
export function formatCardExpiry(value: string): string {
  const digits = onlyDigits(value).slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

const dateTime = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
});

/** ISO 8601 -> "23 de setembro de 2026 às 14:05". */
export function formatDateTime(iso: string): string {
  return dateTime.format(new Date(iso));
}

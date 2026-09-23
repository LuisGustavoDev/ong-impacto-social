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
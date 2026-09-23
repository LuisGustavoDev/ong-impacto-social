import type {
  Cents,
  DonationFrequency,
  DonationSelection,
  ImpactTier,
} from "@/types/donation";

/** Valores dos botões de seleção rápida do widget (em centavos). */
export const PRESET_AMOUNTS: readonly Cents[] = [5000, 10000, 15000];

/** Menor valor aceito no campo "Outro valor": R$ 10,00. */
export const MIN_DONATION_AMOUNT: Cents = 1000;

/** Estado inicial do widget: doação única de R$ 100 (destacado no design). */
export const DEFAULT_SELECTION: DonationSelection = {
  frequency: "one-time",
  amount: 10000,
  isCustomAmount: false,
};

/**
 * Fonte ÚNICA das equivalências de impacto.
 * O Hero ("R$ 100 = ...") e a seção "Como sua doação ajuda" leem daqui,
 * então a mensagem nunca fica contraditória entre as seções.
 */
export const IMPACT_TIERS: readonly ImpactTier[] = [
  { amount: 5000, description: "garante alimentação por 1 semana" },
  { amount: 10000, description: "equivale a 1 mês de material escolar" },
  { amount: 15000, description: "cobre uma consulta médica" },
  { amount: 30000, description: "ajuda uma família por 1 mês" },
];
/** Rótulos das frequências, compartilhados pelo widget, checkout e recibo. */
export const FREQUENCY_LABELS: Record<DonationFrequency, string> = {
  "one-time": "Doação única",
  monthly: "Doação mensal",
};

/** Retorna o maior nível de impacto que o valor alcança (ou null abaixo do primeiro). */
export function findImpactTier(amount: Cents): ImpactTier | null {
  let match: ImpactTier | null = null;
  for (const tier of IMPACT_TIERS) {
    if (amount >= tier.amount) match = tier;
  }
  return match;
}

/** Valores rápidos têm botão próprio; qualquer outro vai para o campo "Outro valor". */
export function isPresetAmount(amount: Cents): boolean {
  return PRESET_AMOUNTS.includes(amount);
}

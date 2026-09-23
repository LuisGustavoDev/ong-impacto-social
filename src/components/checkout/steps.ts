import type { CheckoutStep } from "@/types/donation";

/** Ordem e títulos das etapas: fonte única para o indicador de progresso e o modal. */
export const CHECKOUT_STEPS: ReadonlyArray<{ id: CheckoutStep; label: string; title: string }> = [
  { id: "amount", label: "Valor", title: "Escolha o valor da doação" },
  { id: "donor", label: "Seus dados", title: "Conte quem está doando" },
  { id: "payment", label: "Pagamento", title: "Escolha como pagar" },
];

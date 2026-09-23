"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";

import { DEFAULT_SELECTION } from "@/data/donation";
import { saveConfirmation } from "@/lib/donation-storage";
import type {
  Cents,
  CheckoutStep,
  DonationConfirmation,
  DonationFrequency,
  DonationState,
  DonorInfo,
  PaymentDetails,
} from "@/types/donation";

/* -------------------------------------------------------------------------- */
/*  Estado                                                                    */
/* -------------------------------------------------------------------------- */

/** Estado do fluxo + a última confirmação gerada (lida pela página /obrigado). */
type State = DonationState & { confirmation: DonationConfirmation | null };

const initialState: State = {
  selection: DEFAULT_SELECTION,
  donor: null,
  payment: null,
  status: "idle",
  currentStep: "amount",
  isCheckoutOpen: false,
  confirmation: null,
};

/* -------------------------------------------------------------------------- */
/*  Ações (união discriminada pelo campo `type`)                              */
/* -------------------------------------------------------------------------- */

type Action =
  | { type: "SET_FREQUENCY"; frequency: DonationFrequency }
  | { type: "SET_AMOUNT"; amount: Cents; isCustomAmount: boolean }
  | { type: "OPEN_CHECKOUT"; step: CheckoutStep }
  | { type: "CLOSE_CHECKOUT" }
  | { type: "GO_TO_STEP"; step: CheckoutStep }
  | { type: "SET_DONOR"; donor: DonorInfo }
  | { type: "SET_PAYMENT"; payment: PaymentDetails }
  | { type: "START_PROCESSING" }
  | { type: "COMPLETE"; confirmation: DonationConfirmation }
  | { type: "RESET" };

/** Função pura: recebe o estado atual + ação e devolve o PRÓXIMO estado. */
function donationReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FREQUENCY":
      return {
        ...state,
        selection: { ...state.selection, frequency: action.frequency },
      };

    case "SET_AMOUNT":
      return {
        ...state,
        selection: {
          ...state.selection,
          amount: action.amount,
          isCustomAmount: action.isCustomAmount,
        },
      };

    case "OPEN_CHECKOUT":
      return {
        ...state,
        isCheckoutOpen: true,
        status: "checkout",
        currentStep: action.step,
      };

    case "CLOSE_CHECKOUT":
      // Não deixa fechar no meio do "processamento" do pagamento.
      if (state.status === "processing") return state;
      // Mantém donor/payment: se o usuário reabrir, não precisa redigitar.
      return { ...state, isCheckoutOpen: false, status: "idle" };

    case "GO_TO_STEP":
      return { ...state, currentStep: action.step };

    case "SET_DONOR":
      return { ...state, donor: action.donor };

    case "SET_PAYMENT":
      return { ...state, payment: action.payment };

    case "START_PROCESSING":
      return { ...state, status: "processing" };

    case "COMPLETE":
      return {
        ...initialState, // limpa o rascunho (dados do doador, pagamento)...
        status: "completed",
        confirmation: action.confirmation, // ...mas guarda o resumo final.
      };

    case "RESET":
      return initialState;
  }
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const PROCESSING_DELAY_MS = 1500;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Protocolo fictício legível, ex.: "JPA-2026-8F3K2". */
function generateProtocol(): string {
  const random = crypto.randomUUID().replace(/-/g, "").slice(0, 5).toUpperCase();
  return `JPA-${new Date().getFullYear()}-${random}`;
}

/* -------------------------------------------------------------------------- */
/*  Context + Provider                                                        */
/* -------------------------------------------------------------------------- */

interface DonationContextValue {
  state: State;
  setFrequency: (frequency: DonationFrequency) => void;
  setAmount: (amount: Cents, isCustomAmount?: boolean) => void;
  /** Widget do Hero abre direto em "donor" (valor já escolhido); outros CTAs em "amount". */
  openCheckout: (step?: CheckoutStep) => void;
  closeCheckout: () => void;
  goToStep: (step: CheckoutStep) => void;
  setDonor: (donor: DonorInfo) => void;
  setPayment: (payment: PaymentDetails) => void;
  /** Simula o pagamento e devolve a confirmação. A navegação fica com quem chamou. */
  submitDonation: (payment: PaymentDetails) => Promise<DonationConfirmation>;
  resetDonation: () => void;
}

const DonationContext = createContext<DonationContextValue | null>(null);

export function DonationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(donationReducer, initialState);

  /**
   * Recebe `payment` por parâmetro (em vez de ler state.payment) de propósito:
   * se o componente chamasse setPayment() e submitDonation() no mesmo clique,
   * `state` ainda seria o valor ANTIGO (closure) e payment viria null.
   */
  async function submitDonation(payment: PaymentDetails): Promise<DonationConfirmation> {
    const { donor, selection } = state;
    if (!donor) {
      throw new Error("Dados do doador ausentes.");
    }

    dispatch({ type: "SET_PAYMENT", payment });
    dispatch({ type: "START_PROCESSING" });
    await wait(PROCESSING_DELAY_MS); // simula a ida ao gateway de pagamento

    const confirmation: DonationConfirmation = {
      id: generateProtocol(),
      frequency: selection.frequency,
      amount: selection.amount,
      donorName: donor.fullName,
      donorEmail: donor.email,
      payment,
      createdAt: new Date().toISOString(),
    };

    saveConfirmation(confirmation);
    dispatch({ type: "COMPLETE", confirmation });
    return confirmation;
  }

  // Sem useMemo/useCallback: o React Compiler (ativo no next.config.ts) memoiza isso.
  const value: DonationContextValue = {
    state,
    setFrequency: (frequency) => dispatch({ type: "SET_FREQUENCY", frequency }),
    setAmount: (amount, isCustomAmount = false) =>
      dispatch({ type: "SET_AMOUNT", amount, isCustomAmount }),
    openCheckout: (step = "amount") => dispatch({ type: "OPEN_CHECKOUT", step }),
    closeCheckout: () => dispatch({ type: "CLOSE_CHECKOUT" }),
    goToStep: (step) => dispatch({ type: "GO_TO_STEP", step }),
    setDonor: (donor) => dispatch({ type: "SET_DONOR", donor }),
    setPayment: (payment) => dispatch({ type: "SET_PAYMENT", payment }),
    submitDonation,
    resetDonation: () => dispatch({ type: "RESET" }),
  };

  return <DonationContext.Provider value={value}>{children}</DonationContext.Provider>;
}

/** Hook de acesso. Falha cedo, com mensagem clara, se usado fora do Provider. */
export function useDonation(): DonationContextValue {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error("useDonation deve ser usado dentro de <DonationProvider>.");
  }
  return context;
}
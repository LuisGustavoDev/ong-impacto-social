/**
 * Tipos de domínio do fluxo de doação.
 *
 * Convenção de negócio: Todos os valores monetários são guardados como inteiros em CENTAVOS
 * para evitar problemas de precisão em ponto flutuante no JavaScript (ex.: 0.1 + 0.2 !== 0.3).
 * A formatação para a moeda local (ex.: "R$ 100,00") é realizada apenas na interface visual.
 */

/* -------------------------------------------------------------------------- */
/*  Configurações do Widget (Hero)                                            */
/* -------------------------------------------------------------------------- */

/** Frequência da contribuição: define se a doação é pontual ("one-time") ou recorrente ("monthly"). */
export type DonationFrequency = "one-time" | "monthly";

/** Tipo semântico que representa valores monetários em centavos (ex.: 5000 = R$ 50,00). */
export type Cents = number;

/** Guarda as escolhas efetuadas pelo utilizador no widget inicial antes de abrir o checkout. */
export interface DonationSelection {
  frequency: DonationFrequency;
  amount: Cents;
  /** Regista se o valor foi introduzido manualmente no campo personalizado em vez dos botões pré-definidos. */
  isCustomAmount: boolean;
}

/** Associa um valor em centavos à descrição do seu impacto direto na causa social. */
export interface ImpactTier {
  amount: Cents;
  description: string;
}

/* -------------------------------------------------------------------------- */
/*  Fluxo de Checkout (Modal)                                                 */
/* -------------------------------------------------------------------------- */

/** Etapas sequenciais do formulário no modal, utilizadas para controlar a barra de progresso. */
export type CheckoutStep = "amount" | "donor" | "payment";

/** Informações essenciais de identificação e contacto do doador. */
export interface DonorInfo {
  fullName: string;
  email: string;
  /** Armazena exclusivamente os dígitos do documento; a formatação com pontuação é feita na vista. */
  cpf: string;
}

/** Mapeamento de mensagens de erro de validação para cada campo do formulário do doador. */
export type DonorFormErrors = Partial<Record<keyof DonorInfo, string>>;

/** Formas de pagamento aceites na simulação. */
export type PaymentMethod = "pix" | "credit-card";

/**
 * União discriminada pelo campo `method`.
 * O compilador do TypeScript garante que `cardLastDigits` só pode ser acedido se o método for cartão de crédito.
 * Por razões de segurança, o número completo do cartão nunca é armazenado no estado.
 */
export type PaymentDetails =
  | { method: "pix" }
  | { method: "credit-card"; cardLastDigits: string };

/* -------------------------------------------------------------------------- */
/*  Estado Global e Confirmação                                               */
/* -------------------------------------------------------------------------- */

/** Estados possíveis do ciclo de vida global da transação. */
export type DonationStatus = "idle" | "checkout" | "processing" | "completed";

/** Estrutura do estado global gerido pelo React Context ao longo da aplicação. */
export interface DonationState {
  selection: DonationSelection;
  donor: DonorInfo | null;
  payment: PaymentDetails | null;
  status: DonationStatus;
  currentStep: CheckoutStep;
  isCheckoutOpen: boolean;
}

/** Registo imutável de confirmação final, utilizado para apresentar o resumo na página de agradecimento. */
export interface DonationConfirmation {
  /** Código único de protocolo da doação (ex.: "JPA-2026-8F3K2"). */
  id: string;
  frequency: DonationFrequency;
  amount: Cents;
  donorName: string;
  donorEmail: string;
  payment: PaymentDetails;
  /** Data no formato ISO 8601 em string para permitir serialização direta no storage sem perda de dados. */
  createdAt: string;
}
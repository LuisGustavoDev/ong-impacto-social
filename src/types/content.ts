/** Link de navegação interna (âncora de seção ou rota). */
export interface NavLink {
  label: string;
  href: string;
}

export type SocialNetwork = "instagram" | "facebook" | "youtube" | "linkedin";

export interface SocialLink {
  network: SocialNetwork;
  label: string;
  href: string;
}

/** Ícone vindo do lucide-react (componente React). */
export type IconComponent = import("lucide-react").LucideIcon;

/** Pilar de atuação exibido em "Nossa causa". */
export interface Pillar {
  title: string;
  description: string;
  icon: IconComponent;
}

/** Indicador numérico de "Nosso impacto". */
export interface Metric {
  value: string;
  label: string;
}

/** Fatia da destinação dos recursos (percentuais somam 100). */
export interface FundAllocation {
  label: string;
  percent: number;
  /** Classe Tailwind de cor de fundo da barra. */
  colorClass: string;
}

export interface Story {
  quote: string;
  name: string;
  role: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

import type { NavLink, SocialLink } from "@/types/content";

export const SITE = {
  name: "Juntos pelo Amanhã",
  tagline: "Mais oportunidades. Um futuro melhor.",
  // CNPJ propositalmente fictício (a ONG é fictícia).
  cnpj: "00.000.000/0001-00",
  email: "contato@juntospeloamanha.org",
} as const;

/** Cada href aponta para o id de uma seção da home. */
export const NAV_LINKS: readonly NavLink[] = [
  { label: "Início", href: "/#inicio" },
  { label: "Nossa causa", href: "/#causa" },
  { label: "Impacto", href: "/#impacto" },
  { label: "Como ajudar", href: "/#como-ajudar" },
  { label: "Histórias", href: "/#historias" },
];

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { network: "instagram", label: "Instagram", href: "#" },
  { network: "facebook", label: "Facebook", href: "#" },
  { network: "youtube", label: "YouTube", href: "#" },
  { network: "linkedin", label: "LinkedIn", href: "#" },
];

export const LEGAL_LINKS: readonly NavLink[] = [
  { label: "Política de Privacidade", href: "#" },
  { label: "Termos de Uso", href: "#" },
];
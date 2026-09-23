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

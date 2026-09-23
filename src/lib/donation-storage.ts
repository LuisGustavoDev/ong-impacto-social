import type { DonationConfirmation } from "@/types/donation";

/**
 * Persistência da confirmação no sessionStorage.
 * Por quê: o Context vive na memória e é zerado num F5.
 * Com isso, a página /obrigado continua mostrando o resumo após recarregar.
 * sessionStorage (e não localStorage) porque o dado deve morrer ao fechar a aba.
 */
const STORAGE_KEY = "jpa:donation-confirmation";

export function saveConfirmation(confirmation: DonationConfirmation): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(confirmation));
  } catch {
    // Navegação privada ou storage bloqueado: seguimos só com o estado em memória.
  }
}

export function loadConfirmation(): DonationConfirmation | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DonationConfirmation) : null;
  } catch {
    return null;
  }
}

export function clearConfirmation(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
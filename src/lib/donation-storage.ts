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

/**
 * Lê o JSON "cru". Serve de snapshot para o useSyncExternalStore da página /obrigado:
 * uma string é comparável por valor, então não causa re-render infinito.
 */
export function readConfirmationRaw(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function parseConfirmation(raw: string): DonationConfirmation | null {
  try {
    return JSON.parse(raw) as DonationConfirmation;
  } catch {
    return null;
  }
}

export function loadConfirmation(): DonationConfirmation | null {
  const raw = readConfirmationRaw();
  return raw ? parseConfirmation(raw) : null;
}

export function clearConfirmation(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
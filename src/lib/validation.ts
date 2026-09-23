import type { DonorFormErrors, DonorInfo } from "@/types/donation";

import { onlyDigits } from "./format";

/* -------------------------------------------------------------------------- */
/*  Doador                                                                    */
/* -------------------------------------------------------------------------- */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Valida os dígitos verificadores do CPF (algoritmo oficial da Receita). */
export function isValidCpf(value: string): boolean {
  const cpf = onlyDigits(value);
  // Sequências repetidas (111.111.111-11) passam no cálculo, mas são inválidas.
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const checkDigit = (length: number) => {
    let sum = 0;
    for (let i = 0; i < length; i++) {
      sum += Number(cpf[i]) * (length + 1 - i);
    }
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  return checkDigit(9) === Number(cpf[9]) && checkDigit(10) === Number(cpf[10]);
}

/** Devolve só os campos com erro; objeto vazio = formulário válido. */
export function validateDonor(donor: DonorInfo): DonorFormErrors {
  const errors: DonorFormErrors = {};
  const name = donor.fullName.trim();

  if (!name) {
    errors.fullName = "Informe seu nome completo.";
  } else if (name.split(/\s+/).length < 2) {
    errors.fullName = "Informe nome e sobrenome.";
  }

  if (!donor.email.trim()) {
    errors.email = "Informe seu e-mail.";
  } else if (!EMAIL_PATTERN.test(donor.email.trim())) {
    errors.email = "Informe um e-mail válido, como nome@exemplo.com.";
  }

  if (!donor.cpf) {
    errors.cpf = "Informe seu CPF.";
  } else if (!isValidCpf(donor.cpf)) {
    errors.cpf = "CPF inválido. Confira os 11 dígitos.";
  }

  return errors;
}

/* -------------------------------------------------------------------------- */
/*  Cartão (apenas no formulário; nunca vai para o estado global)             */
/* -------------------------------------------------------------------------- */

export interface CardForm {
  number: string;
  holderName: string;
  /** "MM/AA" */
  expiry: string;
  cvv: string;
}

export type CardFormErrors = Partial<Record<keyof CardForm, string>>;

/** Algoritmo de Luhn: detecta erros de digitação no número do cartão. */
export function isValidLuhn(value: string): boolean {
  const digits = onlyDigits(value);
  if (digits.length < 13) return false;

  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

/** Validade no formato MM/AA, aceita até o último dia do mês informado. */
export function isValidExpiry(value: string, now = new Date()): boolean {
  const match = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return false;

  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;

  // Dia 0 do mês seguinte = último dia do mês da validade.
  const lastValidDay = new Date(year, month, 0, 23, 59, 59);
  return lastValidDay >= now;
}

export function validateCard(card: CardForm): CardFormErrors {
  const errors: CardFormErrors = {};

  if (!onlyDigits(card.number)) {
    errors.number = "Informe o número do cartão.";
  } else if (!isValidLuhn(card.number)) {
    errors.number = "Número de cartão inválido.";
  }

  if (!card.holderName.trim()) {
    errors.holderName = "Informe o nome impresso no cartão.";
  }

  if (!card.expiry) {
    errors.expiry = "Informe a validade.";
  } else if (!isValidExpiry(card.expiry)) {
    errors.expiry = "Validade inválida ou vencida (use MM/AA).";
  }

  if (!/^\d{3,4}$/.test(card.cvv)) {
    errors.cvv = "O CVV tem 3 ou 4 dígitos.";
  }

  return errors;
}

export function hasErrors(errors: object): boolean {
  return Object.keys(errors).length > 0;
}

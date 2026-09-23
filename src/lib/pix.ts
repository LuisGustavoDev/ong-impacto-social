import type { Cents } from "@/types/donation";

/**
 * Geração do "Pix Copia e Cola" (BR Code) no formato EMV do Banco Central.
 *
 * A chave é FICTÍCIA: o código tem estrutura válida (inclusive o CRC16),
 * mas não aponta para nenhuma conta real. Como o código depende só do valor,
 * o modal e a página /obrigado exibem exatamente o mesmo texto.
 */
export const PIX_KEY = "3f9a1c2e-7b4d-4e8a-9c61-0d2b5e8f4a17";

const MERCHANT_NAME = "JUNTOS PELO AMANHA";
const MERCHANT_CITY = "SAO PAULO";

/** Campo EMV: ID (2 dígitos) + tamanho (2 dígitos) + valor. */
function field(id: string, value: string): string {
  return `${id}${String(value.length).padStart(2, "0")}${value}`;
}

/** CRC16-CCITT (polinômio 0x1021, valor inicial 0xFFFF), exigido pelo padrão. */
function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
}

export function buildPixPayload(amount: Cents): string {
  const payload =
    field("00", "01") +
    field("26", field("00", "br.gov.bcb.pix") + field("01", PIX_KEY)) +
    field("52", "0000") +
    field("53", "986") + // BRL
    field("54", (amount / 100).toFixed(2)) +
    field("58", "BR") +
    field("59", MERCHANT_NAME) +
    field("60", MERCHANT_CITY) +
    field("62", field("05", "***")) +
    "6304"; // ID + tamanho do CRC, que é calculado sobre tudo o que vem antes

  return payload + crc16(payload);
}

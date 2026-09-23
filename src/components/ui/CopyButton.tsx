"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { buttonStyles, type ButtonVariant } from "./button-styles";

interface CopyButtonProps {
  text: string;
  label?: string;
  variant?: ButtonVariant;
  className?: string;
}

const FEEDBACK_MS = 2500;

/** Copia `text` para a área de transferência e confirma visualmente e para leitores de tela. */
export function CopyButton({ text, label = "Copiar", variant = "outline", className }: CopyButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), FEEDBACK_MS);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        className={buttonStyles({ variant, size: "md", className })}
      >
        {status === "copied" ? (
          <Check aria-hidden className="size-4" />
        ) : (
          <Copy aria-hidden className="size-4" />
        )}
        {status === "copied" ? "Copiado!" : label}
      </button>
      <span role="status" className="sr-only">
        {status === "copied" && "Copiado para a área de transferência."}
        {status === "error" && "Não foi possível copiar. Selecione o texto e copie manualmente."}
      </span>
    </>
  );
}

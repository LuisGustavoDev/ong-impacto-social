"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";

import { buttonStyles } from "@/components/ui/button-styles";
import { SITE } from "@/data/site";

const SHARE_TEXT = `Acabei de apoiar a ${SITE.name}, que garante educação, saúde e proteção para crianças. Doe você também!`;

/**
 * Web Share API (menu nativo no celular) com fallback para copiar o link.
 * Compartilha só a causa: nenhum dado da doação (valor, nome) sai da página.
 */
export function ShareButton() {
  const [feedback, setFeedback] = useState("");

  async function handleShare() {
    const url = window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({ title: SITE.name, text: SHARE_TEXT, url });
      } catch {
        // A pessoa fechou o menu de compartilhamento: nada a fazer.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(`${SHARE_TEXT} ${url}`);
      setFeedback("Link copiado! Cole nas suas redes para compartilhar.");
    } catch {
      setFeedback(`Compartilhe o endereço: ${url}`);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleShare}
        className={buttonStyles({ variant: "outline", size: "lg", className: "w-full" })}
      >
        <Share2 aria-hidden className="size-5" />
        Compartilhar
      </button>
      <p role="status" className="text-center text-sm text-brand-700">
        {feedback}
      </p>
    </div>
  );
}

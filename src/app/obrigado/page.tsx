import type { Metadata } from "next";

import { ThankYouContent } from "@/components/thank-you/ThankYouContent";

export const metadata: Metadata = {
  title: "Obrigado pela doação | Juntos pelo Amanhã",
  // Página pessoal de confirmação: não deve aparecer em buscadores.
  robots: { index: false, follow: false },
};

/** Server Component: define metadata; o conteúdo (que lê Context/storage) é client. */
export default function ObrigadoPage() {
  return (
    <main id="conteudo" className="flex-1 bg-surface">
      <ThankYouContent />
    </main>
  );
}

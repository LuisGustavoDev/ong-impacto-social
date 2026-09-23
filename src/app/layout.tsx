import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { DonationProvider } from "@/context/DonationContext";
import "./globals.css";

// next/font baixa a fonte no build e serve do próprio domínio (sem layout shift).
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Juntos pelo Amanhã | Doe e transforme vidas",
  description:
    "ONG dedicada a garantir educação, saúde e proteção para crianças em situação de vulnerabilidade.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={jakarta.variable}>
      <body className="flex min-h-dvh flex-col bg-white font-sans text-slate-700 antialiased">
        <DonationProvider>
          {/* Acessibilidade: permite pular o menu usando o teclado (Tab). */}
          <a
            href="#conteudo"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-accent-500 focus:px-4 focus:py-2 focus:text-ink"
          >
            Pular para o conteúdo
          </a>
          <Navbar />
          {children}
          <Footer />
          <CheckoutModal />
        </DonationProvider>
      </body>
    </html>
  );
}

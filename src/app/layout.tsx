import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Juntos pelo Amanhã | Doe e transforme vidas",
  description:
    "ONG dedicada a garantir educação, saúde e proteção para crianças em situação de vulnerabilidade.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { DonateButton } from "@/components/donation/DonateButton";
import type { NavLink } from "@/types/content";

const PANEL_ID = "mobile-menu";

/** Botão hambúrguer + painel. Só aparece abaixo de lg (1024px). */
export function MobileMenu({ links }: { links: readonly NavLink[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  // Fecha com a tecla Esc (acessibilidade de teclado).
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={PANEL_ID}
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        className="grid size-10 place-items-center rounded-full text-ink hover:bg-brand-50"
      >
        {isOpen ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
      </button>

      {isOpen && (
        <nav
          id={PANEL_ID}
          aria-label="Menu principal"
          className="absolute inset-x-0 top-full border-b border-slate-200 bg-white shadow-lg"
        >
          <ul className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={close}
                  className="block rounded-lg px-3 py-3 font-medium text-ink hover:bg-brand-50"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
            <DonateButton size="lg" className="w-full" onClick={close} />
          </div>
        </nav>
      )}
    </div>
  );
}
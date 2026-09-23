import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { LEGAL_LINKS, NAV_LINKS, SITE, SOCIAL_LINKS } from "@/data/site";

import { Logo } from "./Logo";
import { SocialIcon } from "./SocialIcon";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-950 text-sm text-white/80">
      <Container className="grid gap-10 py-12 lg:grid-cols-[1fr_auto_auto] lg:items-center lg:gap-12">
        {/* Marca */}
        <div className="space-y-3">
          <Logo tone="light" />
          <p className="text-xs">{SITE.tagline}</p>
        </div>

        {/* Navegação */}
        <nav aria-label="Rodapé">
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Redes sociais */}
        <ul className="flex gap-3">
          {SOCIAL_LINKS.map((social) => (
            <li key={social.network}>
              <a
                href={social.href}
                aria-label={social.label}
                className="grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-accent-500 hover:text-ink"
              >
                <SocialIcon network={social.network} />
              </a>
            </li>
          ))}
        </ul>
      </Container>

      {/* Linha institucional: credibilidade (CNPJ) + links legais */}
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.name}. Todos os direitos reservados. · CNPJ {SITE.cnpj}
          </p>
          <ul className="flex gap-4">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}

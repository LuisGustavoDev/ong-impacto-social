import Link from "next/link";

import { DonateButton } from "@/components/donation/DonateButton";
import { Container } from "@/components/ui/Container";
import { NAV_LINKS } from "@/data/site";

import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

/**
 * Server Component: o HTML do header é gerado no servidor.
 * Só DonateButton e MobileMenu (que têm interação) rodam no cliente.
 */
export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <Container className="relative flex h-16 items-center justify-between gap-4 lg:h-20">
        <Logo />

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-ink transition-colors hover:text-brand-600"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* Em telas muito estreitas o CTA vai para dentro do menu. */}
          <DonateButton size="sm" withIcon={false} className="hidden sm:inline-flex" />
          <MobileMenu links={NAV_LINKS} />
        </div>
      </Container>
    </header>
  );
}
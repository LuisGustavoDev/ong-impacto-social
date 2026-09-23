import { CircleCheck } from "lucide-react";
import Link from "next/link";

import { DonationWidget } from "@/components/donation/DonationWidget";
import { buttonStyles } from "@/components/ui/button-styles";
import { Container } from "@/components/ui/Container";
import { FUND_ALLOCATION } from "@/data/content";
import { SITE } from "@/data/site";

const programsShare = FUND_ALLOCATION[0].percent;

const TRUST_POINTS = [
  `${programsShare}% dos recursos vão direto para os projetos`,
  "Relatório anual auditado e público",
  "Cancele a doação mensal quando quiser",
];

export function HeroSection() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-brand-950 text-white"
    >
      {/* Brilhos decorativos */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 size-96 rounded-full bg-brand-500/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 size-80 rounded-full bg-accent-500/20 blur-3xl"
      />

      <Container className="relative grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-24">
        <div>
          <p className="text-sm font-semibold tracking-wide text-accent-400 uppercase">
            ONG {SITE.name}
          </p>
          <h1
            id="hero-title"
            className="mt-3 text-4xl leading-tight font-bold text-balance sm:text-5xl"
          >
            Toda criança merece um amanhã cheio de possibilidades.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-pretty text-white/80">
            Garantimos educação, saúde e proteção para crianças em situação de
            vulnerabilidade. Com a sua doação, o futuro delas começa hoje.
          </p>

          <ul className="mt-8 space-y-3">
            {TRUST_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-3 text-white/90">
                <CircleCheck aria-hidden className="size-5 shrink-0 text-accent-400" />
                {point}
              </li>
            ))}
          </ul>

          <Link
            href="/#causa"
            className={buttonStyles({ variant: "outline-light", size: "lg", className: "mt-10" })}
          >
            Conheça nossa causa
          </Link>
        </div>

        <DonationWidget />
      </Container>
    </section>
  );
}

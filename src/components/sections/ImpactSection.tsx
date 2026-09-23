import { BookOpen, HandHeart, Stethoscope, Utensils } from "lucide-react";

import { DonateButton } from "@/components/donation/DonateButton";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IMPACT_TIERS } from "@/data/donation";
import { formatCurrency } from "@/lib/format";
import type { IconComponent } from "@/types/content";

/** Ícone por posição do nível (a ordem vem de IMPACT_TIERS). */
const TIER_ICONS: readonly IconComponent[] = [Utensils, BookOpen, Stethoscope, HandHeart];

export function ImpactSection() {
  return (
    <section id="como-ajudar" aria-labelledby="como-ajudar-title" className="py-20 lg:py-28">
      <Container>
        <SectionHeading
          id="como-ajudar-title"
          eyebrow="Como sua doação ajuda"
          title="Cada valor vira cuidado de verdade"
          description="Escolha um valor e veja, na prática, o que ele garante para uma criança."
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {IMPACT_TIERS.map((tier, index) => {
            const Icon = TIER_ICONS[index % TIER_ICONS.length];
            const value = formatCurrency(tier.amount).replace(",00", "");

            return (
              <li
                key={tier.amount}
                className="flex flex-col rounded-3xl border border-slate-200 p-6 transition-shadow hover:shadow-lg"
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-accent-500/15 text-accent-600">
                  <Icon aria-hidden className="size-6" />
                </span>
                <h3 className="mt-5 text-3xl font-bold text-ink">{value}</h3>
                <p className="mt-2 flex-1 text-slate-600 first-letter:uppercase">
                  {tier.description}
                </p>
                <DonateButton
                  amount={tier.amount}
                  step="donor"
                  variant="outline"
                  label={`Doar ${value}`}
                  className="mt-6 w-full"
                />
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

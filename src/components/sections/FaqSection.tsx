import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQ_ITEMS } from "@/data/content";
import { SITE } from "@/data/site";

import { FaqAccordion } from "./FaqAccordion";

export function FaqSection() {
  return (
    <section id="duvidas" aria-labelledby="duvidas-title" className="bg-surface py-20 lg:py-28">
      <Container>
        <div className="mx-auto max-w-3xl">
        <SectionHeading
          id="duvidas-title"
          eyebrow="Dúvidas frequentes"
          title="Ficou com alguma pergunta?"
        />
        <div className="mt-12">
          <FaqAccordion items={FAQ_ITEMS} />
        </div>
        <p className="mt-8 text-center text-slate-600">
          Não encontrou sua resposta? Escreva para{" "}
          <a
            href={`mailto:${SITE.email}`}
            className="font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-600"
          >
            {SITE.email}
          </a>
          .
        </p>
        </div>
      </Container>
    </section>
  );
}

import { Quote } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { STORIES } from "@/data/content";

export function StoriesSection() {
  return (
    <section id="historias" aria-labelledby="historias-title" className="bg-brand-900 py-20 lg:py-28">
      <Container>
        <SectionHeading
          id="historias-title"
          eyebrow="Histórias"
          title="Quem vive a transformação conta"
          tone="light"
        />

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {STORIES.map((story) => (
            <li key={story.name}>
              <figure className="flex h-full flex-col rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
                <Quote aria-hidden className="size-8 text-accent-400" />
                <blockquote className="mt-4 flex-1 text-lg text-white/90">
                  <p>“{story.quote}”</p>
                </blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="block font-semibold text-white">{story.name}</span>
                  <span className="text-white/70">{story.role}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-xs text-white/60">
          Depoimentos ilustrativos: a ONG e as pessoas citadas são fictícias.
        </p>
      </Container>
    </section>
  );
}

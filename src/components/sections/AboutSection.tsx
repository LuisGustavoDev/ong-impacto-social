import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ABOUT, PILLARS } from "@/data/content";

export function AboutSection() {
  const yearsActive = new Date().getFullYear() - ABOUT.foundedYear;

  return (
    <section id="causa" aria-labelledby="causa-title" className="py-20 lg:py-28">
      <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            id="causa-title"
            eyebrow="Nossa causa"
            title={`Há ${yearsActive} anos cuidando de quem mais precisa`}
            align="left"
          />
          <div className="mt-6 space-y-4 text-lg text-pretty text-slate-600">
            {ABOUT.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <ul className="grid gap-4 self-center">
          {PILLARS.map(({ title, description, icon: Icon }) => (
            <li
              key={title}
              className="flex gap-4 rounded-3xl border border-slate-200 p-6 transition-shadow hover:shadow-lg"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <Icon aria-hidden className="size-6" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-ink">{title}</h3>
                <p className="mt-1 text-slate-600">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

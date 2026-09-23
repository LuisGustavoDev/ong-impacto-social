import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FUND_ALLOCATION, METRICS } from "@/data/content";
import { cn } from "@/lib/cn";

const allocationSummary = FUND_ALLOCATION.map((item) => `${item.label}: ${item.percent}%`).join(
  ", ",
);

export function MetricsSection() {
  return (
    <section id="impacto" aria-labelledby="impacto-title" className="bg-surface py-20 lg:py-28">
      <Container>
        <SectionHeading
          id="impacto-title"
          eyebrow="Nosso impacto"
          title="Resultados que você pode acompanhar"
          description="Transparência é um compromisso: prestamos contas de cada real recebido."
        />

        {/* <dl>: cada número (dd) fica associado à sua descrição (dt) para leitores de tela. */}
        <dl className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {METRICS.map((metric) => (
            <div
              key={metric.label}
              className="flex flex-col-reverse rounded-3xl bg-white p-6 text-center shadow-sm"
            >
              <dt className="mt-2 text-sm text-slate-600">{metric.label}</dt>
              <dd className="text-3xl font-bold text-brand-600 sm:text-4xl">{metric.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <h3 className="text-lg font-bold text-ink">Para onde vai cada R$ 100 doados</h3>

          {/* A barra é só visual; o texto alternativo e a legenda trazem os mesmos dados. */}
          <div
            role="img"
            aria-label={`Distribuição dos recursos: ${allocationSummary}.`}
            className="mt-5 flex h-4 overflow-hidden rounded-full"
          >
            {FUND_ALLOCATION.map((item) => (
              <div
                key={item.label}
                className={item.colorClass}
                style={{ width: `${item.percent}%` }}
              />
            ))}
          </div>

          <ul aria-hidden className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {FUND_ALLOCATION.map((item) => (
              <li key={item.label} className="flex items-center gap-2">
                <span className={cn("size-3 rounded-full", item.colorClass)} />
                <span className="font-semibold text-ink">R$ {item.percent}</span>
                <span className="text-slate-600">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

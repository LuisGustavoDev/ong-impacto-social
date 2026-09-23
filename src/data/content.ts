import { GraduationCap, ShieldCheck, Stethoscope } from "lucide-react";

import type { FaqItem, FundAllocation, Metric, Pillar, Story } from "@/types/content";

/**
 * Conteúdo institucional da home. Todos os números, nomes e depoimentos
 * são FICTÍCIOS, assim como a própria ONG.
 */

export const ABOUT = {
  foundedYear: 2011,
  paragraphs: [
    "A Juntos pelo Amanhã nasceu em 2011, quando um grupo de professores e profissionais de saúde da periferia de São Paulo decidiu agir diante de uma realidade que não podia esperar: crianças fora da escola, sem acompanhamento médico e expostas à violência.",
    "Hoje atuamos em comunidades de cinco estados, sempre ao lado das famílias e das lideranças locais. Acreditamos que nenhuma criança deve ter seu futuro definido pelo CEP onde nasceu.",
  ],
} as const;

export const PILLARS: readonly Pillar[] = [
  {
    title: "Educação",
    description:
      "Reforço escolar, material didático e bibliotecas comunitárias para que nenhuma criança fique para trás.",
    icon: GraduationCap,
  },
  {
    title: "Saúde",
    description:
      "Consultas, vacinação e acompanhamento nutricional em parceria com equipes de saúde da família.",
    icon: Stethoscope,
  },
  {
    title: "Proteção",
    description:
      "Rede de apoio psicossocial e orientação às famílias para prevenir violência e trabalho infantil.",
    icon: ShieldCheck,
  },
];

export const METRICS: readonly Metric[] = [
  { value: "12 mil+", label: "crianças atendidas desde 2011" },
  { value: "38", label: "comunidades em 5 estados" },
  { value: "85 mil", label: "refeições servidas em 2025" },
  { value: "1.200", label: "doadores mensais" },
];

export const FUND_ALLOCATION: readonly FundAllocation[] = [
  { label: "Programas sociais", percent: 87, colorClass: "bg-brand-500" },
  { label: "Gestão e administração", percent: 9, colorClass: "bg-accent-500" },
  { label: "Captação de recursos", percent: 4, colorClass: "bg-slate-400" },
];

export const STORIES: readonly Story[] = [
  {
    quote:
      "Com o reforço escolar, meu filho voltou a gostar de estudar. Hoje ele sonha em ser engenheiro.",
    name: "Márcia S.",
    role: "Mãe atendida em Recife (PE)",
  },
  {
    quote:
      "Fui aluna do projeto aos 9 anos. Hoje sou educadora e volto toda semana para retribuir.",
    name: "Juliana R.",
    role: "Ex-aluna e voluntária",
  },
  {
    quote:
      "Doo todo mês porque recebo os relatórios e vejo exatamente onde o dinheiro chega.",
    name: "Carlos M.",
    role: "Doador mensal desde 2019",
  },
];

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Minha doação é segura?",
    answer:
      "Sim. Os pagamentos são processados por parceiros certificados e não armazenamos o número completo do seu cartão. Neste site de demonstração, nenhuma cobrança real é feita.",
  },
  {
    question: "Posso cancelar a doação mensal quando quiser?",
    answer:
      "Pode. Basta responder ao e-mail de confirmação ou falar com a nossa equipe. Não há multa nem prazo mínimo.",
  },
  {
    question: "Por que vocês pedem o meu CPF?",
    answer:
      "O CPF é usado para emitir o recibo da doação, que pode ser usado na sua declaração de Imposto de Renda, e para cumprir as regras de prevenção à lavagem de dinheiro.",
  },
  {
    question: "Como sei que o dinheiro chega às crianças?",
    answer:
      "Publicamos um relatório anual auditado, com a destinação de cada real. Hoje, 87% dos recursos vão direto para os programas sociais.",
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "Pix e cartão de crédito. No Pix, a doação é confirmada na hora; no cartão, a cobrança mensal é automática.",
  },
];

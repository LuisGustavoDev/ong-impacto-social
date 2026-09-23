# Juntos pelo Amanhã 💚

Página institucional e fluxo de doação para a **Juntos pelo Amanhã**, uma ONG fictícia dedicada a garantir educação, saúde e proteção para crianças em situação de vulnerabilidade.

Projeto desenvolvido como desafio técnico para a vaga de **Desenvolvedor Web Full Stack Júnior**.

🔗 **Deploy:** _em breve_ · 📄 **Pesquisa de referência (UX/UI):** benchmark de sites de ONGs (MSF, UNICEF, WWF, Greenpeace e ActionAid) que embasou as decisões de interface

---

## 📌 Status do projeto

Desenvolvimento incremental, uma etapa por branch e Pull Request:

- [x] **Etapa 1:** estrutura de pastas (App Router) e tipagem do domínio de doação
- [x] **Etapa 2:** estado global com Context API + `useReducer`
- [x] **Etapa 3:** Navbar responsiva, Footer institucional e tokens de design
- [ ] **Etapa 4:** Hero com CTA e widget interativo de doação
- [ ] **Etapa 5:** seções de conteúdo (Nossa causa, Nosso impacto, Como sua doação ajuda)
- [ ] **Etapa 6:** modal de checkout simulado (dados do doador + Pix/Cartão)
- [ ] **Etapa 7:** página de agradecimento (`/obrigado`) com resumo da doação
- [ ] **Etapa 8:** revisão de responsividade, acessibilidade e deploy final

---

## 🛠️ Stack

| Tecnologia | Uso |
|---|---|
| [Next.js 16](https://nextjs.org) (App Router) | Framework, roteamento e renderização no servidor |
| [React 19](https://react.dev) + React Compiler | Interface e memoização automática |
| [TypeScript](https://www.typescriptlang.org) (strict) | Tipagem estática |
| [Tailwind CSS v4](https://tailwindcss.com) | Estilização, com tokens de design via `@theme` |
| [Lucide React](https://lucide.dev) | Ícones |
| `next/font` | Fonte Plus Jakarta Sans otimizada e servida pelo próprio domínio |
| [Vercel](https://vercel.com) | Deploy contínuo a cada push na `main` e preview por Pull Request |

---

## 🚀 Como rodar localmente

**Pré-requisitos:** Node.js 20.9 ou superior e npm.

```bash
# 1. Clonar o repositório
git clone https://github.com/LuisGustavoDev/ong-impacto-social.git
cd ong-impacto-social

# 2. Instalar as dependências
npm install

# 3. Rodar em modo de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Executa o build de produção |
| `npm run lint` | Análise estática com ESLint |

---

## 📁 Estrutura de pastas

```
src/
├── app/                    # Rotas (App Router)
│   ├── layout.tsx          # Layout raiz: fonte, metadata, Provider, Navbar e Footer
│   ├── page.tsx            # Home (apenas compõe as seções)
│   ├── globals.css         # Tailwind + tokens de design (@theme)
│   └── obrigado/           # Rota /obrigado (em desenvolvimento)
├── components/
│   ├── layout/             # Navbar, MobileMenu, Footer, Logo, SocialIcon
│   ├── sections/           # Seções da home (Hero, Causa, Impacto...)
│   ├── donation/           # Widget e CTAs de doação (DonateButton)
│   ├── checkout/           # Modal de checkout e suas etapas
│   └── ui/                 # Componentes genéricos (Container, estilos de botão)
├── context/
│   └── DonationContext.tsx # Estado global do fluxo de doação
├── data/                   # Conteúdo e constantes (textos, links, valores, impacto)
├── lib/                    # Funções utilitárias (formatação, storage, classes)
└── types/                  # Tipos TypeScript do domínio
```

**Princípios da organização:**

- **Conteúdo separado da apresentação:** textos, links e valores ficam em `src/data/`. Os componentes só recebem os dados e os exibem.
- **`sections/` × `ui/`:** as seções são blocos únicos da página, e os componentes de `ui/` são genéricos e reutilizáveis.
- **Server Components por padrão:** só os componentes com interação (widget, menu mobile, modal, CTAs) usam `"use client"`.

---

## 🧠 Decisões técnicas

### Estado global com Context API + `useReducer`
Os dados da doação passam por componentes que não têm relação de pai e filho: o widget do Hero, o modal de checkout e a página `/obrigado`. O `useReducer` concentra todas as transições do fluxo numa única função pura (escolher valor → abrir checkout → processar → concluir). Regras como "não fechar o modal durante o processamento do pagamento" ficam num só lugar. Uma biblioteca externa (Redux, Zustand) seria desproporcional para um estado desse tamanho.

### Valores monetários em centavos
Todos os valores são armazenados como inteiros em centavos (`10000` = R$ 100,00), para evitar erros de ponto flutuante (`0.1 + 0.2 !== 0.3`). A conversão para `R$ 100,00` acontece apenas na exibição, com `Intl.NumberFormat`.

### Tipos que impedem estados inválidos
`PaymentDetails` é uma **união discriminada**: o TypeScript só permite `cardLastDigits` quando o método é cartão. O número completo do cartão nunca é armazenado, nem na simulação.

### Persistência da confirmação
Ao concluir a doação, o resumo é salvo no `sessionStorage`. Assim, a página `/obrigado` continua funcionando se o usuário recarregar a página. O `sessionStorage` (e não o `localStorage`) foi escolhido porque o dado deve ser descartado quando a aba é fechada.

### Fonte única para os valores de impacto
As equivalências ("R$ 50 garante alimentação por 1 semana") ficam em `src/data/donation.ts` e são lidas tanto pelo widget quanto pela seção "Como sua doação ajuda", o que evita mensagens contraditórias entre as seções.

---

## 🎨 Decisões de UX/UI

Baseadas na pesquisa de benchmark realizada antes do desenvolvimento:

- **Doação já na primeira tela:** widget de doação integrado ao Hero, com opção de doação única ou mensal (referência: MSF Brasil).
- **Valores sugeridos com ancoragem:** botões de R$ 50, R$ 100 e R$ 150, com R$ 100 pré-selecionado, e campo para outro valor.
- **Valor conectado ao impacto:** cada valor mostra o que ele representa na prática.
- **Checkout curto e em etapas:** solicita apenas nome, e-mail e CPF, com barra de progresso (referência: UNICEF).
- **Pix em destaque** no pagamento simulado (referência: Greenpeace).
- **Credibilidade:** CNPJ e links legais no rodapé.
- **Navegação honesta:** todo link do menu leva a uma seção existente. O ícone de busca do layout original foi removido porque a página não tem conteúdo pesquisável.
- **Paleta:** um fundo neutro, um verde institucional e um amarelo de alto contraste reservado para os CTAs de doação.

---

## ♿ Acessibilidade

- Link "Pular para o conteúdo", visível ao navegar pelo teclado
- Menu mobile com `aria-expanded`, `aria-controls` e fechamento pela tecla Esc
- Ícones decorativos com `aria-hidden`; botões só com ícone recebem `aria-label`
- Rolagem suave desativada para quem usa `prefers-reduced-motion`
- HTML semântico (`header`, `nav`, `main`, `footer`) e `lang="pt-BR"`

---

## 📱 Responsividade

Abordagem **mobile-first**, testada de 320px a 1440px:

| Faixa | Largura | Comportamento da navegação |
|---|---|---|
| Celular | 0 – 639px | Logo + menu hambúrguer (CTA dentro do menu) |
| Tablet | 640 – 1023px | Logo + CTA "Doe agora" + menu hambúrguer |
| Desktop | a partir de 1024px | Menu horizontal completo + CTA |

---

## 🔀 Fluxo de trabalho

- Uma branch por funcionalidade (`feat/navbar-footer`, `feat/hero-widget`...)
- Pull Request para a `main`, com preview automático da Vercel
- Commits no padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/) (`feat:`, `fix:`, `chore:`, `docs:`)
- Deploy de produção automático a cada merge na `main`

---

## ⚠️ Aviso

A "Juntos pelo Amanhã" é uma organização **fictícia**. Nenhum pagamento real é processado: o checkout é apenas uma simulação da experiência do usuário. O CNPJ exibido também é fictício.

---

## 👤 Autor

**Luis Gustavo**: [GitHub](https://github.com/LuisGustavoDev)

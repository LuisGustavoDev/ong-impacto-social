# Juntos pelo Amanhã 💚

Landing page institucional e fluxo completo de doação para a **Juntos pelo Amanhã**, uma ONG fictícia dedicada a garantir educação, saúde e proteção para crianças em situação de vulnerabilidade.

Projeto desenvolvido como desafio técnico para a vaga de **Desenvolvedor Web Full Stack Júnior**.

🔗 **Deploy:** _adicione aqui a URL da Vercel_ · 📄 **Pesquisa de referência (UX/UI):** benchmark de sites de ONGs (MSF, UNICEF, WWF, Greenpeace e ActionAid) que embasou as decisões de interface

---

## 📌 O que foi entregue

| Requisito | Onde está |
|---|---|
| Landing page responsiva com seções institucionais | `src/app/page.tsx` + `src/components/sections/` |
| Doação logo na primeira dobra (única ou mensal, valores sugeridos e livre) | `HeroSection` + `DonationWidget` |
| Valores conectados ao impacto real | `ImpactSection` (fonte única: `IMPACT_TIERS`) |
| Indicadores de transparência | `MetricsSection` |
| Perguntas frequentes | `FaqSection` (accordion acessível) |
| Checkout em 3 etapas: valor → dados do doador → pagamento | `src/components/checkout/` |
| Pagamento simulado via **Pix** (QR Code + Copia e Cola) ou **cartão** | `PaymentStep` |
| Página de agradecimento com recibo, resistente a F5 | `src/app/obrigado/` |
| Acessibilidade (WCAG 2.1 AA) e navegação por teclado | ver seção [Acessibilidade](#-acessibilidade) |

### Fluxo do usuário

```
Hero / card de impacto / "Doe agora"
        │  (valor e frequência vão para o Context)
        ▼
┌───────────── Modal de checkout ─────────────┐
│ 1. Valor  →  2. Seus dados  →  3. Pagamento │
└─────────────────────────────────────────────┘
        │  submitDonation(): processa (1,5 s), gera protocolo JPA-2026-XXXXX
        │  e salva o resumo no sessionStorage
        ▼
/obrigado: recibo, código Pix, compartilhar, voltar ao início
```

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

Nenhuma biblioteca de estado, formulário, modal ou validação: tudo foi resolvido com recursos nativos do React e da plataforma web.

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
| `npm run build` | Build de produção (inclui checagem de tipos) |
| `npm run start` | Executa o build de produção |
| `npm run lint` | Análise estática com ESLint |

### Dados para testar o checkout

Todos os campos são validados de verdade (dígitos do CPF, algoritmo de Luhn no cartão), então use dados de teste:

| Campo | Valor de teste |
|---|---|
| CPF | `529.982.247-25` |
| Cartão | `4111 1111 1111 1111` |
| Validade | qualquer data futura, ex.: `12/30` |
| CVV | `123` |

---

## 📁 Estrutura de pastas

```
src/
├── app/                        # Rotas (App Router)
│   ├── layout.tsx              # Layout raiz: fonte, metadata, Provider, Navbar, Footer e CheckoutModal
│   ├── page.tsx                # Home (apenas compõe as seções)
│   ├── globals.css             # Tailwind + tokens de design (@theme)
│   └── obrigado/page.tsx       # Rota /obrigado (metadata noindex + conteúdo client)
├── components/
│   ├── layout/                 # Navbar, MobileMenu, Footer, Logo, SocialIcon
│   ├── sections/               # Hero, Nossa causa, Impacto, Como ajudar, Histórias, FAQ
│   ├── donation/               # AmountPicker (compartilhado), DonationWidget, DonateButton
│   ├── checkout/               # CheckoutModal, etapas, indicador de progresso, QR Code
│   ├── thank-you/              # Recibo e botão de compartilhar
│   └── ui/                     # Genéricos: Container, SectionHeading, FormField, CopyButton
├── context/
│   └── DonationContext.tsx     # Estado global do fluxo de doação (useReducer)
├── data/                       # Conteúdo e constantes (textos, links, valores, impacto)
├── lib/                        # Utilitários puros: formatação, validação, Pix, storage
└── types/                      # Tipos TypeScript do domínio
```

**Princípios da organização:**

- **Conteúdo separado da apresentação:** textos, métricas, depoimentos e perguntas ficam em `src/data/`. Os componentes só recebem os dados e os exibem.
- **Lógica de negócio fora dos componentes:** validação de CPF/cartão, máscaras e geração do Pix são funções puras em `src/lib/`, fáceis de testar isoladamente.
- **Server Components por padrão:** só os componentes com interação (widget, menu mobile, modal, accordion, CTAs) usam `"use client"`. As seções são renderizadas no servidor e apenas as "ilhas" interativas vão para o bundle do cliente.

---

## 🧠 Decisões de engenharia

### Valores monetários em centavos inteiros
Todos os valores são armazenados como inteiros em centavos (`10000` = R$ 100,00), com o tipo semântico `Cents`, para evitar erros de ponto flutuante (`0.1 + 0.2 !== 0.3`). A conversão para `R$ 100,00` acontece só na exibição, com um `Intl.NumberFormat` criado uma única vez no módulo.

### Tipos que impedem estados inválidos (uniões discriminadas)
`PaymentDetails` é discriminado pelo campo `method`: o TypeScript só permite acessar `cardLastDigits` quando o método é cartão. As ações do reducer seguem o mesmo padrão (discriminadas por `type`), então um `switch` sem um dos casos não compila.

### Estado global com Context API + `useReducer`, sem bibliotecas
Os dados da doação passam por componentes sem relação de pai e filho: widget do Hero, cards de impacto, modal e página `/obrigado`. O `useReducer` concentra todas as transições numa função pura (escolher valor → abrir checkout → processar → concluir). Regras como "não fechar o modal durante o processamento" ficam num só lugar. Redux ou Zustand seriam desproporcionais para um estado desse tamanho. Com o **React Compiler** ativo, não é preciso espalhar `useMemo`/`useCallback` manualmente.

### Resiliência ao F5 com `sessionStorage`
O Context vive na memória e é zerado ao recarregar. Por isso, ao concluir a doação, o resumo é salvo no `sessionStorage`, e a página `/obrigado` usa o Context como fonte principal e o storage como reserva. A leitura usa `useSyncExternalStore`, que devolve `undefined` no servidor e o valor real no cliente, **sem erro de hidratação** e sem `setState` dentro de `useEffect`. Sem dados (acesso direto à URL), a página redireciona para a home. O `sessionStorage` (e não o `localStorage`) foi escolhido porque o dado deve ser descartado ao fechar a aba.

### Modal com `<dialog>` nativo
O checkout usa `<dialog>` com `showModal()`, que já entrega, sem bibliotecas: foco preso no modal (o resto da página fica inerte), fechamento com Esc, `::backdrop` e semântica de diálogo modal. Por cima disso, o componente:
- bloqueia Esc, clique fora e botão fechar enquanto `status === "processing"` (a regra está no reducer);
- move o foco para o título de cada etapa, para o leitor de tela anunciar a mudança;
- devolve o foco ao botão que abriu o modal ao fechar;
- trava a rolagem da página via CSS (`body:has(dialog[open])`), sem JavaScript.

### Dados sensíveis nunca saem do formulário
Número, validade e CVV do cartão vivem só no estado local da etapa de pagamento. Para o Context e para o storage vão apenas os **4 últimos dígitos**.

### Validações reais, não só "campo preenchido"
- **CPF:** cálculo dos dois dígitos verificadores e rejeição de sequências repetidas (`111.111.111-11`).
- **Cartão:** algoritmo de Luhn, validade `MM/AA` não vencida e CVV com 3 ou 4 dígitos.
- Erros aparecem no blur (só se algo foi digitado) e no envio. O foco vai para o primeiro campo inválido, e a mensagem some assim que o campo é corrigido.

### Pix Copia e Cola no padrão do Banco Central
O código Pix segue o formato EMV (BR Code) com checksum **CRC16-CCITT**, gerado a partir do valor. A chave é fictícia, então nenhum pagamento real é possível. O QR Code é **simulado**: um desenho determinístico com os padrões de posição, porque gerar um QR escaneável exigiria um encoder Reed-Solomon ou uma dependência extra, o que não se justifica numa simulação.

### Fonte única para o impacto
As equivalências ("R$ 50 garante alimentação por 1 semana") ficam em `IMPACT_TIERS` e são lidas pelo widget, pelos cards de impacto e pelo recibo. As mensagens nunca ficam contraditórias entre as seções.

### Tailwind CSS v4 sem runtime JS
Os tokens da marca (`brand-*`, `accent-*`, `ink`, `surface`) são definidos em CSS com `@theme` e geram utilitários em build time. Não há CSS-in-JS nem arquivo de configuração JS, e nenhum custo de estilização em tempo de execução. Estados visuais usam variantes nativas como `has-checked:` e `has-focus-visible:`, sem JavaScript.

---

## 🎨 Decisões de UX/UI

Baseadas na pesquisa de benchmark realizada antes do desenvolvimento:

- **Doação já na primeira tela:** widget integrado ao Hero, com doação única ou mensal (referência: MSF Brasil).
- **Valores sugeridos com ancoragem:** R$ 50, R$ 100 e R$ 150, com R$ 100 pré-selecionado, e campo para outro valor (mínimo de R$ 10).
- **Valor conectado ao impacto:** o widget mostra, em tempo real, o que aquele valor representa na prática.
- **Checkout curto e em etapas:** só nome, e-mail e CPF, com indicador de progresso (referência: UNICEF). Quem vem do Hero ou de um card de impacto já começa na etapa 2.
- **Pix em destaque** e pré-selecionado no pagamento (referência: Greenpeace).
- **Dados preservados:** fechar e reabrir o checkout não obriga a redigitar os dados do doador.
- **Credibilidade:** destinação dos recursos, relatório auditado, CNPJ e links legais.
- **Navegação honesta:** todo link do menu leva a uma seção existente.
- **Paleta:** fundo neutro, verde institucional e amarelo de alto contraste reservado para os CTAs de doação.

---

## ♿ Acessibilidade

Objetivo: **WCAG 2.1 nível AA**.

- **Teclado:** todo o fluxo (escolher valor, preencher dados, pagar) funciona sem mouse. As opções de valor, frequência e forma de pagamento são `input type="radio"` nativos estilizados, então as setas do teclado funcionam como esperado.
- **Modal:** foco preso, Esc para fechar, foco no título da etapa atual e retorno do foco ao fechar.
- **Formulários:** todo campo tem `<label>`. Erros ficam ligados por `aria-describedby`, os campos inválidos recebem `aria-invalid` e o erro é sempre texto, nunca só cor (WCAG 1.4.1). Os campos têm `autocomplete` (`name`, `email`, `cc-number`, `cc-exp`...).
- **Feedback dinâmico:** `aria-live`/`role="status"` anunciam o impacto do valor escolhido, o processamento do pagamento e a confirmação de "copiado".
- **FAQ:** accordion no padrão WAI-ARIA (`button` com `aria-expanded` + `aria-controls`, painel com `role="region"`).
- **Progresso:** `aria-current="step"` na etapa atual do checkout.
- **Dados visuais:** a barra de destinação de recursos tem texto alternativo com os mesmos números.
- **Movimento:** rolagem suave e animações desativadas com `prefers-reduced-motion`.
- **Estrutura:** link "Pular para o conteúdo", HTML semântico (`header`, `nav`, `main`, `section` com `aria-labelledby`, `footer`), hierarquia de títulos consistente e `lang="pt-BR"`.

---

## 📱 Responsividade

Abordagem **mobile-first**, testada de 320px a 1440px:

| Faixa | Largura | Comportamento |
|---|---|---|
| Celular | 0 – 639px | Menu hambúrguer (CTA dentro do menu), seções em uma coluna |
| Tablet | 640 – 1023px | CTA "Doe agora" visível no header, grids de 2 colunas |
| Desktop | a partir de 1024px | Menu horizontal completo, Hero em duas colunas com o widget ao lado |

O modal ocupa quase toda a tela no celular e rola internamente quando o conteúdo não cabe.

---

## ☁️ Deploy na Vercel

1. Suba o código para o GitHub (branch `main`).
2. Acesse [vercel.com/new](https://vercel.com/new) e entre com a sua conta do GitHub.
3. Em **Import Git Repository**, selecione `ong-impacto-social` e clique em **Import**.
4. A Vercel detecta o Next.js sozinha. Mantenha os padrões:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next` (automático)
   - **Environment Variables:** nenhuma é necessária
5. Clique em **Deploy**. Em cerca de 1 minuto a URL de produção (`*.vercel.app`) fica disponível.
6. Atualize o link de **Deploy** no topo deste README.

A partir daí, cada push na `main` gera um deploy de produção, e cada Pull Request ganha uma URL de preview própria.

> Dica: antes de publicar, rode `npm run lint && npm run build` localmente. É o mesmo build que a Vercel executa.

---

## 🔀 Fluxo de trabalho

- Uma branch por funcionalidade (`feat/navbar-footer`, `feat/secoes-checkout-obrigado`...)
- Pull Request para a `main`, com preview automático da Vercel
- Commits no padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/) (`feat:`, `fix:`, `chore:`, `docs:`)
- Deploy de produção automático a cada merge na `main`

---

## 🔭 Próximos passos

Para uma versão real, os próximos passos seriam:

- Testes unitários das funções puras de `src/lib/` (Vitest) e um teste E2E do fluxo de doação (Playwright)
- Integração com um gateway de pagamento real (tokenização do cartão no front, sem o número completo passar pelo servidor)
- Envio do recibo por e-mail a partir de uma API Route
- Auditoria automatizada de acessibilidade com axe no CI

---

## ⚠️ Aviso

A "Juntos pelo Amanhã" é uma organização **fictícia**. Nenhum pagamento real é processado: o checkout é apenas uma simulação da experiência do usuário. CNPJ, chave Pix, números e depoimentos também são fictícios.

---

## 👤 Autor

**Luis Gustavo**: [GitHub](https://github.com/LuisGustavoDev)

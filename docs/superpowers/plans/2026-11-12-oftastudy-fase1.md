# OftaStudy Fase 1 — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar a Fase 1 do OftaStudy: projeto estruturado, identidade visual, login, banco Supabase com RLS e dashboard funcional, rodando localmente e pronto para publicar.

**Architecture:** Next.js App Router (servidor lê dados via Supabase com a sessão do usuário; RLS garante o acesso). Cálculos do dashboard são funções puras em `src/lib/metrics`, testadas isoladamente. Layout com menu lateral (desktop) / barra inferior (celular).

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Recharts, Supabase (`@supabase/ssr`, `@supabase/supabase-js`), Vitest, Playwright (canal `msedge`).

**Spec:** `docs/superpowers/specs/2026-11-12-oftastudy-fase1-design.md`

## Global Constraints

- Somente serviços gratuitos; nada pago sem autorização.
- Interface em português do Brasil; datas DD/MM/AAAA; números no formato brasileiro (1.234,56).
- Fuso de datas: `America/Sao_Paulo`.
- Meta do cronograma padrão: `2027-12-31`. Prova CBO: 2029, guardada como mês/ano (opcional).
- Um único usuário; cadastro público desativado; sem papéis de acesso.
- Chave de serviço do Supabase nunca no navegador nem no Git; só `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` são públicas.
- RLS ativa em todas as tabelas, com `user_id = auth.uid()`.
- Paleta: azul-marinho, branco, azul-claro, verde-água (positivo), cinza-claro (fundos). Cores de atividade: azul=aula, verde=questões, amarelo=revisão, roxo=simulado, cinza=descanso. Só modo claro.
- Menu (nessa ordem): Início, Videoaulas, Banco de questões, Simulados, Cronograma, Calendário, Revisões, Flashcards, Desempenho, Perfil.
- Itens de fases futuras mostram "Disponível na Fase X"; nenhuma função falsa. Dados de demonstração só na tela, rotulados "DEMONSTRAÇÃO", nunca gravados.
- Especialidades iniciais (14): Anatomia e fisiologia ocular; Catarata; Glaucoma; Retina; Córnea; Uveítes; Neuro-oftalmologia; Estrabismo; Oftalmopediatria; Órbita e plástica ocular; Lentes de contato e refração; Emergências oftalmológicas; Oncologia ocular; Cirurgia refrativa.
- Pasta de trabalho do projeto apenas; comandos em PowerShell 5.1 (sem `&&`).

## Review Focus

1. Dashboard com banco vazio (0 questões): % de acertos mostra "—", nunca `NaN`/divisão por zero.
2. Meta já passada ou data de início depois de hoje: dias restantes não ficam negativos nem quebram a barra de progresso.
3. "Meu dia" perto da meia-noite: usa a data de São Paulo, não UTC.
4. Acesso sem login a qualquer rota interna ou sessão expirada: redireciona para o login, sem erro em branco.
5. Modo demonstração: nada é gravado no banco e o rótulo está sempre visível; ao sair, os números reais voltam.

---

## Estrutura de arquivos

- `src/app/(public)/page.tsx` página inicial; `src/app/(public)/login/page.tsx` login
- `src/app/(app)/layout.tsx` casca com menu; `(app)/page.tsx` dashboard; `(app)/perfil/page.tsx`; `(app)/[secao]/page.tsx` placeholders de fases futuras
- `src/components/` `sidebar.tsx`, `bottom-nav.tsx`, `logo.tsx`, `dashboard/*`
- `src/lib/supabase/{client,server,middleware}.ts`
- `src/lib/metrics/{accuracy,schedule,hours,specialty}.ts` (funções puras) e `src/lib/dashboard-data.ts` (consultas)
- `src/lib/nav.ts` itens do menu e fase de cada um
- `src/middleware.ts` proteção de rotas
- `supabase/migrations/0001_init.sql`, `0002_seed_specialties.sql`
- `tests/unit/*`, `tests/rls/*`, `tests/e2e/*`
- `Abrir OftaStudy.bat`, `LEIA-ME.md`, `docs/contas.md`

---

### Task 1: Esqueleto do projeto

**Files:** Create: projeto Next.js na raiz, `.gitignore`, `.env.example`, `vitest.config.ts`, `playwright.config.ts`, `Abrir OftaStudy.bat`

**Interfaces:** Produces: scripts npm `dev`, `build`, `test` (Vitest), `test:e2e` (Playwright).

- [ ] **Step 1:** `git init`; criar Next.js (TypeScript, Tailwind, App Router, `src/`, alias `@/*`) na pasta atual sem sobrescrever `docs/`; instalar shadcn/ui (button, card, input, label, progress), `recharts`, `@supabase/ssr`, `@supabase/supabase-js`, `vitest`, `@playwright/test`.
- [ ] **Step 2:** `.gitignore` inclui `.env*.local`, `node_modules`, `.next`; `.env.example` lista `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` sem valores.
- [ ] **Step 3:** `playwright.config.ts` usa `channel: "msedge"`, `webServer: npm run dev`, dois projetos (desktop 1280px, celular 390px).
- [ ] **Step 4:** `Abrir OftaStudy.bat` inicia `npm run dev` e abre `http://localhost:3000` no navegador.
- [ ] **Step 5:** Verificar: `npm run build` conclui; `npm test` roda (0 testes aceitável). Commit `chore: esqueleto do projeto`.

### Task 2: Identidade visual e casca do app

**Files:** Create: `src/components/{logo,sidebar,bottom-nav}.tsx`, `src/lib/nav.ts`, `src/app/(app)/layout.tsx`, `src/app/(app)/[secao]/page.tsx`; Modify: `src/app/globals.css` (tokens de cor), Test: `tests/unit/nav.test.ts`

**Interfaces:** Produces: `NAV_ITEMS: { slug: string; label: string; href: string; fase: number | null }[]` (10 itens na ordem do Global Constraints; `fase` null para Início e Perfil).

- [ ] **Step 1:** Teste `nav.test.ts`: `NAV_ITEMS` tem 10 itens, primeiro "Início", último "Perfil", e "Simulados" tem `fase === 6`. Rodar → falha.
- [ ] **Step 2:** Implementar `nav.ts` (fases: Videoaulas 2, Banco de questões 3, Cronograma 4, Calendário 4, Revisões 5, Flashcards 5, Simulados 6, Desempenho 6). Rodar → passa.
- [ ] **Step 3:** Tokens de cor em `globals.css` (navy, azul-claro, verde-água, cinza-claro e as 5 cores de atividade); `Logo` em SVG (olho + "OftaStudy").
- [ ] **Step 4:** `Sidebar` (≥1024px, azul-marinho, item ativo destacado) e `BottomNav` (<1024px, 5 itens principais + "Mais" abrindo lista completa); layout `(app)` usa ambos.
- [ ] **Step 5:** `[secao]/page.tsx` mostra "Disponível na Fase X" lendo `NAV_ITEMS`; slug desconhecido → `notFound()`.
- [ ] **Step 6:** Verificar `npm test` e `npm run dev` visualmente em 1280px e 390px. Commit.

### Task 3: Banco de dados Supabase e segurança

**Files:** Create: `supabase/migrations/0001_init.sql`, `0002_seed_specialties.sql`, `docs/contas.md`, `tests/rls/rls.test.ts`

**Interfaces:** Produces tabelas (todas com `user_id uuid references auth.users` e RLS "dono"): `profiles(id=user_id, nome, meta_cronograma date default '2027-12-31', prova_mes int, prova_ano int, horas_diarias numeric)`, `specialties(id, nome unique, ordem)`, `subjects(id, specialty_id, nome)`, `lessons(id, specialty_id, subject_id, titulo, descricao, duracao_seg, source_type, source_ref)`, `lesson_progress(lesson_id, user_id, posicao_seg, concluida, ultimo_acesso)`, `questions`, `question_options`, `question_attempts(id, question_id, correta bool, respondida_em)`, `study_sessions(id, user_id, inicio, duracao_seg, tipo)`.

- [ ] **Step 1 (usuário, guiado):** escrever `docs/contas.md` com passo a passo da conta Supabase (criar projeto, copiar URL e anon key, **desativar "Allow new users to sign up"**, criar o usuário em Authentication → Users). Pedir ao usuário que faça e informe as chaves por `.env.local` (eu nunca peço a chave de serviço sem necessidade).
- [ ] **Step 2:** Escrever `0001_init.sql` com as tabelas acima, `specialties` e `subjects` também com `user_id` e RLS, e função/trigger que cria `profiles` ao criar o usuário.
- [ ] **Step 3:** `0002_seed_specialties.sql` insere as 14 especialidades do Global Constraints (inserção por usuário via função `seed_specialties(uid)` chamada no trigger).
- [ ] **Step 4:** Teste RLS (`rls.test.ts`, precisa de 2 usuários de teste no projeto Supabase): usuário B não consegue ler nem alterar linhas de `lesson_progress` e `question_attempts` do usuário A; anônimo não lê nada. Rodar após aplicar migrações → passa.
- [ ] **Step 5:** Aplicar migrações (SQL Editor do Supabase, instruções no `docs/contas.md`). Commit.

### Task 4: Login, proteção de rotas e página inicial

**Files:** Create: `src/lib/supabase/{client,server,middleware}.ts`, `src/middleware.ts`, `src/app/(public)/page.tsx`, `src/app/(public)/login/page.tsx`, `src/app/auth/signout/route.ts`, Test: `tests/e2e/auth.spec.ts`

**Interfaces:** Produces: `createClient()` (browser) e `createClient()` assíncrono (server) retornando cliente Supabase; middleware redireciona não logados de qualquer rota de `(app)` para `/login` e logados de `/login` para `/`.

- [ ] **Step 1:** Teste e2e: acessar `/` sem login → termina em `/login`; `/videoaulas` sem login → `/login`; login com senha errada mostra "E-mail ou senha incorretos"; login correto (usuário de teste via variáveis `E2E_EMAIL`/`E2E_SENHA`) → dashboard; "Sair" volta ao login. Rodar → falha.
- [ ] **Step 2:** Implementar clientes e middleware com `@supabase/ssr` (renovação de sessão).
- [ ] **Step 3:** Página inicial pública (logo, frase curta, botão "Entrar") e login (e-mail + senha, sem link de cadastro); logout via POST.
- [ ] **Step 4:** Rodar e2e → passa. Commit.

### Task 5: Cálculos do dashboard (lógica pura)

**Files:** Create: `src/lib/metrics/{accuracy,schedule,hours,specialty}.ts`, Test: `tests/unit/metrics.test.ts`

**Interfaces:** Produces:
- `accuracyPercent(correct: number, total: number): number | null` (null se total 0)
- `scheduleProgress(start: Date, goal: Date, today: Date): { pct: number; daysLeft: number }` (pct limitado a 0–100; daysLeft ≥ 0)
- `daysUntilExam(today: Date, mes: number | null, ano: number | null): number | null` (conta até o dia 1 do mês; null se não definido)
- `totalHours(sessions: { duracao_seg: number }[]): number` (horas com 1 casa)
- `accuracyBySpecialty(attempts: { specialty_id: string; correta: boolean }[]): { specialty_id: string; pct: number; total: number }[]`
- `todaySP(now: Date): string` (AAAA-MM-DD em America/Sao_Paulo)

- [ ] **Step 1:** Escrever testes: `accuracyPercent(0,0) === null`, `accuracyPercent(7,10) === 70`; `scheduleProgress` com hoje depois da meta → `{pct:100, daysLeft:0}`, com hoje antes do início → `pct:0`; `daysUntilExam(…, null, null) === null`; `totalHours([{duracao_seg:5400}]) === 1.5`; `todaySP(new Date("2026-11-13T01:30:00Z")) === "2026-11-12"`; `accuracyBySpecialty([])` → `[]`. Rodar → falha.
- [ ] **Step 2:** Implementar funções. Rodar → passa. Commit.

### Task 6: Dashboard com dados reais e modo demonstração

**Files:** Create: `src/lib/dashboard-data.ts`, `src/components/dashboard/{stat-card,specialty-chart,continue-card,my-day,demo-toggle}.tsx`, `src/app/(app)/page.tsx`; Test: `tests/e2e/dashboard.spec.ts`

**Interfaces:** Consumes: Task 4 `createClient()` server; Task 5 funções. Produces: `getDashboardData(): Promise<DashboardData>` (nome, horas, aulasConcluidas, questoesRespondidas, acertoPct, revisoesPendentes (0 até Fase 5), progresso cronograma, diasProva, porEspecialidade, ultimaAula, tarefasHoje).

- [ ] **Step 1:** Teste e2e: com banco vazio, o dashboard mostra saudação com o nome, "—" em acertos, e estados vazios em "Continuar estudando" e "Meu dia"; ativar "Pré-visualizar com exemplos" mostra rótulo DEMONSTRAÇÃO e números preenchidos; recarregar a página volta ao real e a tabela `question_attempts` continua vazia. Rodar → falha.
- [ ] **Step 2:** Implementar `getDashboardData` com consultas via cliente servidor (RLS filtra); "Próximas atividades" e "Meu dia" vazias até Fase 4 com texto "O cronograma chega na Fase 4".
- [ ] **Step 3:** Componentes: 4 cards de números, barra de progresso até 31/12/2027 + contagem para a prova, gráfico de barras por especialidade (Recharts, verde-água para bons), "Continuar estudando" (última `lesson_progress` por `ultimo_acesso`, botão para a aula — desabilitado até a Fase 2), "Meu dia".
- [ ] **Step 4:** `DemoToggle` guarda estado só no cliente (parâmetro `?demo=1`), com faixa fixa DEMONSTRAÇÃO; nenhuma escrita.
- [ ] **Step 5:** Rodar e2e nas duas larguras → passa. Commit.

### Task 7: Perfil

**Files:** Create: `src/app/(app)/perfil/page.tsx`, `src/app/(app)/perfil/actions.ts`; Test: `tests/e2e/perfil.spec.ts`

**Interfaces:** Produces: server action `salvarPerfil(formData)` validando nome não vazio, `horas_diarias` entre 0,5 e 16, mês 1–12 e ano ≥ 2026 (ou ambos vazios).

- [ ] **Step 1:** Teste e2e: salvar nome "Dr. Teste" e prova 2029 → dashboard saúda "Dr. Teste"; horas diárias 30 mostra erro e não salva. Rodar → falha.
- [ ] **Step 2:** Implementar página e action. Rodar → passa. Commit.

### Task 8: Fechamento da Fase 1

**Files:** Create: `LEIA-ME.md`; Modify: `docs/contas.md` (GitHub e Vercel, para depois da aprovação); `C:\Users\morav\Desktop\Projetos Claude\Setup\projetos.md`

- [ ] **Step 1:** Rodar `npm test`, testes RLS, `npm run test:e2e` (desktop + celular) e `npm run build`; todos devem passar. Registrar no relatório final o que não foi testado (ex.: produção na Vercel, pausa do Supabase).
- [ ] **Step 2:** `LEIA-ME.md` em português simples: como abrir (clique duplo no .bat), como entrar, o que existe e o que vem nas fases.
- [ ] **Step 3:** Acrescentar OftaStudy em `Setup\projetos.md`.
- [ ] **Step 4:** Abrir o app e mostrar ao usuário (capturas em 1280px e 390px) para aprovação do design. Commit `docs: fechamento da fase 1`. **Parar:** GitHub/Vercel só após aprovação.

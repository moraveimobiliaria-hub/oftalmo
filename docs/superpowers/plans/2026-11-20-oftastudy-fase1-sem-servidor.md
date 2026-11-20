# OftaStudy Fase 1 (sem servidor) — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (execução inline escolhida pelo usuário) para implementar tarefa a tarefa. Steps usam checkbox (`- [ ]`).

**Goal:** Entregar a Fase 1 como app sem servidor (arquivo único + GitHub Pages): visual, menu, banco local, dashboard, perfil e backup.

**Architecture:** App de página única em Vite + React; dados no IndexedDB (Dexie) acessados por funções em `src/data/`; cálculos puros em `src/lib/metrics` (já existem e são reaproveitados). Rotas por `#`. Build gera um único HTML.

**Tech Stack:** Vite, React, TypeScript, Tailwind CSS, `vite-plugin-singlefile`, `react-router` (HashRouter), Dexie, Recharts, Vitest + `fake-indexeddb`, Playwright (`msedge`).

**Spec:** `docs/superpowers/specs/2026-11-20-oftastudy-sem-servidor-design.md` (revisão) e `docs/superpowers/specs/2026-11-12-oftastudy-fase1-design.md` (visual, telas, menu).

## Global Constraints

- Sem contas, sem servidor, sem login; nada pago. Português do Brasil; datas DD/MM/AAAA; números 1.234,56; fuso `America/Sao_Paulo`.
- Meta do cronograma padrão `2027-12-31`; prova CBO 2029 guardada como mês/ano opcional.
- Paleta: azul-marinho `#0b2545`, azul-claro `#8ecae6`, verde-água `#2ec4b6`, cinza-claro `#f3f6f9`, branco. Atividades: azul=aula, verde=questões, amarelo=revisão, roxo=simulado, cinza=descanso. Só modo claro.
- Menu (ordem): Início, Videoaulas, Banco de questões, Simulados, Cronograma, Calendário, Revisões, Flashcards, Desempenho, Perfil; itens futuros mostram "Disponível na Fase X".
- 14 especialidades iniciais: Anatomia e fisiologia ocular; Catarata; Glaucoma; Retina; Córnea; Uveítes; Neuro-oftalmologia; Estrabismo; Oftalmopediatria; Órbita e plástica ocular; Lentes de contato e refração; Emergências oftalmológicas; Oncologia ocular; Cirurgia refrativa.
- Dados de demonstração só na tela, rotulados DEMONSTRAÇÃO, nunca gravados.
- Aula guarda `fonte: "pasta" | "drive"` e `link` (Fase 2 usa).
- Repositório GitHub será público: nenhum dado pessoal, chave ou questão no código.
- Comandos em PowerShell 5.1; heredocs longos no Bash falham, usar a ferramenta Write.

## Review Focus

1. Banco local vazio: dashboard mostra "—" em acertos, nunca NaN; nada quebra.
2. Restaurar backup inválido ou de versão desconhecida: recusa com mensagem e **não apaga** os dados atuais.
3. Abrir o arquivo único por `file://` (sem servidor): rotas por `#` e estilos funcionam.
4. Navegador sem IndexedDB ou com acesso negado: aviso claro em vez de tela em branco.
5. Modo demonstração: nada é gravado; ao sair, voltam os números reais.

---

## Estrutura de arquivos

- `index.html`, `vite.config.ts`, `src/main.tsx`, `src/App.tsx` (rotas), `src/styles.css`
- `src/components/` `logo.tsx`, `sidebar.tsx`, `bottom-nav.tsx`, `nav-icons.tsx` (movidos), `dashboard/*`
- `src/lib/nav.ts`, `src/lib/metrics/*` (movidos, sem mudança de lógica)
- `src/data/db.ts` (Dexie), `src/data/seed.ts`, `src/data/backup.ts`, `src/data/dashboard.ts`, `src/data/profile.ts`
- `src/pages/` `Inicio.tsx`, `Perfil.tsx`, `Futura.tsx`, `Landing.tsx` opcional
- `tests/unit/*`, `tests/e2e/*`; `.github/workflows/pages.yml`; `LEIA-ME.md`

---

### Task 1: Migrar o projeto para Vite

**Files:** Delete: `src/app/`, `src/proxy.ts`, `src/lib/supabase/`, `supabase/`, `next.config.ts`, `.env*`, `tests/rls/`, `tests/e2e/auth.spec.ts`, `docs/contas.md`, `Abrir OftaStudy.bat`; Create: `index.html`, `vite.config.ts`, `src/main.tsx`, `src/App.tsx`, `src/styles.css`; Modify: `package.json`, `tsconfig.json`, `vitest.config.ts`.

**Interfaces:** Produces: scripts `dev`, `build` (gera `dist/index.html` único), `test`, `test:e2e`; alias `@` → `src`.

- [ ] **Step 1:** Remover Next/Supabase (`npm rm next @supabase/ssr @supabase/supabase-js eslint-config-next`); instalar `vite @vitejs/plugin-react vite-plugin-singlefile react-router dexie fake-indexeddb`; manter Tailwind (plugin `@tailwindcss/vite`), Recharts, Vitest, Playwright, lucide-react.
- [ ] **Step 2:** `src/styles.css` com os tokens de cor atuais (`globals.css` do Next, sem as classes shadcn não usadas); `main.tsx` monta `<HashRouter><App/></HashRouter>`.
- [ ] **Step 3:** Mover `logo`, `nav`, `nav-icons`, `sidebar`, `bottom-nav` e `metrics/*` para os caminhos novos trocando `next/link`/`usePathname` por `Link`/`useLocation` do `react-router`.
- [ ] **Step 4:** Verificar: `npm test` mantém os 20 testes existentes verdes (nav + metrics); `npm run build` gera um único `dist/index.html`. Commit `chore: migra para Vite (app sem servidor)`.

### Task 2: Casca do app e páginas futuras

**Files:** Create: `src/App.tsx`, `src/pages/Futura.tsx`, `src/pages/Inicio.tsx` (provisório), `src/pages/Perfil.tsx` (provisório); Test: `tests/e2e/shell.spec.ts`

**Interfaces:** Consumes: `NAV_ITEMS`. Produces: rotas `/` → redireciona a `/inicio`; `/inicio`, `/perfil`, `/:secao` (Futura; slug sem fase → página "não encontrada").

- [ ] **Step 1:** Teste e2e (desktop e celular): `#/simulados` mostra "Disponível na Fase 6"; `#/xyz` mostra "Página não encontrada"; no celular, "Mais" abre a lista com os 10 itens; no desktop a barra lateral mostra os 10 itens. Rodar → falha.
- [ ] **Step 2:** Implementar `App.tsx` com layout (Sidebar + BottomNav) e as rotas. Rodar → passa. Commit.

### Task 3: Banco local (Dexie) e dados iniciais

**Files:** Create: `src/data/db.ts`, `src/data/seed.ts`, `src/data/profile.ts`; Test: `tests/unit/data.test.ts`

**Interfaces:** Produces:
- `db`: tabelas `profile` (chave fixa `id=1`: `nome`, `metaCronograma: string`, `provaMes: number|null`, `provaAno: number|null`, `horasDiarias: number|null`, `ultimoBackup: string|null`, `inicioEstudos: string`), `specialties` (`id++`, `nome`, `ordem`), `subjects`, `lessons` (`titulo`, `specialtyId`, `fonte`, `link`, `duracaoSeg`), `lessonProgress` (`lessonId` chave, `posicaoSeg`, `concluida`, `ultimoAcesso`), `questions`, `options`, `attempts` (`questionId`, `specialtyId`, `correta`, `respondidaEm`), `studySessions` (`inicio`, `duracaoSeg`).
- `iniciarBanco(): Promise<void>` (cria perfil padrão e as 14 especialidades só se ainda não existirem)
- `getPerfil(): Promise<Perfil>`; `salvarPerfil(p: Partial<Perfil>): Promise<{ok: true} | {ok: false; erro: string}>` (nome não vazio; `horasDiarias` entre 0,5 e 16; `provaMes` 1–12 e `provaAno` ≥ 2026, ambos ou nenhum)

- [ ] **Step 1:** Testes (com `fake-indexeddb/auto`): `iniciarBanco()` cria 14 especialidades; chamar duas vezes continua 14; perfil padrão tem `metaCronograma === "2027-12-31"`; `salvarPerfil({horasDiarias: 30})` devolve `ok:false`; `salvarPerfil({provaMes: 3})` sem ano devolve `ok:false`; `salvarPerfil({nome:"Dr. Teste", provaMes:6, provaAno:2029})` devolve `ok:true` e `getPerfil()` reflete. Rodar → falha.
- [ ] **Step 2:** Implementar. Rodar → passa. Commit.

### Task 4: Backup e restauração

**Files:** Create: `src/data/backup.ts`; Test: `tests/unit/backup.test.ts`

**Interfaces:** Produces:
- `exportarBackup(): Promise<{ versao: 1; geradoEm: string; dados: Record<string, unknown[]> }>` (grava `ultimoBackup` no perfil)
- `restaurarBackup(json: unknown): Promise<{ok: true} | {ok: false; erro: string}>` (valida `versao === 1` e tabelas conhecidas **antes** de tocar nos dados; substitui tudo em uma transação)
- `diasDesdeBackup(ultimo: string | null, hoje: Date): number | null` (null se nunca; usado para o aviso de 7 dias)

- [ ] **Step 1:** Testes: exportar → apagar tudo → restaurar devolve as mesmas especialidades e o mesmo perfil; `restaurarBackup({versao: 99})` e `restaurarBackup("lixo")` devolvem `ok:false` e os dados atuais continuam intactos; `diasDesdeBackup(null, hoje) === null`; backup de 8 dias atrás devolve 8. Rodar → falha.
- [ ] **Step 2:** Implementar. Rodar → passa. Commit.

### Task 5: Dashboard com dados locais e modo demonstração

**Files:** Create: `src/data/dashboard.ts`, `src/components/dashboard/{stat-card,specialty-chart,continue-card,my-day,demo-banner}.tsx`, `src/pages/Inicio.tsx`; Test: `tests/unit/dashboard.test.ts`, `tests/e2e/dashboard.spec.ts`

**Interfaces:** Consumes: Tarefas 1 e 3. Produces: `carregarDashboard(hoje: Date): Promise<DashboardData>` com `nome`, `horas`, `aulasConcluidas`, `questoesRespondidas`, `acertoPct: number|null`, `revisoesPendentes: 0`, `progressoCronograma: {pct, daysLeft}`, `diasProva: number|null`, `porEspecialidade: {nome, pct, total}[]`, `ultimaAula: {titulo, posicaoSeg} | null`, `tarefasHoje: []`.

- [ ] **Step 1:** Teste unitário: com banco recém-criado, `acertoPct === null`, `horas === 0`, `ultimaAula === null`; após gravar 3 tentativas (2 certas), `acertoPct === 67` e `questoesRespondidas === 3`. Teste e2e: dashboard vazio com saudação e estados vazios; `#/inicio?demo=1` mostra rótulo DEMONSTRAÇÃO e números; ao voltar para `#/inicio` o banco continua vazio. Rodar → falha.
- [ ] **Step 2:** Implementar dados e componentes (cards, barra de progresso até 31/12/2027, contagem da prova, gráfico por especialidade com Recharts, "Continuar estudando", "Meu dia" com texto "O cronograma chega na Fase 4"). Demonstração só em memória. Rodar nas duas larguras → passa. Commit.

### Task 6: Perfil e backup na tela

**Files:** Modify: `src/pages/Perfil.tsx`; Create: `src/components/backup-panel.tsx`; Test: `tests/e2e/perfil.spec.ts`

- [ ] **Step 1:** Teste e2e: salvar nome "Dr. Teste" e prova 06/2029 → dashboard saúda "Dr. Teste"; horas diárias 30 mostra erro; "Salvar backup" baixa um `.json`; restaurar esse arquivo mantém o nome; restaurar um arquivo inválido mostra erro e mantém o nome. Rodar → falha.
- [ ] **Step 2:** Implementar formulário (usa `salvarPerfil`) e painel de backup (usa `exportarBackup`/`restaurarBackup`), com aviso na tela quando `diasDesdeBackup` ≥ 7 ou nunca houve backup e há dados; chamar `navigator.storage.persist()` na primeira abertura, ignorando falha. Rodar → passa. Commit.

### Task 7: Arquivo único e publicação preparada

**Files:** Create: `.github/workflows/pages.yml`; Modify: `vite.config.ts` (`base: "./"`); Test: `tests/e2e/arquivo-unico.spec.ts`

- [ ] **Step 1:** Teste e2e: após `npm run build`, abrir `dist/index.html` por `file://` carrega o dashboard, navega para `#/simulados` e grava o nome no Perfil. Também: com IndexedDB indisponível (bloqueado no contexto de teste) a tela mostra "Não foi possível salvar dados neste navegador". Rodar → falha.
- [ ] **Step 2:** Ajustar para passar; criar o workflow de GitHub Pages (build + deploy), **sem publicar** ainda. Commit.

### Task 8: Fechamento

**Files:** Create: `LEIA-ME.md`; Modify: `Setup\projetos.md` (fora do repositório)

- [ ] **Step 1:** Rodar `npm test`, `npm run build`, `npm run test:e2e` (desktop e celular); todos verdes. Listar no relatório o que não foi testado (iPad real, GitHub Pages, vídeo do Drive).
- [ ] **Step 2:** `LEIA-ME.md` em português simples: como abrir o `OftaStudy.html`, como fazer e restaurar backup, o que vem em cada fase. Copiar `dist/index.html` para `OftaStudy.html` na raiz do projeto. Registrar o projeto em `Setup\projetos.md`.
- [ ] **Step 3:** Gerar capturas em 1280px e 390px para o usuário aprovar. **Parar:** publicar no GitHub só depois da aprovação do design. Commit.

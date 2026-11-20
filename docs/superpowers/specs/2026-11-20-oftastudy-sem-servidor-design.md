# OftaStudy — Revisão do design: app sem servidor (opção B)

Data: 20/11/2026 · Status: aguardando aprovação · Substitui as seções 5, 6 e 9 do design de 12/11/2026 (`2026-11-12-oftastudy-fase1-design.md`). O restante (objetivos, visual, telas, menu, datas) continua valendo.

## Por que mudar
O usuário achou o site complexo, principalmente pelas contas (Supabase, Vercel) e por não conseguir completar o cadastro. Uso é pessoal, em um ou dois aparelhos. Decisão do usuário: arquivo único, sem contas pagas nem login, publicado de graça no GitHub para abrir no celular (opção B).

## O que muda
- **Sem Supabase, sem Vercel, sem login, sem RLS.** O app não tem servidor. Tudo roda no navegador.
- **Dados no próprio aparelho** (IndexedDB). Cada aparelho tem a sua cópia; **não sincronizam sozinhos**.
- **Backup e restauração:** botão "Salvar backup" (baixa um arquivo `.json` com tudo) e "Restaurar backup". Lembrete na tela quando o último backup tiver mais de 7 dias. Pedido de armazenamento persistente ao navegador para reduzir o risco de limpeza automática.
- **Dois jeitos de abrir:** (1) link público no GitHub Pages, para PC e celular (endereço estável e dados mais confiáveis); (2) arquivo `OftaStudy.html` autossuficiente, que abre com dois cliques. Os dados de cada jeito são separados; o backup move de um para o outro.
- **Vídeos** continuam no computador. No PC, o app pede a pasta (permissão do navegador) e toca de lá. No celular, as videoaulas não tocam a partir do PC; questões, flashcards, revisões e cronograma funcionam normalmente.
- **Atenção sobre privacidade:** o GitHub Pages gratuito exige repositório **público**. Ficam públicos só o código do app; as suas questões, notas e progresso ficam no navegador e nunca vão para o GitHub.

## Vídeos por aparelho (decisão do usuário, 20/11/2026)
PC: toca da pasta local, com progresso automático. iPad/celular: cada aula pode ter um link do Google Drive, aberto no player do próprio Drive (privado: exige estar logado na conta Google); o app não sabe o minuto, então a conclusão é marcada à mão. O iPad não lê pastas locais. Isso é da Fase 2; a Fase 1 só guarda o campo `fonte` da aula (`pasta` ou `drive`) e `link`. Não testado ainda: nem todo vídeo do Drive pode aceitar reprodução embutida.

## Tecnologia (minhas escolhas)
Vite + React + TypeScript + Tailwind, gerando um arquivo único (`vite-plugin-singlefile`); rotas por `#` (funciona também ao abrir o arquivo direto); Dexie (IndexedDB); Recharts; Vitest e Playwright (Edge). Publicação por GitHub Actions no GitHub Pages.

## Reaproveitado do que já existe
Logotipo e paleta; menu lateral e barra inferior; lista de itens do menu; cálculos de acertos, cronograma, horas e especialidades com seus testes. Descartados: migrações SQL, clientes e proxy do Supabase, login.

## Fase 1 revisada
Estrutura Vite; identidade visual e menu; banco local com as 14 especialidades iniciais editáveis; dashboard lendo do banco local (estados vazios, botão "DEMONSTRAÇÃO" que não grava); Perfil (nome, meta 31/12/2027, mês/ano da prova, horas diárias); backup e restauração; build do arquivo único; publicação no GitHub Pages **só após você aprovar o design**.

## Testes
Unitários dos cálculos e da camada de dados (incluindo backup → restaurar devolve o mesmo conteúdo, e arquivo de backup inválido é recusado sem apagar nada); e2e com Playwright (Edge) em 1280px e 390px: dashboard vazio, demonstração sem gravar, perfil, backup.

## Riscos aceitos
Perda de dados se o navegador for limpo sem backup; sem sincronização automática; Safari/iPhone pode apagar dados de sites pouco usados (mitigado com backup e lembrete).

## Minhas decisões a conferir
Repositório público no GitHub; rotas por `#`; lembrete de backup a cada 7 dias; arquivo único separado do link (dados independentes).

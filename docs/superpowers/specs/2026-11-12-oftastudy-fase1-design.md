# OftaStudy — Design da Fase 1

Data: 12/11/2026 · Status: aguardando aprovação

## 1. Intenção
Plataforma de estudos para a prova do CBO (2029), de uso **pessoal** (um único usuário). Meta do conteúdo: concluir todo o cronograma até **31/12/2027**; 2028–2029 = revisão, questões e simulados. Precisa funcionar no computador, tablet e celular, de qualquer lugar. Custo inicial R$ 0.

## 2. Objetivos / Não-objetivos / Anti-objetivos
**Objetivos da Fase 1:** estrutura do projeto, identidade visual, login, banco de dados inicial com segurança, dashboard funcional, menu lateral responsivo, publicação online (para uso no celular).
**Não-objetivos:** vídeos, questões, cronograma, revisão, flashcards, simulados (Fases 2–6). Multiusuário, papéis (professor/aluno), assinaturas, gerenciamento de usuários — removidos do escopo por decisão do usuário.
**Anti-objetivos:** telas falsas apresentadas como funcionais; gastar dinheiro; chaves secretas no navegador; complexidade pensada para muitos alunos.

## 3. Restrições
- Somente serviços gratuitos; nada pago sem autorização.
- Vídeos (3 GB) ficam no computador do usuário; não vão para o banco. Só tocam no computador até existir hospedagem de vídeo (Fase 2).
- Vercel Hobby é não-comercial: adequado para uso pessoal; vender exigiria mudar de plano.
- Supabase gratuito: 1 GB de arquivos; pausa após ~7 dias sem uso (basta abrir o app / reativar no painel).
- Usuário não é programador: entregas com passo a passo simples, em português do Brasil, datas DD/MM/AAAA.

## 4. Abordagens consideradas
- A. Tudo local sem contas — descartada: sem login/banco real, não atende o celular.
- **B. Só Supabase primeiro, GitHub+Vercel após aprovar o design — escolhida** (recomendação aceita).
- C. Três contas de uma vez — descartada: trabalho antes de ver o resultado.
Versão "só no computador" (SQLite) foi descartada porque o usuário quer estudar fora de casa.

## 5. Arquitetura
- **Next.js (App Router) + React + TypeScript + Tailwind + shadcn/ui.**
- **Supabase:** PostgreSQL + Auth (e-mail e senha). Cadastro público **desativado**; o usuário único é criado no painel do Supabase.
- **Acesso a dados** pelo servidor Next.js e pelo navegador só com a chave pública (anon); chave de serviço nunca vai ao navegador (`.env.local`, fora do Git).
- **RLS** em todas as tabelas: cada linha tem `user_id` e só o dono lê/escreve. Mantida mesmo com um usuário, como proteção caso a chave pública vaze.
- **Camada de vídeos** (Fase 2): interface `VideoProvider` (local, URL, futuro serviço) — fica fora da Fase 1, mas o campo `source_type`/`source_ref` já existe em `lessons`.
- **Publicação:** GitHub → Vercel; variáveis de ambiente configuradas na Vercel.

## 6. Banco de dados inicial (migrações SQL versionadas)
Criadas agora (necessárias ao dashboard): `profiles` (nome, data-meta do cronograma 31/12/2027, mês/ano da prova, horas diárias), `specialties` (14 áreas fornecidas, editáveis, aceitando novas), `subjects`, `lessons`, `lesson_progress`, `questions`, `question_options`, `question_attempts`, `study_sessions` (horas estudadas — *tabela adicionada por mim*). As demais da lista (planos, tarefas, revisões, flashcards, simulados, favoritos, notas, comentários) entram na fase em que forem usadas. Sem papéis de acesso.
Dados de conteúdo reais só virão por importação; as 14 especialidades são estrutura, não conteúdo fictício.

## 7. Identidade visual
Azul-marinho (base/menu), branco, azul-claro (destaque), verde-água (indicadores positivos), cinza-claro (fundos). Cores de atividade para as próximas fases: azul = aula, verde = questões, amarelo = revisão, roxo = simulado, cinza = descanso. Logotipo provisório "OftaStudy" (símbolo de olho + texto) em SVG. Estilo premium e minimalista; modo claro apenas.

## 8. Telas da Fase 1
- **Página inicial** (pública) e **Login**.
- **Menu lateral** com: Início, Videoaulas, Banco de questões, Simulados, Cronograma, Calendário, Revisões, Flashcards, Desempenho, Perfil. Em celular vira barra inferior + menu retrátil.
- **Dashboard (Início):** saudação personalizada; horas estudadas; aulas concluídas; questões respondidas; % de acertos; revisões pendentes; próximas atividades; progresso até a meta de 31/12/2027 e contagem para a prova; gráfico por especialidade; "Continuar estudando"; "Meu dia". Tudo lê do banco real; sem dados, mostra estados vazios claros.
- **Perfil:** editar nome, meta, prova, horas diárias.
- Demais itens do menu abrem página "Disponível na Fase X" — rotulada honestamente, sem fingir função.
- **Pré-visualização com exemplos:** botão marcado "DEMONSTRAÇÃO" que preenche o dashboard com números ilustrativos só na tela, sem gravar no banco; removido na Fase 7.

## 9. Testes e entrega
- Testes automatizados (Vitest) para cálculos do dashboard; teste de RLS (um usuário não lê dados de outro); teste de ponta a ponta com Playwright (Edge) para login e dashboard, em larguras de computador e celular.
- Ao concluir, informo o que foi e o que não foi testado.
- Arquivo `Abrir OftaStudy.bat` (clique duplo) para rodar localmente; documentação `LEIA-ME.md` e `docs/` com passo a passo de contas (Supabase, GitHub, Vercel).
- Registrar o projeto em `Setup\projetos.md`.

## 10. Ordem de trabalho
1. Aprovação deste documento. 2. Usuário cria conta Supabase (guio). 3. Estrutura + visual + banco + login. 4. Dashboard. 5. Usuário vê e aprova o design. 6. Só então GitHub + Vercel e publicação.

## 11. Deixado ao construtor
Nomes de componentes, bibliotecas de gráfico (Recharts), detalhes de layout dentro da paleta, estrutura de pastas.

## 12. Minhas decisões a conferir
Tabela `study_sessions`; cadastro público desativado; só modo claro; prova com mês/ano (data exata do CBO ainda desconhecida); gráfico com Recharts; botão de demonstração.

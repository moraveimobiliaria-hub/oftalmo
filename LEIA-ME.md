# OftaStudy

Plataforma de estudos para a prova do CBO (2029). Meta: concluir o conteúdo até 31/12/2027.

## Como abrir
Dê **dois cliques em `OftaStudy.html`** (nesta pasta). Abre no navegador (Edge ou Chrome). Não precisa de internet, conta, nem programa instalado.
**No celular ou iPad:** abra https://moraveimobiliaria-hub.github.io/oftalmo/ e, no menu do navegador, use "Adicionar à tela inicial". (Código no GitHub: moraveimobiliaria-hub/oftalmo, repositório público; seus dados nunca vão para lá.)
Dica: clique com o botão direito no arquivo → *Enviar para → Área de trabalho (criar atalho)*.

## Onde ficam seus dados
**Só no navegador deste aparelho.** Não há servidor. Por isso:
- Faça **backup** em *Perfil → Salvar backup* (gera um arquivo `.json`). O app avisa quando passar de 7 dias.
- Para levar seu progresso a outro aparelho: salve o backup aqui, abra o app no outro e use *Restaurar backup*.
- Se limpar os dados do navegador sem backup, o progresso se perde.
- O arquivo `OftaStudy.html` e o link do GitHub (quando existir) guardam dados **separados**. O backup leva de um para o outro.

## O que já funciona (Fase 1)
Menu, dashboard (horas, aulas, questões, acertos, progresso até a meta, contagem da prova), Perfil, backup e restauração. O botão **Pré-visualizar com exemplos** mostra o dashboard cheio com números de mentira, sem gravar nada.

## O que vem depois
Fase 2 videoaulas · 3 questões · 4 cronograma e calendário · 5 revisão espaçada e flashcards · 6 simulados e estatísticas · 7 testes finais e celular.
Os itens do menu das próximas fases mostram "Disponível na Fase X".

## Para quem mexe no código
`npm install` · `npm run dev` (abre em http://localhost:5173) · `npm test` · `npm run test:e2e` · `npm run build` (gera `dist/index.html`; copiar para `OftaStudy.html`).
Documentos em `docs/superpowers/` (design e planos). O plano com Supabase foi abandonado em 20/11/2026.

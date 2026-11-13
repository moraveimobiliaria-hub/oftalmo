export type NavItem = { slug: string; label: string; href: string; fase: number | null };

/** Itens do menu, na ordem de exibição. `fase` = fase em que a função chega (null = já existe). */
export const NAV_ITEMS: NavItem[] = [
  { slug: "inicio", label: "Início", href: "/inicio", fase: null },
  { slug: "videoaulas", label: "Videoaulas", href: "/videoaulas", fase: 2 },
  { slug: "banco-de-questoes", label: "Banco de questões", href: "/banco-de-questoes", fase: 3 },
  { slug: "simulados", label: "Simulados", href: "/simulados", fase: 6 },
  { slug: "cronograma", label: "Cronograma", href: "/cronograma", fase: 4 },
  { slug: "calendario", label: "Calendário", href: "/calendario", fase: 4 },
  { slug: "revisoes", label: "Revisões", href: "/revisoes", fase: 5 },
  { slug: "flashcards", label: "Flashcards", href: "/flashcards", fase: 5 },
  { slug: "desempenho", label: "Desempenho", href: "/desempenho", fase: 6 },
  { slug: "perfil", label: "Perfil", href: "/perfil", fase: null },
];

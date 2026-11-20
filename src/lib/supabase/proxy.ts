import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ROTAS_PUBLICAS = ["/", "/login"];

/** Renova a sessão e redireciona: sem login → /login; já logado em / ou /login → /inicio. */
export async function atualizarSessao(request: NextRequest) {
  let resposta = NextResponse.next({ request });

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (lista) => {
        lista.forEach(({ name, value }) => request.cookies.set(name, value));
        resposta = NextResponse.next({ request });
        lista.forEach(({ name, value, options }) => resposta.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const caminho = request.nextUrl.pathname;
  const publica = ROTAS_PUBLICAS.includes(caminho) || caminho.startsWith("/auth/");

  if (!user && !publica) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (user && ROTAS_PUBLICAS.includes(caminho)) {
    return NextResponse.redirect(new URL("/inicio", request.url));
  }
  return resposta;
}

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Cliente Supabase para o servidor, com a sessão do usuário (o RLS filtra os dados). */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (lista) => {
        try {
          lista.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Chamado de um Server Component: o proxy já renova a sessão, pode ignorar.
        }
      },
    },
  });
}

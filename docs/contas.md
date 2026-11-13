# Contas gratuitas do OftaStudy

Só o **Supabase** é necessário agora. GitHub e Vercel ficam para depois que você aprovar o design.

## 1. Supabase (banco de dados e login) — ~10 minutos

1. Acesse https://supabase.com e clique em **Start your project**. Entre com sua conta Google ou crie uma.
2. Clique em **New project**. Nome: `oftastudy`. Crie uma **senha do banco** (guarde num lugar seguro; não precisamos dela no app). Região: **South America (São Paulo)**. Plano: **Free**.
3. Espere uns 2 minutos até o projeto ficar pronto.
4. **Criar as tabelas:** menu esquerdo → **SQL Editor** → **New query**. Abra o arquivo `supabase/migrations/0001_init.sql`, copie tudo, cole e clique **Run**. Deve aparecer "Success". Repita com `0002_seed_specialties.sql`.
5. **Desativar cadastro público:** menu **Authentication** → **Sign In / Providers** (ou *Providers*) → em **Email**, desligue **Allow new users to sign up**. Assim só você entra.
6. **Criar seu usuário:** **Authentication** → **Users** → **Add user** → **Create new user**. Informe seu e-mail e uma senha forte e marque **Auto Confirm User**.
7. **Copiar as chaves públicas:** menu **Project Settings** (engrenagem) → **API Keys**. Copie:
   - **Project URL** (algo como `https://xxxx.supabase.co`)
   - **anon / publishable key** (a chave pública)

   **Não copie a `service_role` / secret key.** Ela nunca deve ser usada nem colada em lugar nenhum.
8. Na pasta do projeto, copie `.env.example` para `.env.local` e preencha as duas primeiras linhas com a URL e a chave pública. (Esse arquivo não vai para o GitHub.)

> Para os testes automáticos, crie um **segundo usuário** só para testes (ex.: `teste@exemplo.com`) e coloque e-mail e senha dele em `E2E_EMAIL` e `E2E_SENHA`. Nunca use sua conta pessoal nos testes.

### Lembrete
O plano gratuito do Supabase **pausa o projeto após cerca de 7 dias sem acesso**. Se acontecer, entre no painel e clique em **Restore project**; nada é perdido.

## 2. GitHub e 3. Vercel (depois da aprovação do design)
Serão detalhados na hora da publicação. Vercel Hobby é gratuito, mas só para uso pessoal e não comercial.

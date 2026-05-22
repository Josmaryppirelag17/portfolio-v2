# Josmary Pirela — Portfolio

Portfolio interactivo cyber-retro: **React 19**, **Vite 6**, **Tailwind v4**, backend serverless en **Vercel** (Supabase, Resend, Telegram, Upstash).

**Dominio:** [josmarypirela.dev](https://josmarypirela.dev)

## Documentación

| Archivo | Descripción |
|---------|-------------|
| [WALKTHROUGH.md](./WALKTHROUGH.md) | Estado del proyecto, pendientes y **stack tecnológico** |
| [DOCUMENTACION.md](./DOCUMENTACION.md) | Arquitectura y estructura del código |
| [INSTRUCCIONES_BACKEND.md](./INSTRUCCIONES_BACKEND.md) | API de contacto, Telegram, Supabase, rate limiting |

## Requisitos

- Node.js 18+

## Desarrollo

```bash
npm install
npm run dev          # Solo frontend → http://localhost:3000
npx vercel dev       # Frontend + /api/contact (recomendado para formulario)
```

## Variables de entorno

Copia `.env.example` a `.env` (y `.env.local` para Vite si aplica):

```bash
VITE_SITE_URL="https://josmarypirela.dev"
DATABASE_URL="postgresql://..."
RESEND_API_KEY="..."
TELEGRAM_BOT_TOKEN="..."
TELEGRAM_CHAT_ID="..."
UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."
RATE_LIMIT_MAX_PER_HOUR="10"
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor Vite |
| `npm run build` | Build → `dist/` (ES + `dist/en/`) |
| `npm run preview` | Vista previa del build |
| `npm run lint` | TypeScript (`tsc --noEmit`) |

## Build multi-idioma

El `vite.config.ts` define dos entradas:

- `/` → `index.html` (español)
- `/en/` → `en/index.html` (inglés)

## Flujo de trabajo recomendado

Consulta `DOCUMENTACION.md` para el flujo de trabajo oficial del proyecto: desde definición y diseño hasta desarrollo, pruebas y despliegue.

## Despliegue en Vercel

1. Conectar repositorio o `npx vercel --prod`
2. Configurar variables del `.env.example` en el dashboard
3. Añadir dominio `josmarypirela.dev` y DNS según el panel de Vercel

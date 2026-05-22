# Josmary Pirela — Portfolio

Portfolio interactivo con estética cyber-brutalist, construido para producción.

**Producción:** [josmarypirela.dev](https://josmarypirela.dev)

[![Mozilla Observatory A+](https://img.shields.io/badge/Mozilla__Observatory-A%2B__115%2F100-success?style=for-the-badge&logo=mozilla&logoColor=white)](https://observatory.mozilla.org/analyze/www.josmarypirela.dev)

![Vista previa del portfolio](public/portafolio-preview.png)

---

## Resumen

Este proyecto es una cartera profesional que combina:

- UI interactiva y animaciones con `motion/react`
- Renderizado estático multilingüe (`/` y `/en/`)
- Backend serverless para formulario de contacto y Open Graph dinámico
- Estrategias de accesibilidad y reducción de movimiento

---

## Features

- Bilingual SEO-ready architecture (`/` y `/en/`)
- Dynamic Open Graph generation con Edge Functions
- UI interactiva accesible
- Pipeline de contacto con rate limiting
- Soporte para reduced motion
- Lazy loading y code splitting

---

## Stack

- React 19
- TypeScript
- Vite 6
- Tailwind CSS v4
- Vercel Functions
- PostgreSQL (vía pg client, compatible con Supabase)
- Upstash Redis
- Resend

---

## Arquitectura

El proyecto está dividido en tres capas principales:

- Frontend estático (React + Vite)
- Backend serverless (Vercel Functions)
- Servicios externos (Supabase, Redis, Resend, Telegram)

Prioridades del sistema:

- SEO
- Rendimiento
- Accesibilidad
- Modularidad
- Experiencia interactiva ligera

---

## SEO

El proyecto implementa:

- Renderizado estático bilingüe
- Canonical URLs
- Hreflang
- Open Graph dinámico
- Sitemap y robots.txt

---

## Instalación local

```bash
git clone [https://github.com/josmarypirela/portfolio-v2.git](https://github.com/josmarypirela/portfolio-v2.git)
cd portfolio-v2
npm install
npm run dev

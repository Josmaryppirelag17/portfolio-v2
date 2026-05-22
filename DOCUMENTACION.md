# Arquitectura del portfolio — josmarypirela.dev

Guía técnica del cyber-portfolio de **Josmary Pirela**: frontend interactivo (React 19 + Vite 6), SEO multi-idioma con entradas estáticas, y backend serverless en Vercel.

> **Estado del proyecto:** ver [WALKTHROUGH.md](./WALKTHROUGH.md) para checklist de lo completado y pendiente de deploy.

---

## Estructura del repositorio

```text
portfolio-v2/
├── api/
│   ├── contact.ts              # POST contacto (Vercel Function, Node)
│   ├── og.tsx                  # OG image 1200×630 (Edge, @vercel/og)
│   └── lib/
│       └── rateLimit.ts        # Upstash Redis — límite por IP/hora
├── en/
│   └── index.html              # Entrada build inglés (/en/)
├── public/
│   ├── favicon.svg
│   ├── og-image.svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── main.tsx                # React root + MotionConfig + ErrorBoundary
│   ├── App.tsx                 # Layout, nav, lazy sections, Matrix easter egg
│   ├── index.css               # Tailwind v4 + prefers-reduced-motion
│   ├── LanguageContext.tsx     # i18n ES/EN + datos localizados
│   ├── types.ts
│   ├── seo/
│   │   ├── config.ts           # SITE_URL, pageUrl(/, /en/)
│   │   ├── metadata.ts         # Títulos y descriptions por idioma
│   │   └── applyHead.ts        # Meta dinámicos + pathname /en
│   ├── lib/
│   │   └── cyberMessages.ts    # localStorage cyber_messages + demo admin
│   ├── hooks/
│   │   └── usePrefersReducedMotion.ts
│   └── components/
│       ├── HeroPlayground.tsx      # LCP — canvas 3D (carga eager)
│       ├── AboutSection.tsx        # Bio + CyberAvatar + consola (lazy)
│       ├── ExperienceTimeline.tsx
│       ├── ProjectsShowcase.tsx
│       ├── InteractiveSkills.tsx
│       ├── ContactTerminal.tsx     # Form → /api/contact + localStorage
│       ├── AdminConsole.tsx        # guest/guest — lee cyber_messages
│       ├── CyberConsoleWidgets.tsx
│       ├── CyberAvatar.tsx
│       ├── InteractiveGrid.tsx
│       ├── SoundEngine.ts
│       ├── ErrorBoundary.tsx
│       └── SectionFallback.tsx     # Suspense fallback
├── index.html                  # Entrada build español (/)
├── vite.config.ts              # Multi-page: main + en
├── vercel.json                 # Functions, rewrites, maxDuration
├── .env.example
├── WALKTHROUGH.md              # Estado y tecnologías
├── INSTRUCCIONES_BACKEND.md
└── README.md
```

---

## Flujo de trabajo del proyecto

### 1. Definición y alcance
- Objetivo principal: describir qué problema resuelve el proyecto y a qué usuario final está dirigido.
- Entregables mínimos: sitio responsivo, formulario funcional, deploy en Vercel, documentación final.
- Alcance: UI interactiva con React, proyecto multi-idioma opcional, backend serverless para contacto y OG dinámico.
- Criterios de aceptación: carga rápida, navegación clara, validación de datos y despliegue estable.

### 2. Planificación
- Seleccionar stack tecnológico: React 19, Vite 6, TypeScript, Tailwind v4, Vercel, Supabase/Resend/Upstash si aplica.
- Definir arquitectura: frontend estático + API serverless para contacto y OG, rutas `/` y `/en/`.
- Crear estructura de carpetas, nombrar archivos principales y preparar el archivo `DOCUMENTACION.md`.
- Preparar checklist de entregables para cada sprint o iteración.

### 3. Diseño y prototipo
- Bosquejar wireframes de secciones clave: hero, sobre mí, trayectoria, proyectos, habilidades y contacto.
- Definir estilos base, paleta de colores y tipografías.
- Validar diseño responsive en móvil y escritorio.
- Determinar estados de carga, hover, foco y preferencia de movimiento reducido.

### 4. Setup inicial
- Inicializar repositorio Git y crear rama principal.
- Instalar dependencias con `npm install`.
- Crear `.env.example`, `README.md` y `DOCUMENTACION.md`.
- Configurar `vite.config.ts` para build multi-página si se requiere multi-idioma.
- Añadir `LanguageProvider` y sistema de traducción si aplica.

### 5. Desarrollo iterativo
- Construir primero el layout base y el hero creativo.
- Agregar componentes por secciones: `AboutSection`, `ExperienceTimeline`, `ProjectsShowcase`, `InteractiveSkills`, `ContactTerminal`.
- Usar `React.lazy()` y `Suspense` para secciones secundarias y optimizar el LCP.
- Implementar backend API serverless, validación de formulario y pruebas de envío.
- Mantener el código modular y documentado.

### 6. Pruebas y QA
- Ejecutar lint y TypeScript: `npm run lint`.
- Verificar formulario, validación y respuesta de la API de contacto.
- Probar `prefers-reduced-motion`, accesibilidad y navegación con teclado.
- Revisar SEO básico: metatags, canonical, hreflang y OG dinámico.
- Comprobar build final con `npm run build`.

### 7. Despliegue y publicación
- Publicar en Vercel con `npx vercel --prod`.
- Configurar variables de entorno en Vercel a partir de `.env.example`.
- Añadir dominio personalizado y verificar DNS.
- Revisar la versión desplegada y el sitemap.

### 8. Documentación oficial
- Mantener `README.md` con instalación, build y deploy.
- Documentar arquitectura, flujo y decisiones clave en `DOCUMENTACION.md`.
- Registrar dependencias, variables y pasos de despliegue.
- Añadir notas de mantenimiento y cambios importantes.

### 9. Mantenimiento
- Actualizar dependencias periódicamente.
- Corregir bugs y mejorar la experiencia de usuario.
- Añadir nuevos proyectos y secciones cuando haya material nuevo.
- Usar este flujo de trabajo como guía para futuros proyectos.

---

## Frontend

### Stack

- **React 19** + **TypeScript** + **Vite 6**
- **Tailwind CSS v4** (`@import "tailwindcss"`, variables en `@theme`)
- **Motion** para transiciones; respeta `prefers-reduced-motion` vía `MotionConfig` y CSS global

### Rendimiento (LCP)

- **Hero** (`HeroPlayground`): importación síncrona — primer paint crítico.
- **Resto de secciones**: `React.lazy()` + `Suspense` con `SectionFallback` (chunks separados en build).
- Canvas del hero: si el usuario tiene movimiento reducido, un solo frame estático (sin `requestAnimationFrame` continuo).

### Internacionalización

- Rutas físicas: `/` (español), `/en/` (inglés).
- `LanguageContext` + `src/seo/applyHead.ts` sincronizan `lang`, canonical, hreflang y JSON-LD.
- Compatibilidad legacy: parámetro `?lang=` como fallback de lectura.

### Componentes clave

| Módulo | Función |
|--------|---------|
| `SoundEngine.ts` | Singleton Web Audio: osciladores, gain, estática de radio |
| `HeroPlayground.tsx` | Proyección 3D en Canvas 2D (sin Three.js en hero) |
| `CyberAvatar.tsx` | Avatar reactivo al cursor + `InteractiveGrid` |
| `ContactTerminal.tsx` | Formulario, sintetizador, `POST /api/contact`, honeypot `fax` |
| `AdminConsole.tsx` | Panel simulado; mensajes también en `localStorage` |
| `ErrorBoundary.tsx` | Captura errores de render sin pantalla blanca |

### Accesibilidad

- `@media (prefers-reduced-motion: reduce)` en `index.css`
- Clase `reduce-motion-override` en `<html>` cuando el hook detecta preferencia
- Sintetizador de contacto: `aria-label`, `aria-pressed`, `role="group"`

### Open Graph (Vercel Edge)

- `api/og.tsx` genera PNG 1200×630 con `@vercel/og` (runtime edge).
- Meta en HTML y `applyHead.ts` usan `https://josmarypirela.dev/api/og`.
- `public/og-image.svg` queda como respaldo estático opcional.

---

## SEO

- Dos HTML estáticos en build (`dist/index.html`, `dist/en/index.html`) con meta y JSON-LD iniciales.
- Actualización en cliente vía `applyHead(language)` al cambiar idioma.
- `public/sitemap.xml` con URLs `/` y `/en/` + hreflang.
- `VITE_SITE_URL` en `.env` para canonical y OG en builds.

---

## Backend (`/api/contact`)

Flujo de una petición `POST` válida:

1. CORS y método
2. **Rate limit** (Upstash, por IP, ventana 1 h)
3. Honeypot `fax`
4. Validación de campos
5. INSERT en Supabase (`pg`)
6. Email (Resend) + Telegram (opcional)

Variables: ver [.env.example](./.env.example) e [INSTRUCCIONES_BACKEND.md](./INSTRUCCIONES_BACKEND.md). Email saliente: `RESEND_FROM` (dominio verificado en Resend).

---

## Despliegue (Vercel)

```bash
npm run build          # Genera dist/ + dist/en/
npx vercel dev         # Frontend + API local
npx vercel --prod      # Producción
```

`vercel.json` define:

- `maxDuration: 30` en `api/contact.ts`
- Rewrites: `/api/*` → funciones; `/en/*` → `en/index.html`; resto → `index.html`

---

## Hoja de ruta (ideas futuras)

- [ ] Reverb espacial en `SoundEngine` (`ConvolverNode`)
- [ ] FFT → deformación de vértices en hero
- [ ] Navegación solo-teclado completa en todo el sitio (más allá del sintetizador)
- [ ] OG por idioma (variantes ES/EN en `/api/og`)
- [ ] Verificar dominio en Resend (`hola@josmarypirela.dev`)

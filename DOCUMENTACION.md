# Documentación técnica — portfolio-v2

Documento de arquitectura oficial para el portfolio de **Josmary Pirela**.
Aquí se describe la estructura del proyecto, la estrategia SEO bilingüe, la arquitectura frontend/backend y las decisiones técnicas principales.

---

# Architecture Overview

El portfolio está estructurado como una aplicación web bilingüe orientada a producción compuesta por:

- Un frontend estático construido con React y Vite
- Funciones serverless desplegadas en Vercel
- Servicios externos para persistencia, notificaciones y rate limiting

El proyecto prioriza:

- SEO
- accesibilidad
- rendimiento
- modularidad
- mantenibilidad
- renderizado ligero

---

# Estructura del repositorio

```text
portfolio-v2/
├── api/
│   ├── contact.ts
│   ├── og.tsx
│   └── lib/
│       └── rateLimit.ts
├── en/
│   └── index.html
├── public/
│   ├── favicon.svg
│   ├── og-image.svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── LanguageContext.tsx
│   ├── types.ts
│   ├── seo/
│   │   ├── config.ts
│   │   ├── metadata.ts
│   │   └── applyHead.ts
│   ├── lib/
│   │   └── cyberMessages.ts
│   ├── hooks/
│   │   └── usePrefersReducedMotion.ts
│   └── components/
│       ├── HeroPlayground.tsx
│       ├── AboutSection.tsx
│       ├── ExperienceTimeline.tsx
│       ├── ProjectsShowcase.tsx
│       ├── InteractiveSkills.tsx
│       ├── ContactTerminal.tsx
│       ├── AdminConsole.tsx
│       ├── CyberConsoleWidgets.tsx
│       ├── CyberAvatar.tsx
│       ├── InteractiveGrid.tsx
│       ├── SoundEngine.ts
│       ├── ErrorBoundary.tsx
│       └── SectionFallback.tsx
├── index.html
├── vite.config.ts
├── vercel.json
├── .env.example
├── README.md
└── DOCUMENTACION.md
```

---

# Arquitectura principal

## Frontend

El frontend está construido con:

- React 19
- TypeScript
- Tailwind CSS v4
- Motion
- Canvas 2D

La aplicación utiliza:

- arquitectura basada en componentes
- lazy loading
- animaciones desacopladas
- renderizado interactivo en canvas
- contenido bilingüe localizado

---

## Capa SEO

El SEO se maneja mediante:

- generación estática multi-entrada
- etiquetas canonical
- sincronización hreflang
- metadata Open Graph
- JSON-LD estructurado

---

## Backend serverless

La capa backend utiliza Vercel Functions para:

- procesamiento del formulario de contacto
- generación dinámica de Open Graph
- rate limiting
- notificaciones externas

---

## Infraestructura externa

Servicios utilizados:

- PostgreSQL (vía pg client, compatible con Supabase) → persistencia
- Resend → envío de correos
- Telegram Bot API → notificaciones
- Upstash Redis → rate limiting por IP

---

# SEO bilingüe con SSG multi-entrada

## Enfoque

La solución utiliza dos páginas estáticas independientes:

- `/` → español
- `/en/` → inglés

---

## Implementación

- `vite.config.ts` define las entradas estáticas para ambos idiomas
- `LanguageContext.tsx` centraliza traducciones y contenido localizado
- `applyHead.ts` sincroniza:
  - `title`
  - `description`
  - `canonical`
  - `hreflang`
  - `og:url`
  - imagen Open Graph dinámica

---

## Beneficios

Este enfoque permite:

- indexación localizada correcta
- mejor compatibilidad SEO
- metadatos consistentes
- previews sociales diferenciados
- carga inicial completamente estática

---

# Flujo del endpoint de contacto

## Ciclo general

### 1. Recepción de solicitud

- Validación de método HTTP
- Configuración CORS
- Rechazo temprano de rutas inválidas

---

### 2. Validación y saneamiento

- Honeypot (`fax`) para bots simples
- Validación de nombre, email y mensaje
- Filtrado de entradas inesperadas

---

### 3. Rate limiting

- Verificación por IP mediante Upstash Redis
- Respuesta `429` con `Retry-After` si se excede el límite

---

### 4. Persistencia segura

- Inserción del mensaje en Supabase PostgreSQL
- Uso de consultas parametrizadas
- Sin concatenación SQL insegura

---

### 5. Notificaciones externas

Tras persistencia exitosa:

- envío de email mediante Resend
- envío opcional de notificación Telegram

---

### 6. Respuesta al cliente

El endpoint devuelve:

- estado de éxito
- estado de error controlado
- mensajes internos ocultos al cliente

---

# Flujo de datos

```text
Client Browser
    ↓
ContactTerminal.tsx
    ↓
POST /api/contact
    ↓
Input Validation
    ↓
Honeypot Check
    ↓
Rate Limit Verification (Upstash Redis)
    ↓
Supabase PostgreSQL Persistence
    ↓
Resend Email Notification
    ↓
Telegram Bot Notification
    ↓
JSON Response to Client
```

---

# Decisiones técnicas

## ¿Por qué Canvas 2D en lugar de Three.js?

Three.js fue eliminado para reducir:

- tamaño del bundle
- carga GPU innecesaria
- peso inicial de la aplicación

Los efectos visuales requeridos podían resolverse mediante proyección matemática personalizada usando Canvas 2D.

---

## ¿Por qué SSG multi-página en lugar de SPA pura?

El proyecto utiliza entradas estáticas independientes para:

- `/`
- `/en/`

Esto mejora:

- crawlabilidad
- indexación localizada
- consistencia SEO
- compatibilidad social

---

## ¿Por qué Edge Functions para Open Graph?

`/api/og` utiliza Vercel Edge Functions para:

- reducir latencia
- mejorar velocidad de generación OG
- optimizar caché de previews sociales

---

# Estrategia de rendimiento

Optimizaciones implementadas:

- lazy loading en secciones no críticas
- bundle splitting
- soporte reduced motion
- Canvas 2D lightweight
- HTML estático bilingüe
- caché Edge para Open Graph
- eliminación de dependencias innecesarias

---

# Estrategia de accesibilidad

Consideraciones aplicadas:

- soporte `prefers-reduced-motion`
- controles accesibles mediante teclado
- `aria-label`
- `aria-pressed`
- agrupación semántica
- contraste consistente
- estados de foco visibles

---

# Seguridad

El endpoint de contacto incluye:

- validación CORS
- honeypot anti-bot
- sanitización de entradas
- rate limiting por IP
- consultas SQL parametrizadas
- ocultación de errores internos
- aislamiento mediante variables de entorno

---

# Despliegue y mantenimiento

## Build

```bash
npm run build
```

Genera:

- `dist/`
- `dist/en/`

---

## Desarrollo local

```bash
npm run dev
```

Frontend Vite local.

---

## Desarrollo con APIs

```bash
npx vercel dev
```

Permite probar:

- `/api/contact`
- `/api/og`

---

## Producción

```bash
npx vercel --prod
```

---

# Variables de entorno

El proyecto requiere variables externas para:

- conexión Supabase
- integración Resend
- Telegram Bot API
- Upstash Redis

Consulta:

```text
.env.example
```

---

# Mejoras futuras

Posibles mejoras futuras:

- autenticación server-side real
- panel admin conectado a base de datos
- integración captcha / Turnstile
- analytics y observabilidad
- testing automatizado
- pipelines CI/CD
- dashboard administrativo persistente

import { PROJECTS_EN } from "./projects.en";

// Fuente única del portafolio: la portada y cada ficha /proyectos/[slug] leen de acá.
// Los repos privados NO se enlazan: se muestran con caso de estudio + video y capturas
// del sistema real (ver media.ts).


export interface Project {
  slug: string;
  name: string;
  tagline: string;
  year: string;
  kind: string;
  visibility: "privado" | "público" | "cliente";
  accent: string;
  stack: string[];
  problem: string;
  solution: string;
  features: string[];
  architecture: string[];
  role: string;
  links?: { label: string; href: string }[];
}

export const PROJECTS: Project[] = [
  {
    slug: "molaris",
    name: "Molaris",
    tagline: "Sistema de gestión odontológica",
    year: "2026",
    kind: "SaaS clínico",
    visibility: "privado",
    accent: "#0ea5a4",
    stack: ["NestJS 11", "Prisma", "PostgreSQL 16", "Next.js 16", "Tailwind 4", "Turborepo", "Docker", "Caddy", "Jest", "Vitest"],
    problem:
      "Los consultorios odontológicos pequeños llevan fichas en papel u hojas de cálculo: el historial del paciente se pierde, los diagnósticos no siguen un estándar y emitir certificados o recetas toma tiempo.",
    solution:
      "Una aplicación web con ficha clínica completa, diagnóstico codificado CIE-10, odontograma interactivo y emisión de documentos. La v1 es un consultorio por instancia; la v2 es multi-tenant con una base de datos por consultorio y un plano de control central.",
    features: [
      "Odontograma interactivo por pieza y cara dental",
      "Diagnóstico con catálogo CIE-10 importado",
      "Antecedentes, procedimientos, certificados y recetario",
      "Sesiones seguras, rate limiting y roles",
      "Multi-tenant: una base PostgreSQL por consultorio (v2)",
    ],
    architecture: [
      "Monorepo pnpm + Turborepo: apps/api (NestJS) y apps/admin-web (Next.js)",
      "Prisma como ORM y migraciones; seed y scripts de importación",
      "Decisiones de arquitectura registradas como ADRs en una knowledge base",
      "Despliegue con Docker Compose detrás de Caddy (TLS automático)",
    ],
    role: "Diseño, desarrollo y despliegue completos (backend, frontend, base de datos e infraestructura).",
  },
  {
    slug: "fenix-erp",
    name: "ERP Fénix Global",
    tagline: "ERP en producción para una fábrica de joyería",
    year: "2026",
    kind: "Cliente real · en producción",
    visibility: "cliente",
    accent: "#d97706",
    stack: ["Python 3.12", "FastAPI", "SQLAlchemy 2", "Alembic", "PostgreSQL 16", "Next.js 16", "TanStack Query", "Docker", "nginx", "Pytest"],
    problem:
      "La fábrica controlaba oro y piezas en cuadernos: no sabía cuánto material había en cada etapa de producción, la merma no se medía y los reportes de bodega se armaban a mano.",
    solution:
      "Un ERP web a medida: producción por etapas con actas de entrega y recepción, inventario calculado a partir de movimientos (nunca un número editable), compras, ventas, finanzas y un dashboard de estadísticas. Todo se mide en gramos.",
    features: [
      "Órdenes de producción por etapas con actas y cálculo de merma",
      "Inventario por movimientos: el saldo es la suma del historial",
      "Compras, ventas, finanzas y reportes de bodega",
      "Documentos, mensajería interna y dashboard",
      "Autenticación JWT con tokens de acceso y refresco",
    ],
    architecture: [
      "API FastAPI + SQLAlchemy 2 con migraciones Alembic y tests Pytest",
      "Frontend Next.js con React Query",
      "Producción: Docker Compose, nginx como proxy y certbot para TLS",
      "Respaldos automáticos de la base de datos",
    ],
    role: "Levantamiento de requisitos con el dueño, desarrollo completo, despliegue y propuestas de nuevos módulos (contabilidad).",
    links: [{ label: "fenixglobal.online (acceso privado)", href: "https://fenixglobal.online" }],
  },
  {
    slug: "taskkeep",
    name: "TaskKeep",
    tagline: "Gestión de tareas empresarial",
    year: "2026",
    kind: "SaaS multiempresa",
    visibility: "privado",
    accent: "#2563eb",
    stack: ["Next.js 16", "React 19", "TypeScript", "Supabase", "TanStack Query", "Zod", "React Hook Form", "Radix UI", "React Email", "Vercel"],
    problem:
      "Equipos que asignan tareas por chat pierden el rastro de quién aprobó qué, qué archivos corresponden a cada tarea y qué vence esta semana.",
    solution:
      "Una plataforma multiempresa con tareas por prioridad, flujo de aprobaciones, calendario, archivos enlazados desde Google Drive y recordatorios por correo.",
    features: [
      "Empresas, usuarios y roles",
      "Tareas con prioridad por color y flujo de aprobación",
      "Calendario (FullCalendar) y recordatorios por e-mail",
      "Archivos vía Google Drive Picker",
      "Validación de formularios con Zod",
    ],
    architecture: [
      "Monolito Next.js (App Router) con Supabase (Postgres + Auth)",
      "Estado de servidor con TanStack Query",
      "Correos con React Email",
      "Docker para desarrollo y despliegue en Vercel",
    ],
    role: "Desarrollo full-stack y rediseño visual completo.",
    links: [{ label: "task-keep-lime.vercel.app", href: "https://task-keep-lime.vercel.app" }],
  },
  {
    slug: "verbum",
    name: "Verbum",
    tagline: "App bíblica con IA para adultos mayores",
    year: "2026",
    kind: "App móvil",
    visibility: "privado",
    accent: "#7c3aed",
    stack: ["React Native", "Expo 54", "TypeScript", "Supabase", "SQLite", "Generación de video con IA"],
    problem:
      "Las apps religiosas están pensadas para jóvenes: letra pequeña, menús complejos. Los adultos mayores quieren contenido diario, simple y fácil de compartir por WhatsApp.",
    solution:
      "Una app con la Biblia completa offline, búsqueda semántica y un feed diario de videos cortos generados con IA a partir de un pasaje, con interfaz de tipografía grande y navegación mínima.",
    features: [
      "Biblia completa en SQLite local (sin conexión)",
      "Búsqueda por referencia y semántica",
      "Video diario generado con IA, acumulado en un feed tipo reels",
      "Compartir a redes y favoritos",
      "Diseño accesible para personas de 60+",
    ],
    architecture: [
      "Expo + React Native con expo-sqlite y expo-video",
      "Supabase para usuarios y contenido generado",
      "Pipeline de generación de video por IA en el backend",
    ],
    role: "Especificación de producto, diseño de UX accesible y desarrollo.",
  },
  {
    slug: "primero-en-leonida",
    name: "Primero en Leonida",
    tagline: "Sorteos verificables por suscripción",
    year: "2026",
    kind: "Plataforma web",
    visibility: "privado",
    accent: "#db2777",
    stack: ["Next.js 15", "React 19", "Supabase (Postgres + RLS)", "Lemon Squeezy", "Tailwind 4", "Vitest"],
    problem:
      "En los sorteos online nadie puede comprobar que el ganador no fue elegido a dedo.",
    solution:
      "Sorteos mensuales donde el ganador sale de una semilla pública y la lista completa de participantes: cualquiera puede repetir el cálculo. Además, un juego comunitario de logros por país.",
    features: [
      "Sorteo reproducible a partir de semilla pública",
      "Suscripciones y webhooks de pagos",
      "Juego de logros con votación y tarjetas para compartir",
      "Panel de moderación",
      "Páginas cacheadas en CDN; lo personal se carga en el cliente",
    ],
    architecture: [
      "Reglas puras en src/dominio con tests, replicadas en SQL",
      "Tests que comparan la regla en TypeScript con la de la base",
      "Lo que decide un ganador lo pone la base, nunca el navegador",
    ],
    role: "Plan de negocio, arquitectura, desarrollo y documentación.",
  },
  {
    slug: "boton-rojo",
    name: "El Botón Rojo",
    tagline: "Juego competitivo en tiempo real",
    year: "2026",
    kind: "Juego web",
    visibility: "privado",
    accent: "#dc2626",
    stack: ["Node 22", "Fastify 5", "Redis", "PostgreSQL", "React", "Vite", "Zod", "Caddy", "Vitest"],
    problem:
      "Un juego de “quién hace más clics” es trivial de trampear con un script y caro si cada clic es una petición.",
    solution:
      "El cliente agrupa clics en lotes de ~1 s y el servidor decide qué cuenta con anti-trampa por capas. Ranking top-10 en vivo y ganador de cada ronda persistido de forma auditable.",
    features: [
      "Ranking top-10 en vivo",
      "Clics agrupados en lotes (nunca 1 request por clic)",
      "Anti-trampa: token bucket → plausibilidad temporal → regularidad",
      "Rondas con duración fija y ganador auditable",
    ],
    architecture: [
      "Fastify + Redis para contadores y rate limit",
      "PostgreSQL para rondas y ganadores",
      "Un solo VPS con Caddy; frontend estático separado",
    ],
    role: "Especificación, diseño del anti-trampa y desarrollo.",
  },
  {
    slug: "plantchain",
    name: "PlantChain",
    tagline: "Apadrinamiento de árboles con blockchain",
    year: "2026",
    kind: "Hult Prize 2026",
    visibility: "público",
    accent: "#16a34a",
    stack: ["Smart contracts", "Web3", "Geolocalización", "Aplicación web"],
    problem:
      "La gente desconfía de los proyectos de reforestación: no sabe si su donación se convirtió en un árbol ni qué pasó con él.",
    solution:
      "Cada ciudadano compra un token que representa un árbol a plantar en Cuenca. Siembra, cuidados y crecimiento quedan registrados en la blockchain y se ven en un mapa.",
    features: [
      "Token por árbol apadrinado",
      "Historial inmutable de eventos del árbol",
      "Mapa con la ubicación de cada árbol",
    ],
    architecture: ["Emprendimiento presentado en el Hult Prize en la Universidad del Azuay (feb 2026)."],
    role: "Miembro del equipo emprendedor: modelo de negocio y diseño de la plataforma.",
  },
  {
    slug: "belta-collective",
    name: "Beltà Collective",
    tagline: "Tienda e-commerce",
    year: "2025",
    kind: "Cliente real · freelance",
    visibility: "cliente",
    accent: "#a16207",
    stack: ["WordPress", "WooCommerce", "HTML", "CSS", "JavaScript", "SEO on-page"],
    problem: "La marca necesitaba vender en línea con catálogo, carrito y pagos, y aparecer en buscadores.",
    solution:
      "Sitio e-commerce con catálogo, carrito, pasarelas de pago, personalización del tema y SEO on-page.",
    features: ["Catálogo y carrito", "Pasarelas de pago", "Mejoras de UX/UI", "SEO on-page"],
    architecture: ["WordPress + plugins de e-commerce, tema personalizado"],
    role: "Diseño, desarrollo, carga de contenido y SEO.",
    links: [{ label: "beltàcollective.es", href: "https://xn--beltcollective-jgb.es" }],
  },
  {
    slug: "pwa-recuerdos",
    name: "PWA de recuerdos",
    tagline: "App instalable con notificaciones diarias",
    year: "2026",
    kind: "Proyecto personal",
    visibility: "privado",
    accent: "#e11d48",
    stack: ["HTML/CSS/JS", "PWA (manifest + service worker)", "Vercel Functions", "Vercel Blob", "Google Sheets API", "OneSignal"],
    problem: "Quería un regalo que se instale como app en el celular y muestre algo distinto cada día, sin costos de servidor.",
    solution:
      "Una PWA sin framework: contador, frase diaria, galería de fotos en Vercel Blob indexada en Google Sheets y notificaciones push programadas.",
    features: ["Instalable en Android e iOS", "Notificaciones push diarias", "Galería con subida protegida", "Costo de infraestructura: 0"],
    architecture: ["Sitio estático + 2 funciones serverless (GET/POST) en Vercel"],
    role: "Desarrollo completo.",
  },
];

export type Lang = "es" | "en";

// Devuelve el proyecto con sus textos en el idioma pedido (stack y colores son comunes)
export function localize(project: Project, lang: Lang): Project {
  return lang === "en" ? { ...project, ...PROJECTS_EN[project.slug] } : project;
}

export function getProject(slug: string, lang: Lang = "es") {
  const project = PROJECTS.find((p) => p.slug === slug);
  return project && localize(project, lang);
}

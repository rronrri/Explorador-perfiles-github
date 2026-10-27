import type { Project } from "./projects";

// Traducción al inglés de los campos de texto; stack, slug y colores salen de projects.ts
export type ProjectText = Pick<
  Project,
  "tagline" | "kind" | "problem" | "solution" | "features" | "architecture" | "role"
> & { name?: string };

export const PROJECTS_EN: Record<string, ProjectText> = {
  molaris: {
    tagline: "Dental clinic management system",
    kind: "Clinical SaaS",
    problem:
      "Small dental clinics keep records on paper or spreadsheets: patient history gets lost, diagnoses don't follow a standard and issuing certificates or prescriptions takes time.",
    solution:
      "A web app with complete clinical records, ICD-10 coded diagnosis, an interactive odontogram and document generation. v1 runs one clinic per instance; v2 is multi-tenant with one database per clinic and a central control plane.",
    features: [
      "Interactive odontogram per tooth and surface",
      "Diagnosis with an imported ICD-10 catalog",
      "Medical history, procedures, certificates and prescriptions",
      "Secure sessions, rate limiting and roles",
      "Multi-tenant: one PostgreSQL database per clinic (v2)",
    ],
    architecture: [
      "pnpm + Turborepo monorepo: apps/api (NestJS) and apps/admin-web (Next.js)",
      "Prisma as ORM and migrations; seed and import scripts",
      "Architecture decisions recorded as ADRs in a knowledge base",
      "Deployed with Docker Compose behind Caddy (automatic TLS)",
    ],
    role: "End-to-end design, development and deployment (backend, frontend, database and infrastructure).",
  },
  "fenix-erp": {
    name: "Fénix Global ERP",
    tagline: "Production ERP for a jewelry factory",
    kind: "Real client · in production",
    problem:
      "The factory tracked gold and pieces in notebooks: it didn't know how much material was in each production stage, loss wasn't measured and warehouse reports were built by hand.",
    solution:
      "A custom web ERP: stage-based production with handover and receipt records, inventory computed from movements (never an editable number), purchases, sales, finance and a statistics dashboard. Everything is measured in grams.",
    features: [
      "Stage-based production orders with handover records and loss calculation",
      "Inventory by movements: the balance is the sum of the history",
      "Purchases, sales, finance and warehouse reports",
      "Documents, internal messaging and dashboard",
      "JWT authentication with access and refresh tokens",
    ],
    architecture: [
      "FastAPI + SQLAlchemy 2 API with Alembic migrations and Pytest tests",
      "Next.js frontend with React Query",
      "Production: Docker Compose, nginx as proxy and certbot for TLS",
      "Automatic database backups",
    ],
    role: "Requirements gathering with the owner, full development, deployment and proposals for new modules (accounting).",
  },
  taskkeep: {
    tagline: "Business task management",
    kind: "Multi-company SaaS",
    problem:
      "Teams that assign work over chat lose track of who approved what, which files belong to each task and what is due this week.",
    solution:
      "A multi-company platform with prioritized tasks, an approval flow, calendar, files linked from Google Drive and e-mail reminders.",
    features: [
      "Companies, users and roles",
      "Color-coded priorities and approval flow",
      "Calendar (FullCalendar) and e-mail reminders",
      "Files via Google Drive Picker",
      "Form validation with Zod",
    ],
    architecture: [
      "Next.js (App Router) monolith with Supabase (Postgres + Auth)",
      "Server state with TanStack Query",
      "E-mails with React Email",
      "Docker for development, deployed on Vercel",
    ],
    role: "Full-stack development and complete visual redesign.",
  },
  verbum: {
    tagline: "AI Bible app for older adults",
    kind: "Mobile app",
    problem:
      "Religious apps are designed for young people: small text, complex menus. Older adults want simple daily content that is easy to share on WhatsApp.",
    solution:
      "An app with the full Bible offline, semantic search and a daily feed of short AI-generated videos based on a passage, with large type and minimal navigation.",
    features: [
      "Full Bible in local SQLite (works offline)",
      "Search by reference and by meaning",
      "Daily AI-generated video, collected into a reels-style feed",
      "Share to social media and favorites",
      "Accessible design for people aged 60+",
    ],
    architecture: [
      "Expo + React Native with expo-sqlite and expo-video",
      "Supabase for users and generated content",
      "AI video generation pipeline on the backend",
    ],
    role: "Product specification, accessible UX design and development.",
  },
  "primero-en-leonida": {
    tagline: "Verifiable subscription giveaways",
    kind: "Web platform",
    problem: "In online giveaways nobody can check that the winner wasn't hand-picked.",
    solution:
      "Monthly draws where the winner is derived from a public seed and the full participant list: anyone can repeat the calculation. Plus a community achievements game by country.",
    features: [
      "Reproducible draw from a public seed",
      "Subscriptions and payment webhooks",
      "Achievements game with voting and shareable cards",
      "Moderation panel",
      "CDN-cached pages; personal data loads on the client",
    ],
    architecture: [
      "Pure rules in src/dominio with tests, replicated in SQL",
      "Tests that compare the TypeScript rule with the database rule",
      "Whatever decides a winner is set by the database, never by the browser",
    ],
    role: "Business plan, architecture, development and documentation.",
  },
  "boton-rojo": {
    tagline: "Real-time competitive game",
    kind: "Web game",
    problem: "A “who clicks the most” game is trivial to cheat with a script and expensive if every click is a request.",
    solution:
      "The client batches clicks every ~1 s and the server decides what counts with layered anti-cheat. Live top-10 leaderboard and each round's winner stored in an auditable way.",
    features: [
      "Live top-10 leaderboard",
      "Batched clicks (never one request per click)",
      "Anti-cheat: token bucket → timing plausibility → regularity",
      "Fixed-length rounds with auditable winner",
    ],
    architecture: [
      "Fastify + Redis for counters and rate limiting",
      "PostgreSQL for rounds and winners",
      "Single VPS with Caddy; separate static frontend",
    ],
    role: "Specification, anti-cheat design and development.",
  },
  plantchain: {
    tagline: "Blockchain tree sponsorship",
    kind: "Hult Prize 2026",
    problem:
      "People distrust reforestation projects: they don't know whether their donation became a tree or what happened to it.",
    solution:
      "Each citizen buys a token representing a tree to be planted in Cuenca. Planting, care and growth are recorded on the blockchain and shown on a map.",
    features: ["One token per sponsored tree", "Immutable history of tree events", "Map with each tree's location"],
    architecture: ["Startup presented at the Hult Prize at Universidad del Azuay (Feb 2026)."],
    role: "Startup team member: business model and platform design.",
  },
  "belta-collective": {
    tagline: "E-commerce store",
    kind: "Real client · freelance",
    problem: "The brand needed to sell online with a catalog, cart and payments, and to show up in search engines.",
    solution: "E-commerce site with catalog, cart, payment gateways, theme customization and on-page SEO.",
    features: ["Catalog and cart", "Payment gateways", "UX/UI improvements", "On-page SEO"],
    architecture: ["WordPress + e-commerce plugins, customized theme"],
    role: "Design, development, content upload and SEO.",
  },
  "pwa-recuerdos": {
    name: "Memories PWA",
    tagline: "Installable app with daily notifications",
    kind: "Personal project",
    problem: "I wanted a gift that installs as a phone app and shows something different every day, with no server costs.",
    solution:
      "A framework-free PWA: day counter, daily phrase, photo gallery in Vercel Blob indexed in Google Sheets and scheduled push notifications.",
    features: ["Installable on Android and iOS", "Daily push notifications", "Gallery with protected upload", "Infrastructure cost: 0"],
    architecture: ["Static site + 2 serverless functions (GET/POST) on Vercel"],
    role: "Full development.",
  },
};

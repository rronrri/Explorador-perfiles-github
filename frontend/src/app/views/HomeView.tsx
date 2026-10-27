import Link from "next/link";
import { localize, PROJECTS, type Lang } from "../data/projects";
import LangSwitch, { localePath } from "./LangSwitch";

const T = {
  es: {
    intro:
      "Desarrollador full-stack e Ingeniero en Ciencias de la Computación (Universidad del Azuay). Construyo y despliego productos completos: modelo de datos, API, interfaz, pruebas e infraestructura.",
    highlights: [
      {
        label: "Publicación",
        title: "A Domain-Specific Language for Modeling and Implementing Agentic AI Workflows",
        detail: "Coautor · ICI2ST 2026, EPN Quito · MDPI Engineering Proceedings",
      },
      { label: "Emprendimiento", title: "Hult Prize 2026 · Universidad del Azuay", detail: "Miembro del equipo de PlantChain" },
      {
        label: "En producción",
        title: "ERP para una fábrica de joyería",
        detail: "FastAPI + PostgreSQL + Next.js, usado a diario por el cliente",
      },
    ],
    projects: "Proyectos",
    projectsNote:
      "Varios repositorios son privados o de clientes: cada uno tiene una demo interactiva con datos ficticios, sin exponer el código.",
    badge: { privado: "privado", cliente: "cliente", público: "público" },
    seeCase: "Ver caso y demo →",
    experience: "Experiencia",
    jobs: [
      { role: "Analista de TI e Innovación JR", org: "NovaCredit Banco Internacional", date: "2026" },
      { role: "Desarrollador Full-Stack Freelance", org: "ERP Fénix Global, Beltà Collective", date: "2025 – 2026" },
      { role: "Asistente de Sistemas", org: "MASOLUC – Cámara de Comercio", date: "2025" },
      { role: "Prácticas en Desarrollo Web", org: "Departamento de TI, Universidad del Azuay", date: "2025" },
    ],
    publicRepos: "Repos públicos",
    explorer: "Explorador de perfiles de GitHub →",
    explorerNote:
      "NestJS + Next.js. Consulta la API de GitHub a través de su propio backend; muestra mi perfil y repos públicos, o los de cualquier usuario.",
    footer: "Cuenca, Ecuador · Disponible para trabajo remoto",
  },
  en: {
    intro:
      "Full-stack developer and Computer Science engineer (Universidad del Azuay). I build and ship complete products: data model, API, UI, tests and infrastructure.",
    highlights: [
      {
        label: "Publication",
        title: "A Domain-Specific Language for Modeling and Implementing Agentic AI Workflows",
        detail: "Co-author · ICI2ST 2026, EPN Quito · MDPI Engineering Proceedings",
      },
      { label: "Startup", title: "Hult Prize 2026 · Universidad del Azuay", detail: "PlantChain team member" },
      {
        label: "In production",
        title: "ERP for a jewelry factory",
        detail: "FastAPI + PostgreSQL + Next.js, used daily by the client",
      },
    ],
    projects: "Projects",
    projectsNote:
      "Several repositories are private or belong to clients: each one has an interactive demo with mock data, without exposing the code.",
    badge: { privado: "private", cliente: "client", público: "public" },
    seeCase: "See case study & demo →",
    experience: "Experience",
    jobs: [
      { role: "Junior IT & Innovation Analyst", org: "NovaCredit Banco Internacional", date: "2026" },
      { role: "Freelance Full-Stack Developer", org: "Fénix Global ERP, Beltà Collective", date: "2025 – 2026" },
      { role: "IT Systems Assistant", org: "MASOLUC – Chamber of Commerce", date: "2025" },
      { role: "Web Development Intern", org: "IT Department, Universidad del Azuay", date: "2025" },
    ],
    publicRepos: "Public repos",
    explorer: "GitHub profile explorer →",
    explorerNote:
      "NestJS + Next.js. Calls the GitHub API through its own backend; shows my profile and public repos, or anyone else's.",
    footer: "Cuenca, Ecuador · Available for remote work",
  },
};

export default function HomeView({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <main lang={lang} className="mx-auto w-full max-w-6xl px-5 py-12 sm:py-16">
      <header className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-sm text-merged">rodrigo@portfolio:~$ whoami</p>
          <LangSwitch lang={lang} path="/" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Rodrigo Ortiz Barahona</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted">{t.intro}</p>
        <div className="flex flex-wrap gap-2 text-sm">
          {/* El CV del idioma actual va primero */}
          {(lang === "en" ? (["en", "es"] as const) : (["es", "en"] as const)).map((l, i) => (
            <a
              key={l}
              href={`/cv/RodrigoOrtiz_CV_${l}.pdf`}
              className={
                i === 0 ? "rounded-md bg-ink px-4 py-2 font-semibold text-paper" : "rounded-md border border-ink px-4 py-2 font-semibold"
              }
            >
              CV ({l.toUpperCase()})
            </a>
          ))}
          <a href="https://github.com/rronrri" target="_blank" rel="noreferrer" className="rounded-md border border-line bg-card px-4 py-2">
            GitHub ↗
          </a>
          <a
            href="https://www.linkedin.com/in/rodrigo-ortiz-b7a879232/"
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-line bg-card px-4 py-2"
          >
            LinkedIn ↗
          </a>
          <a href="mailto:rodrigooba10@gmail.com" className="rounded-md border border-line bg-card px-4 py-2">
            rodrigooba10@gmail.com
          </a>
        </div>
      </header>

      <section className="mt-12 grid gap-3 md:grid-cols-3">
        {t.highlights.map((h) => (
          <article key={h.label} className="rounded-xl border border-line bg-card p-4">
            <p className="font-mono text-xs uppercase tracking-wide text-merged">{h.label}</p>
            <p className="mt-2 font-semibold leading-snug">{h.title}</p>
            <p className="mt-1 text-sm text-muted">{h.detail}</p>
          </article>
        ))}
      </section>

      <section id="proyectos" className="mt-16 scroll-mt-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-2xl font-bold">{t.projects}</h2>
          <p className="max-w-md text-sm text-muted">{t.projectsNote}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((raw) => {
            const p = localize(raw, lang);
            return (
              <Link
                key={p.slug}
                href={localePath(lang, `/proyectos/${p.slug}`)}
                className="group flex flex-col overflow-hidden rounded-xl border border-line bg-card transition hover:-translate-y-0.5 hover:border-ink"
              >
                <div className="h-1.5" style={{ background: p.accent }} />
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <div className="flex items-center justify-between font-mono text-xs text-muted">
                    <span>{p.kind}</span>
                    <span className="rounded border border-line px-1.5">{t.badge[p.visibility]}</span>
                  </div>
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  <p className="text-sm text-muted">{p.tagline}</p>
                  <p className="mt-auto pt-3 font-mono text-xs text-muted">{p.stack.slice(0, 4).join(" · ")}</p>
                  <span className="text-sm font-semibold text-merged">{t.seeCase}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-16 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-bold">{t.experience}</h2>
          <ul className="divide-y divide-line rounded-xl border border-line bg-card">
            {t.jobs.map((e) => (
              <li key={e.role} className="flex justify-between gap-3 p-4">
                <div>
                  <p className="font-semibold">{e.role}</p>
                  <p className="text-sm text-muted">{e.org}</p>
                </div>
                <span className="whitespace-nowrap font-mono text-xs text-muted">{e.date}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-bold">{t.publicRepos}</h2>
          <Link href="/explorador" className="block rounded-xl border border-line bg-card p-5 transition hover:border-ink">
            <p className="font-semibold">{t.explorer}</p>
            <p className="mt-1 text-sm text-muted">{t.explorerNote}</p>
          </Link>
        </div>
      </section>

      <footer className="mt-16 border-t border-line pt-6 font-mono text-xs text-muted">{t.footer}</footer>
    </main>
  );
}

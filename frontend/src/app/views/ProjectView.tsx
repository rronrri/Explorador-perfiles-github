import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, PROJECTS, type Lang } from "../data/projects";
import Showcase from "./Showcase";
import LangSwitch, { localePath } from "./LangSwitch";

const T = {
  es: {
    back: "← proyectos",
    demo: "El sistema funcionando",
    visibility: {
      privado: "Repositorio privado · código no publicado",
      cliente: "Proyecto para cliente · código no publicable",
      público: "Proyecto público",
    },
    problem: "Problema",
    solution: "Solución",
    features: "Funcionalidades",
    architecture: "Arquitectura",
    role: "Mi rol:",
    privateCode: "El código fuente no es público. Puedo mostrarlo en vivo durante una entrevista técnica.",
    next: "Siguiente proyecto",
  },
  en: {
    back: "← projects",
    demo: "The system in action",
    visibility: {
      privado: "Private repository · code not published",
      cliente: "Client project · code cannot be published",
      público: "Public project",
    },
    problem: "Problem",
    solution: "Solution",
    features: "Features",
    architecture: "Architecture",
    role: "My role:",
    privateCode: "The source code is not public. I can walk through it live during a technical interview.",
    next: "Next project",
  },
};

export function projectParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export function projectMetadata(slug: string, lang: Lang): Metadata {
  const project = getProject(slug, lang);
  return project ? { title: `${project.name} · Rodrigo Ortiz`, description: project.tagline } : {};
}

export default function ProjectView({ slug, lang }: { slug: string; lang: Lang }) {
  const project = getProject(slug, lang);
  if (!project) notFound();
  const t = T[lang];

  const index = PROJECTS.findIndex((p) => p.slug === slug);
  const next = getProject(PROJECTS[(index + 1) % PROJECTS.length].slug, lang)!;

  return (
    <main lang={lang} className="mx-auto w-full max-w-5xl px-5 py-10">
      <div className="flex items-center justify-between gap-4">
        <Link href={`${localePath(lang, "/")}#proyectos`} className="font-mono text-sm text-muted hover:text-ink">
          {t.back}
        </Link>
        <LangSwitch lang={lang} path={`/proyectos/${slug}`} />
      </div>

      <header className="mt-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="rounded px-2 py-0.5 text-white" style={{ background: project.accent }}>
            {project.kind}
          </span>
          <span className="text-muted">{project.year}</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">{project.name}</h1>
        <p className="text-lg text-muted">{project.tagline}</p>
        <ul className="flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <li key={s} className="rounded border border-line bg-card px-2 py-0.5 font-mono text-xs">
              {s}
            </li>
          ))}
        </ul>
      </header>

      <section className="mt-8 rounded-xl border border-line bg-card p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold">{t.demo}</h2>
          <p className="font-mono text-xs text-muted">{t.visibility[project.visibility]}</p>
        </div>
        <Showcase slug={project.slug} lang={lang} />
      </section>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section>
          <h2 className="mb-2 font-mono text-xs uppercase tracking-wide text-muted">{t.problem}</h2>
          <p className="leading-relaxed">{project.problem}</p>
        </section>
        <section>
          <h2 className="mb-2 font-mono text-xs uppercase tracking-wide text-muted">{t.solution}</h2>
          <p className="leading-relaxed">{project.solution}</p>
        </section>
        <section>
          <h2 className="mb-2 font-mono text-xs uppercase tracking-wide text-muted">{t.features}</h2>
          <ul className="list-disc space-y-1 pl-5">
            {project.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="mb-2 font-mono text-xs uppercase tracking-wide text-muted">{t.architecture}</h2>
          <ul className="list-disc space-y-1 pl-5">
            {project.architecture.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-line bg-paper p-4 text-sm">
        <b>{t.role}</b> {project.role}
        {project.links?.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="ml-3 text-merged underline">
            {l.label} ↗
          </a>
        ))}
        {project.visibility !== "público" && <p className="mt-2 text-muted">{t.privateCode}</p>}
      </section>

      <Link
        href={localePath(lang, `/proyectos/${next.slug}`)}
        className="mt-10 flex items-center justify-between rounded-lg border border-line bg-card p-4 transition hover:border-ink"
      >
        <span className="text-sm text-muted">{t.next}</span>
        <span className="font-semibold">{next.name} →</span>
      </Link>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, PROJECTS } from "../../data/projects";
import Demo from "../../demos/Demo";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = getProject((await params).slug);
  return project ? { title: `${project.name} · Rodrigo Ortiz`, description: project.tagline } : {};
}

const VISIBILITY = {
  privado: "Repositorio privado · demo simulada con datos ficticios",
  cliente: "Proyecto para cliente · código no publicable",
  público: "Proyecto público",
};

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const index = PROJECTS.indexOf(project);
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-10">
      <Link href="/#proyectos" className="font-mono text-sm text-muted hover:text-ink">
        ← proyectos
      </Link>

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
          <h2 className="text-lg font-semibold">Demo interactiva</h2>
          <p className="font-mono text-xs text-muted">{VISIBILITY[project.visibility]}</p>
        </div>
        <p className="mb-5 text-sm text-muted">{project.demoNote}</p>
        <Demo id={project.demo} />
      </section>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section>
          <h2 className="mb-2 font-mono text-xs uppercase tracking-wide text-muted">Problema</h2>
          <p className="leading-relaxed">{project.problem}</p>
        </section>
        <section>
          <h2 className="mb-2 font-mono text-xs uppercase tracking-wide text-muted">Solución</h2>
          <p className="leading-relaxed">{project.solution}</p>
        </section>
        <section>
          <h2 className="mb-2 font-mono text-xs uppercase tracking-wide text-muted">Funcionalidades</h2>
          <ul className="list-disc space-y-1 pl-5">
            {project.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="mb-2 font-mono text-xs uppercase tracking-wide text-muted">Arquitectura</h2>
          <ul className="list-disc space-y-1 pl-5">
            {project.architecture.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-line bg-paper p-4 text-sm">
        <b>Mi rol:</b> {project.role}
        {project.links?.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="ml-3 text-merged underline">
            {l.label} ↗
          </a>
        ))}
        {project.visibility !== "público" && (
          <p className="mt-2 text-muted">
            El código fuente no es público. Puedo mostrarlo en vivo durante una entrevista técnica.
          </p>
        )}
      </section>

      <Link
        href={`/proyectos/${next.slug}`}
        className="mt-10 flex items-center justify-between rounded-lg border border-line bg-card p-4 transition hover:border-ink"
      >
        <span className="text-sm text-muted">Siguiente proyecto</span>
        <span className="font-semibold">{next.name} →</span>
      </Link>
    </main>
  );
}

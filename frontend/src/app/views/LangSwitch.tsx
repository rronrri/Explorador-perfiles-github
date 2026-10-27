import Link from "next/link";
import type { Lang } from "../data/projects";

// Rutas: español sin prefijo (/...), inglés con /en (/en/...)
export function localePath(lang: Lang, path: string) {
  return lang === "en" ? `/en${path === "/" ? "" : path}` : path;
}

export default function LangSwitch({ lang, path }: { lang: Lang; path: string }) {
  const option = (l: Lang, label: string) => (
    <Link
      href={localePath(l, path)}
      hrefLang={l}
      aria-current={l === lang ? "page" : undefined}
      className={`rounded px-2 py-1 ${l === lang ? "bg-ink text-paper" : "text-muted hover:text-ink"}`}
    >
      {label}
    </Link>
  );
  return (
    <nav aria-label="Idioma / Language" className="flex gap-1 rounded-md border border-line bg-card p-0.5 font-mono text-xs">
      {option("es", "ES")}
      {option("en", "EN")}
    </nav>
  );
}

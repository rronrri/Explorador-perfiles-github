"use client";

import { FormEvent, useEffect, useState } from "react";
import ProfileCard from "./components/ProfileCard";
import RepoList from "./components/RepoList";
import type { GithubRepo, GithubUser } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const DEFAULT_USERNAME = "rronrri";

export default function Home() {
  const [user, setUser] = useState<GithubUser | null>(null);
  const [repos, setRepos] = useState<GithubRepo[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(DEFAULT_USERNAME);

  async function loadUser(username: string) {
    const path = `/user/${encodeURIComponent(username)}`;
    setLoading(true);
    setError(null);
    try {
      const [res, reposRes] = await Promise.all([
        fetch(`${API_URL}${path}`),
        fetch(`${API_URL}${path}/repos`),
      ]);
      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.message ?? "Error al consultar el perfil");
      }
      setUser(body as GithubUser);
      setRepos(reposRes.ok ? ((await reposRes.json()) as GithubRepo[]) : null);
    } catch (err) {
      setUser(null);
      setRepos(null);
      setError(
        err instanceof Error && err.message !== "Failed to fetch"
          ? err.message
          : "No se pudo conectar con el servidor, intenta de nuevo",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser(DEFAULT_USERNAME);
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const username = search.trim().replace(/^@/, "");
    if (username) loadUser(username);
  }

  function handleClear() {
    setUser(null);
    setRepos(null);
    setError(null);
    setSearch("");
  }

  // Mantiene el perfil anterior en pantalla durante una nueva búsqueda
  // para evitar el salto al layout centrado (parpadeo)
  const hasProfile = user !== null;

  const sharedRepos =
    repos && user
      ? repos.filter(
          (r) => r.owner.toLowerCase() !== user.login.toLowerCase(),
        ).length
      : null;

  const searchPanel = (
    <>
      <header>
        <div className="flex items-center gap-3">
          <svg
            viewBox="0 0 16 16"
            aria-hidden
            className="h-8 w-8 shrink-0 fill-ink"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <h1 className="text-2xl font-bold tracking-tight">
            Explorador de perfiles de GitHub
          </h1>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Escribe un usuario de GitHub para ver su perfil y sus repositorios.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="flex w-full items-stretch overflow-hidden rounded-lg border border-line bg-card focus-within:border-merged focus-within:ring-2 focus-within:ring-merged/20"
      >
        <span
          aria-hidden
          className="flex select-none items-center border-r border-line bg-paper px-3 font-mono text-sm text-muted"
        >
          @
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="usuario de GitHub"
          aria-label="Usuario de GitHub"
          className="min-w-0 flex-1 bg-transparent px-3 py-3 font-mono text-sm text-ink outline-none placeholder:text-muted/60"
        />
        {(user || error) && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Limpiar búsqueda"
            title="Limpiar búsqueda"
            className="px-2 font-mono text-sm text-muted transition hover:text-closed"
          >
            ✕
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="m-1.5 rounded-md bg-merged px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          Buscar
        </button>
      </form>

      {loading && (
        <p
          aria-live="polite"
          className="animate-pulse font-mono text-sm text-muted"
        >
          Buscando perfil…
        </p>
      )}
      {!loading && error && (
        <div className="w-full rounded-lg border border-closed/30 bg-closed-soft p-5">
          <p className="font-mono text-xs font-semibold uppercase tracking-wide text-closed">
            error
          </p>
          <p className="mt-1 text-sm text-ink">{error}</p>
        </div>
      )}
    </>
  );

  // Sin perfil que mostrar: buscador centrado en la pantalla
  if (!hasProfile) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <div className="flex w-full max-w-xl flex-col gap-6">{searchPanel}</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-5 py-8 lg:h-screen lg:overflow-hidden lg:px-10">
      <div className="mx-auto flex h-full max-w-7xl flex-col gap-8 lg:flex-row">
        {/* Columna izquierda: búsqueda + perfil */}
        <aside className="flex flex-col gap-6 lg:w-[420px] lg:shrink-0 lg:overflow-y-auto lg:pr-1">
          {searchPanel}
          <div className={loading ? "opacity-40 transition-opacity" : ""}>
            <ProfileCard user={user} sharedRepos={sharedRepos} />
          </div>
        </aside>

        {/* Columna derecha: repositorios con scroll propio */}
        {repos && (
          <section
            className={`min-w-0 flex-1 lg:overflow-y-auto lg:pr-1 ${
              loading ? "opacity-40 transition-opacity" : ""
            }`}
          >
            <RepoList repos={repos} username={user.login} />
          </section>
        )}
      </div>
    </main>
  );
}

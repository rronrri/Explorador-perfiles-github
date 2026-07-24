import type { GithubRepo } from "../types";

interface RepoListProps {
  repos: GithubRepo[];
  username: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-EC", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function RepoList({ repos, username }: RepoListProps) {
  const memberCount = repos.filter(
    (r) => r.owner.toLowerCase() !== username.toLowerCase(),
  ).length;

  if (repos.length === 0) {
    return (
      <section className="w-full rounded-xl border border-line bg-card p-6 text-center">
        <p className="font-mono text-sm text-muted">
          Este perfil no tiene repositorios públicos.
        </p>
      </section>
    );
  }

  return (
    <section className="w-full">
      <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-muted">
        repositorios · {repos.length}
        {memberCount > 0 && (
          <span className="ml-2 normal-case tracking-normal">
            ({repos.length - memberCount} propios + {memberCount} como miembro)
          </span>
        )}
      </h3>
      <ul className="overflow-hidden rounded-xl border border-line bg-card">
        {repos.map((repo, i) => (
          <li
            key={repo.name}
            className={i > 0 ? "border-t border-line" : undefined}
          >
            <a
              href={repo.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-5 py-4 transition hover:bg-paper"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-semibold text-merged">
                  {repo.name}
                </span>
                {repo.isFork && (
                  <span className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                    fork
                  </span>
                )}
                {repo.owner.toLowerCase() !== username.toLowerCase() && (
                  <span className="rounded-full bg-merged-soft px-2 py-0.5 text-[10px] uppercase tracking-wide text-merged">
                    miembro · {repo.owner}
                  </span>
                )}
              </div>
              {repo.description && (
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {repo.description}
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-muted">
                {repo.language && (
                  <span>
                    <span aria-hidden className="mr-1 text-open">
                      ●
                    </span>
                    {repo.language}
                  </span>
                )}
                <span>★ {repo.stars}</span>
                <span>⑂ {repo.forks}</span>
                <span className="ml-auto">
                  actualizado {formatDate(repo.updatedAt)}
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

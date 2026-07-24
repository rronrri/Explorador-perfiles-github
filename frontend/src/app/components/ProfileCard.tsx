import Image from "next/image";
import type { GithubUser } from "../types";

interface ProfileCardProps {
  user: GithubUser;
  sharedRepos: number | null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-EC", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ProfileCard({ user, sharedRepos }: ProfileCardProps) {
  const stats = [
    { label: "repos propios", value: user.publicRepos },
    { label: "compartidos", value: sharedRepos ?? "—" },
    { label: "seguidores", value: user.followers },
    { label: "siguiendo", value: user.following },
  ];

  const chips = [
    user.location && { icon: "◎", text: user.location },
    user.company && { icon: "⌂", text: user.company },
    user.twitterUsername && { icon: "@", text: user.twitterUsername },
  ].filter(Boolean) as { icon: string; text: string }[];

  return (
    <article className="w-full max-w-xl overflow-hidden rounded-xl border border-line bg-card shadow-sm">
      <div className="p-6 sm:p-8">
        <div className="flex items-start gap-5">
          <Image
            src={user.avatarUrl}
            alt={`Avatar de ${user.login}`}
            width={96}
            height={96}
            className="h-20 w-20 rounded-full border border-line sm:h-24 sm:w-24"
          />
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-bold sm:text-2xl">
              {user.name ?? user.login}
            </h2>
            <a
              href={user.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-merged hover:underline"
            >
              @{user.login}
            </a>
            {user.bio && (
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {user.bio}
              </p>
            )}
            {chips.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <li
                    key={chip.text}
                    className="rounded-full border border-line bg-paper px-2.5 py-1 text-xs text-muted"
                  >
                    <span aria-hidden className="mr-1 text-merged">
                      {chip.icon}
                    </span>
                    {chip.text}
                  </li>
                ))}
              </ul>
            )}
            {user.blog && (
              <a
                href={
                  user.blog.startsWith("http")
                    ? user.blog
                    : `https://${user.blog}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block truncate font-mono text-xs text-merged hover:underline"
              >
                {user.blog}
              </a>
            )}
          </div>
        </div>
      </div>

      <dl className="grid grid-cols-2 border-t border-line sm:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`p-4 text-center ${i > 0 ? "border-l border-line" : ""} ${
              i >= 2 ? "max-sm:border-t max-sm:border-line" : ""
            } ${i === 2 ? "max-sm:border-l-0" : ""}`}
          >
            <dd className="font-mono text-2xl font-semibold text-ink">
              {stat.value}
            </dd>
            <dt className="mt-0.5 font-mono text-[11px] uppercase tracking-widest text-muted">
              {stat.label}
            </dt>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-paper px-6 py-3">
        <span className="font-mono text-xs text-muted">
          en GitHub desde {formatDate(user.createdAt)} · {user.publicGists}{" "}
          gists
        </span>
        <a
          href={user.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs font-semibold text-merged hover:underline"
        >
          ver en github ↗
        </a>
      </div>
    </article>
  );
}

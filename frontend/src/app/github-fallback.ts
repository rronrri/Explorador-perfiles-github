import type { GithubRepo, GithubUser } from "./types";

// Respaldo si el backend (Render, plan gratuito) está dormido o caído: consulta la API
// pública de GitHub desde el navegador y devuelve los mismos campos que el endpoint propio.
const GITHUB = "https://api.github.com";

export async function fetchFromGithub(username: string): Promise<{ user: GithubUser; repos: GithubRepo[] }> {
  const name = encodeURIComponent(username);
  const [u, r] = await Promise.all([
    fetch(`${GITHUB}/users/${name}`),
    fetch(`${GITHUB}/users/${name}/repos?type=all&sort=updated&per_page=100`),
  ]);
  if (u.status === 404) throw new Error(`El usuario de GitHub "${username}" no existe`);
  if (!u.ok) throw new Error("No se pudo consultar GitHub, intenta de nuevo");
  const d = await u.json();
  const user: GithubUser = {
    login: d.login,
    name: d.name ?? null,
    bio: d.bio ?? null,
    avatarUrl: d.avatar_url,
    publicRepos: d.public_repos,
    publicGists: d.public_gists,
    followers: d.followers,
    following: d.following,
    location: d.location ?? null,
    company: d.company ?? null,
    blog: d.blog || null,
    twitterUsername: d.twitter_username ?? null,
    htmlUrl: d.html_url,
    createdAt: d.created_at,
  };
  const repos: GithubRepo[] = r.ok
    ? ((await r.json()) as Record<string, never>[]).map((repo: Record<string, never>) => ({
        name: repo.name,
        owner: (repo.owner as { login: string }).login,
        description: repo.description ?? null,
        language: repo.language ?? null,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        isFork: repo.fork,
        htmlUrl: repo.html_url,
        updatedAt: repo.updated_at,
      }))
    : [];
  return { user, repos };
}

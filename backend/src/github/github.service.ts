import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { GithubRepoDto, GithubUserDto } from './github-user.dto';

const GITHUB_API_URL = 'https://api.github.com';
// Reglas de GitHub: alfanumérico y guiones, sin guion inicial/final, máx 39 chars
const USERNAME_PATTERN = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
const FETCH_TIMEOUT_MS = 8_000;

@Injectable()
export class GithubService {
  private async fetchGithub(
    path: string,
    username: string,
  ): Promise<unknown> {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'nacer-digital-github-profile-app',
    };
    // Con token la cuota de GitHub sube de 60 a 5000 req/hora
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    let response: Response;
    try {
      response = await fetch(`${GITHUB_API_URL}${path}`, {
        headers,
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
    } catch {
      throw new HttpException(
        'La API de GitHub no respondió a tiempo',
        HttpStatus.GATEWAY_TIMEOUT,
      );
    }

    if (response.status === 404) {
      throw new NotFoundException(
        `El usuario de GitHub "${username}" no existe`,
      );
    }

    if (response.status === 403 || response.status === 429) {
      throw new HttpException(
        'Límite de peticiones a la API de GitHub alcanzado, intenta más tarde',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    if (!response.ok) {
      throw new HttpException(
        'Error al consultar la API de GitHub',
        HttpStatus.BAD_GATEWAY,
      );
    }

    return response.json();
  }

  private validateUsername(username: string): void {
    if (!USERNAME_PATTERN.test(username)) {
      throw new BadRequestException('Username de GitHub inválido');
    }
  }

  async getUser(username: string): Promise<GithubUserDto> {
    this.validateUsername(username);

    const data = (await this.fetchGithub(
      `/users/${encodeURIComponent(username)}`,
      username,
    )) as Record<string, unknown>;

    return {
      login: data.login as string,
      name: (data.name as string) ?? null,
      bio: (data.bio as string) ?? null,
      avatarUrl: data.avatar_url as string,
      publicRepos: data.public_repos as number,
      publicGists: data.public_gists as number,
      followers: data.followers as number,
      following: data.following as number,
      location: (data.location as string) ?? null,
      company: (data.company as string) ?? null,
      blog: (data.blog as string) || null,
      twitterUsername: (data.twitter_username as string) ?? null,
      htmlUrl: data.html_url as string,
      createdAt: data.created_at as string,
    };
  }

  async getRepos(username: string): Promise<GithubRepoDto[]> {
    this.validateUsername(username);

    const data = (await this.fetchGithub(
      `/users/${encodeURIComponent(username)}/repos?type=all&sort=updated&per_page=100`,
      username,
    )) as Record<string, unknown>[];

    return data.map((repo) => ({
      name: repo.name as string,
      owner: (repo.owner as Record<string, unknown>).login as string,
      description: (repo.description as string) ?? null,
      language: (repo.language as string) ?? null,
      stars: repo.stargazers_count as number,
      forks: repo.forks_count as number,
      isFork: repo.fork as boolean,
      htmlUrl: repo.html_url as string,
      updatedAt: repo.updated_at as string,
    }));
  }
}

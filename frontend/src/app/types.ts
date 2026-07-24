export interface GithubRepo {
  name: string;
  owner: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  isFork: boolean;
  htmlUrl: string;
  updatedAt: string;
}

export interface GithubUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  publicRepos: number;
  publicGists: number;
  followers: number;
  following: number;
  location: string | null;
  company: string | null;
  blog: string | null;
  twitterUsername: string | null;
  htmlUrl: string;
  createdAt: string;
}

import { Controller, Get, Param } from '@nestjs/common';
import { GithubService } from './github.service';
import type { GithubRepoDto, GithubUserDto } from './github-user.dto';

@Controller('user')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get(':username')
  getUser(@Param('username') username: string): Promise<GithubUserDto> {
    return this.githubService.getUser(username);
  }

  @Get(':username/repos')
  getRepos(@Param('username') username: string): Promise<GithubRepoDto[]> {
    return this.githubService.getRepos(username);
  }
}

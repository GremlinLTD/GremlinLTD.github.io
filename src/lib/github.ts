import { parse } from 'yaml';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  topics: string[];
}

interface ProjectConfig {
  pinned: string[];
  hidden: string[];
}

interface Config {
  projects: ProjectConfig;
  tools: Tool[];
}

export interface Tool {
  name: string;
  description: string;
  url: string;
  install: string;
  category: string;
}

function loadConfig(): Config {
  const configPath = join(process.cwd(), 'src/data/config.yaml');
  const raw = readFileSync(configPath, 'utf-8');
  return parse(raw) as Config;
}

export async function fetchPublicRepos(): Promise<GitHubRepo[]> {
  const config = loadConfig();
  const token = import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(
    'https://api.github.com/orgs/GremlinLTD/repos?type=public&per_page=100',
    { headers }
  );

  if (!response.ok) {
    console.warn(`GitHub API returned ${response.status}, using empty repo list`);
    return [];
  }

  const repos: GitHubRepo[] = await response.json();

  const filtered = repos.filter(r =>
    !config.projects.hidden.includes(r.name) &&
    !r.name.startsWith('template-')
  );

  const pinned: GitHubRepo[] = [];
  const unpinned: GitHubRepo[] = [];

  for (const repo of filtered) {
    if (config.projects.pinned.includes(repo.name)) {
      pinned.push(repo);
    } else {
      unpinned.push(repo);
    }
  }

  pinned.sort((a, b) =>
    config.projects.pinned.indexOf(a.name) - config.projects.pinned.indexOf(b.name)
  );

  unpinned.sort((a, b) =>
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  return [...pinned, ...unpinned];
}

export function loadTools(): Tool[] {
  const config = loadConfig();
  return config.tools;
}

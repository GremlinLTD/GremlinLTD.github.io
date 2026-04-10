# GremlinLTD.github.io Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static GitHub Pages site for GremlinLTD that serves as a hub for public projects, recommended tools, engineering guides, and team onboarding.

**Architecture:** Astro static site with content collections for MDX-based guides and onboarding docs. GitHub API fetched at build time for project data. YAML config for tools and project ordering. GitHub Actions for deployment with nightly scheduled rebuilds.

**Tech Stack:** Astro, bun, MDX, TypeScript, CSS custom properties (brand tokens), GitHub Actions

**Spec:** `docs/superpowers/specs/2026-04-10-github-pages-site-design.md`

**Brand guide reference:** `/Users/trozz/git/gremlin/brand-guide/` (design tokens, colours, voice, typography)

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`

- [ ] **Step 1: Initialise Astro project with bun**

Run:
```bash
cd /Users/trozz/git/gremlin/git-site
bun create astro@latest . -- --template minimal --no-install --typescript strict
```

If the interactive prompt blocks, use:
```bash
cd /Users/trozz/git/gremlin/git-site
bun add astro@latest
```

Then create `astro.config.mjs`:
```javascript
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://gremlinltd.github.io',
  integrations: [mdx()],
});
```

And `tsconfig.json`:
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "strictNullChecks": true
  }
}
```

- [ ] **Step 2: Install dependencies**

Run:
```bash
cd /Users/trozz/git/gremlin/git-site
bun add @astrojs/mdx
bun add yaml
```

- [ ] **Step 3: Update .gitignore**

Ensure `.gitignore` contains:
```
node_modules/
dist/
.astro/
.superpowers/
.DS_Store
```

- [ ] **Step 4: Verify build works**

Run:
```bash
cd /Users/trozz/git/gremlin/git-site
bun run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add package.json bun.lock astro.config.mjs tsconfig.json .gitignore src/
git commit -m "feat: scaffold Astro project with bun and MDX"
```

---

### Task 2: Design Tokens & Global Styles

**Files:**
- Create: `src/styles/global.css`
- Create: `src/styles/tokens.css`

- [ ] **Step 1: Create design tokens CSS**

Create `src/styles/tokens.css` with all brand guide CSS custom properties. Source values from the brand guide's `design-tokens.json` and `styles/main.css`.

Light mode tokens in `:root`, dark mode tokens in `[data-theme="dark"]` and `@media (prefers-color-scheme: dark)` (for users without a stored preference).

```css
:root {
    /* Primary Colours */
    --electric-teal: #00D4AA;
    --electric-teal-text: #009E7E;
    --deep-midnight: #1A1F36;

    /* Secondary Colours */
    --energetic-coral: #FF6B6B;
    --bright-sky: #4ECDC4;

    /* Neutral Palette */
    --cloud-grey: #F7F9FB;
    --steel-grey: #95A1B5;
    --charcoal: #556178;

    /* Supplementary UI Colours */
    --warning-orange: #FFB84D;
    --success-green: #10B981;
    --data-purple: #8B5CF6;
    --info-blue: #0EA5E9;

    /* Semantic Mappings */
    --color-primary: var(--electric-teal);
    --color-primary-text: var(--electric-teal-text);
    --color-text: var(--deep-midnight);
    --color-text-secondary: var(--charcoal);
    --color-text-muted: var(--steel-grey);
    --color-bg: #ffffff;
    --color-bg-secondary: var(--cloud-grey);
    --color-border: #e2e8f0;
    --color-cta: var(--energetic-coral);

    /* Spacing Scale */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 1.5rem;
    --space-xl: 2rem;
    --space-2xl: 3rem;
    --space-3xl: 4rem;
    --space-4xl: 6rem;
}

[data-theme="dark"] {
    --color-bg: #0A0D1A;
    --color-bg-secondary: #141829;
    --color-text: #E8EBF0;
    --color-text-secondary: #A8B2C7;
    --color-text-muted: #6B7280;
    --color-border: #2A3142;
    --color-primary: #00E5BB;
    --color-primary-text: #00E5BB;
    --color-cta: #FF7A7A;
    --electric-teal: #00E5BB;
    --bright-sky: #5DD9D0;
}

@media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
        --color-bg: #0A0D1A;
        --color-bg-secondary: #141829;
        --color-text: #E8EBF0;
        --color-text-secondary: #A8B2C7;
        --color-text-muted: #6B7280;
        --color-border: #2A3142;
        --color-primary: #00E5BB;
        --color-primary-text: #00E5BB;
        --color-cta: #FF7A7A;
        --electric-teal: #00E5BB;
        --bright-sky: #5DD9D0;
    }
}
```

- [ ] **Step 2: Create global styles**

Create `src/styles/global.css` importing tokens and setting base typography, resets, and utility styles:

```css
@import './tokens.css';

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: var(--color-text);
    background: var(--color-bg);
}

code, pre {
    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
}

:focus-visible {
    outline: 2px solid var(--electric-teal);
    outline-offset: 2px;
}

a {
    color: var(--color-primary-text);
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--space-lg);
}
```

- [ ] **Step 3: Verify build**

Run:
```bash
cd /Users/trozz/git/gremlin/git-site
bun run build
```

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/styles/tokens.css src/styles/global.css
git commit -m "feat: add brand design tokens and global styles"
```

---

### Task 3: Base Layout & Navigation

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Nav.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/ThemeToggle.astro`

- [ ] **Step 1: Create ThemeToggle component**

Create `src/components/ThemeToggle.astro`:

```astro
---
---
<button id="theme-toggle" aria-label="Toggle dark mode" type="button">
  <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
  <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
</button>

<style>
  #theme-toggle {
    background: none;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    padding: 0.4rem;
    cursor: pointer;
    color: var(--color-text);
    display: flex;
    align-items: center;
  }
  #theme-toggle:hover {
    border-color: var(--electric-teal);
  }
  .icon-moon { display: none; }
  :global([data-theme="dark"]) .icon-sun { display: none; }
  :global([data-theme="dark"]) .icon-moon { display: block; }
</style>

<script is:inline>
  (function() {
    const stored = localStorage.getItem('theme');
    if (stored) {
      document.documentElement.setAttribute('data-theme', stored);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  })();

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
</script>
```

- [ ] **Step 2: Create Nav component**

Create `src/components/Nav.astro`:

```astro
---
import ThemeToggle from './ThemeToggle.astro';

const pathname = Astro.url.pathname;
const links = [
  { href: '/projects/', label: 'Projects' },
  { href: '/tools/', label: 'Tools' },
  { href: '/guides/', label: 'Guides' },
  { href: '/onboarding/', label: 'Onboarding' },
];
---
<nav class="nav">
  <div class="nav-inner container">
    <a href="/" class="nav-logo">Gremlin LTD</a>
    <button class="nav-hamburger" aria-label="Toggle menu" type="button">
      <span></span><span></span><span></span>
    </button>
    <div class="nav-links">
      {links.map(link => (
        <a href={link.href} class:list={['nav-link', { active: pathname.startsWith(link.href) }]}>
          {link.label}
        </a>
      ))}
      <ThemeToggle />
    </div>
  </div>
</nav>

<style>
  .nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
    backdrop-filter: blur(8px);
  }
  .nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 3.5rem;
  }
  .nav-logo {
    font-weight: 700;
    font-size: 1.125rem;
    color: var(--color-text);
    text-decoration: none;
  }
  .nav-links {
    display: flex;
    align-items: center;
    gap: var(--space-lg);
  }
  .nav-link {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: color 0.2s;
  }
  .nav-link:hover, .nav-link.active {
    color: var(--electric-teal);
    text-decoration: none;
  }
  .nav-hamburger {
    display: none;
    flex-direction: column;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
  }
  .nav-hamburger span {
    display: block;
    width: 20px;
    height: 2px;
    background: var(--color-text);
    transition: all 0.3s;
  }

  @media (max-width: 768px) {
    .nav-hamburger { display: flex; }
    .nav-links {
      display: none;
      position: absolute;
      top: 3.5rem;
      left: 0;
      right: 0;
      background: var(--color-bg);
      border-bottom: 1px solid var(--color-border);
      flex-direction: column;
      padding: var(--space-lg);
      gap: var(--space-md);
    }
    .nav-links.open { display: flex; }
  }
</style>

<script is:inline>
  document.querySelector('.nav-hamburger')?.addEventListener('click', () => {
    document.querySelector('.nav-links')?.classList.toggle('open');
  });
</script>
```

- [ ] **Step 3: Create Footer component**

Create `src/components/Footer.astro`:

```astro
---
---
<footer class="footer">
  <div class="container">
    <p>Gremlin LTD &mdash; Technical excellence without the jargon</p>
    <p class="footer-links">
      <a href="https://github.com/GremlinLTD" target="_blank" rel="noopener">GitHub</a>
    </p>
  </div>
</footer>

<style>
  .footer {
    border-top: 1px solid var(--color-border);
    padding: var(--space-2xl) 0;
    color: var(--color-text-muted);
    font-size: 0.875rem;
    text-align: center;
  }
  .footer-links {
    margin-top: var(--space-sm);
  }
  .footer-links a {
    color: var(--color-text-muted);
  }
  .footer-links a:hover {
    color: var(--electric-teal);
  }
</style>
```

- [ ] **Step 4: Create BaseLayout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Gremlin LTD - Open source projects, tools, and engineering guides.' } = Astro.props;
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title} | Gremlin LTD</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={`${title} | Gremlin LTD`} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
</head>
<body>
  <Nav />
  <main>
    <slot />
  </main>
  <Footer />
</body>
</html>
```

- [ ] **Step 5: Update index page to use layout**

Replace `src/pages/index.astro` with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Home">
  <div class="container" style="padding: var(--space-3xl) 0;">
    <h1>Gremlin LTD</h1>
    <p>Coming soon.</p>
  </div>
</BaseLayout>
```

- [ ] **Step 6: Verify dev server**

Run:
```bash
cd /Users/trozz/git/gremlin/git-site
bun run dev
```

Expected: Site loads at localhost, nav renders with all links, theme toggle works, responsive hamburger works on narrow viewport.

- [ ] **Step 7: Commit**

```bash
git add src/layouts/BaseLayout.astro src/components/Nav.astro src/components/Footer.astro src/components/ThemeToggle.astro src/pages/index.astro
git commit -m "feat: add base layout with navigation, footer, and theme toggle"
```

---

### Task 4: GitHub API Integration & Config

**Files:**
- Create: `src/lib/github.ts`
- Create: `src/data/config.yaml`

- [ ] **Step 1: Create config.yaml with project ordering and tools**

Create `src/data/config.yaml`:

```yaml
projects:
  pinned:
    - space-investigator
    - aws-ssh-config
  hidden: []

tools:
  - name: bun
    description: Fast JavaScript runtime, bundler, and package manager
    url: https://bun.sh
    install: "curl -fsSL https://bun.sh/install | bash"
    category: Package Managers

  - name: uv
    description: Fast Python package installer and resolver
    url: https://github.com/astral-sh/uv
    install: "curl -LsSf https://astral.sh/uv/install.sh | sh"
    category: Package Managers

  - name: starship
    description: Minimal, fast, customisable shell prompt
    url: https://starship.rs
    install: "brew install starship"
    category: Shell & Terminal

  - name: jq
    description: Lightweight command-line JSON processor
    url: https://jqlang.github.io/jq/
    install: "brew install jq"
    category: Data Processing

  - name: yq
    description: Command-line YAML, JSON, and XML processor
    url: https://github.com/mikefarah/yq
    install: "brew install yq"
    category: Data Processing

  - name: pv
    description: Monitor the progress of data through a pipe
    url: https://www.ivarch.com/programs/pv.shtml
    install: "brew install pv"
    category: Data Processing

  - name: tfenv
    description: Terraform version manager
    url: https://github.com/tfutils/tfenv
    install: "brew install tfenv"
    category: Infrastructure

  - name: stern
    description: Multi pod and container log tailing for Kubernetes
    url: https://github.com/stern/stern
    install: "brew install stern"
    category: Kubernetes

  - name: krew
    description: Plugin manager for kubectl
    url: https://krew.sigs.k8s.io
    install: "brew install krew"
    category: Kubernetes

  - name: prek
    description: Preview Kubernetes manifests before applying
    url: https://github.com/vitobotta/prek
    install: "brew install prek"
    category: Kubernetes
```

- [ ] **Step 2: Create GitHub API fetch module**

Create `src/lib/github.ts`:

```typescript
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

  const filtered = repos.filter(r => !config.projects.hidden.includes(r.name));

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
```

- [ ] **Step 3: Verify build with new files**

Run:
```bash
cd /Users/trozz/git/gremlin/git-site
bun run build
```

Expected: Build succeeds (modules are not yet imported by pages, but should compile).

- [ ] **Step 4: Commit**

```bash
git add src/lib/github.ts src/data/config.yaml
git commit -m "feat: add GitHub API integration and site config"
```

---

### Task 5: Projects Page

**Files:**
- Create: `src/components/ProjectCard.astro`
- Create: `src/pages/projects.astro`

- [ ] **Step 1: Create ProjectCard component**

Create `src/components/ProjectCard.astro`:

```astro
---
interface Props {
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  updatedAt: string;
}

const { name, description, url, homepage, language, stars, updatedAt } = Astro.props;

const updated = new Date(updatedAt).toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});
---
<a href={url} target="_blank" rel="noopener" class="project-card">
  <div class="project-card-header">
    <h3>{name}</h3>
    {homepage && (
      <a href={homepage} target="_blank" rel="noopener" class="demo-link" onclick="event.stopPropagation()">
        Live Demo
      </a>
    )}
  </div>
  {description && <p class="project-desc">{description}</p>}
  <div class="project-meta">
    {language && <span class="project-lang">{language}</span>}
    {stars > 0 && <span class="project-stars">{stars} stars</span>}
    <span class="project-updated">Updated {updated}</span>
  </div>
</a>

<style>
  .project-card {
    display: block;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: var(--space-lg);
    text-decoration: none;
    color: inherit;
    transition: border-color 0.2s, transform 0.2s;
  }
  .project-card:hover {
    border-color: var(--electric-teal);
    transform: translateY(-2px);
    text-decoration: none;
  }
  .project-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-sm);
  }
  .project-card-header h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text);
  }
  .demo-link {
    font-size: 0.75rem;
    color: var(--electric-teal);
    border: 1px solid var(--electric-teal);
    border-radius: 4px;
    padding: 0.15rem 0.5rem;
  }
  .project-desc {
    color: var(--color-text-secondary);
    font-size: 0.875rem;
    margin-bottom: var(--space-md);
  }
  .project-meta {
    display: flex;
    gap: var(--space-md);
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }
</style>
```

- [ ] **Step 2: Create projects page**

Create `src/pages/projects.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ProjectCard from '../components/ProjectCard.astro';
import { fetchPublicRepos } from '../lib/github';

const repos = await fetchPublicRepos();
---
<BaseLayout title="Projects" description="Open source projects from Gremlin LTD">
  <div class="container page-section">
    <h1>Projects</h1>
    <p class="page-lead">Our open source work. Tools, libraries, and infrastructure components.</p>

    <div class="projects-grid">
      {repos.map(repo => (
        <ProjectCard
          name={repo.name}
          description={repo.description}
          url={repo.html_url}
          homepage={repo.homepage}
          language={repo.language}
          stars={repo.stargazers_count}
          updatedAt={repo.updated_at}
        />
      ))}
    </div>

    {repos.length === 0 && (
      <p class="empty-state">No projects found. Check back soon.</p>
    )}
  </div>
</BaseLayout>

<style>
  .page-section {
    padding: var(--space-3xl) 0;
  }
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: var(--space-sm);
  }
  .page-lead {
    color: var(--color-text-secondary);
    font-size: 1.125rem;
    margin-bottom: var(--space-2xl);
  }
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--space-lg);
  }
  .empty-state {
    color: var(--color-text-muted);
    text-align: center;
    padding: var(--space-3xl) 0;
  }
</style>
```

- [ ] **Step 3: Verify build**

Run:
```bash
cd /Users/trozz/git/gremlin/git-site
bun run build
```

Expected: Build succeeds, GitHub API is called, projects page is generated. Check `dist/projects/index.html` contains repo cards.

- [ ] **Step 4: Commit**

```bash
git add src/components/ProjectCard.astro src/pages/projects.astro
git commit -m "feat: add projects page with GitHub API integration"
```

---

### Task 6: Tools Page

**Files:**
- Create: `src/pages/tools.astro`
- Create: `src/components/ToolCard.astro`

- [ ] **Step 1: Create ToolCard component**

Create `src/components/ToolCard.astro`:

```astro
---
interface Props {
  name: string;
  description: string;
  url: string;
  install: string;
}

const { name, description, url, install } = Astro.props;
---
<div class="tool-card">
  <div class="tool-header">
    <a href={url} target="_blank" rel="noopener" class="tool-name">{name}</a>
  </div>
  <p class="tool-desc">{description}</p>
  <div class="tool-install">
    <code>{install}</code>
    <button class="copy-btn" data-copy={install} aria-label={`Copy install command for ${name}`} type="button">
      Copy
    </button>
  </div>
</div>

<style>
  .tool-card {
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: var(--space-lg);
  }
  .tool-name {
    font-weight: 600;
    font-size: 1.125rem;
    color: var(--color-text);
  }
  .tool-name:hover {
    color: var(--electric-teal);
  }
  .tool-desc {
    color: var(--color-text-secondary);
    font-size: 0.875rem;
    margin: var(--space-sm) 0 var(--space-md);
  }
  .tool-install {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    padding: var(--space-sm) var(--space-md);
    overflow-x: auto;
  }
  .tool-install code {
    font-size: 0.8rem;
    flex: 1;
    white-space: nowrap;
    color: var(--color-text-secondary);
  }
  .copy-btn {
    font-size: 0.75rem;
    background: none;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    padding: 0.2rem 0.5rem;
    cursor: pointer;
    color: var(--color-text-muted);
    white-space: nowrap;
  }
  .copy-btn:hover {
    border-color: var(--electric-teal);
    color: var(--electric-teal);
  }
</style>
```

- [ ] **Step 2: Create tools page**

Create `src/pages/tools.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ToolCard from '../components/ToolCard.astro';
import { loadTools } from '../lib/github';

const tools = loadTools();

const categories = [...new Set(tools.map(t => t.category))];
const toolsByCategory = categories.map(cat => ({
  name: cat,
  tools: tools.filter(t => t.category === cat),
}));
---
<BaseLayout title="Tools" description="Recommended developer tools from the Gremlin LTD team">
  <div class="container page-section">
    <h1>Recommended Tools</h1>
    <p class="page-lead">Tools we use daily. Battle-tested, worth installing.</p>

    {toolsByCategory.map(category => (
      <section class="tool-category">
        <h2>{category.name}</h2>
        <div class="tools-grid">
          {category.tools.map(tool => (
            <ToolCard
              name={tool.name}
              description={tool.description}
              url={tool.url}
              install={tool.install}
            />
          ))}
        </div>
      </section>
    ))}
  </div>
</BaseLayout>

<script is:inline>
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      if (text) {
        navigator.clipboard.writeText(text);
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      }
    });
  });
</script>

<style>
  .page-section {
    padding: var(--space-3xl) 0;
  }
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: var(--space-sm);
  }
  .page-lead {
    color: var(--color-text-secondary);
    font-size: 1.125rem;
    margin-bottom: var(--space-2xl);
  }
  .tool-category {
    margin-bottom: var(--space-2xl);
  }
  .tool-category h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: var(--space-lg);
    color: var(--color-text);
  }
  .tools-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--space-lg);
  }
</style>
```

- [ ] **Step 3: Verify build**

Run:
```bash
cd /Users/trozz/git/gremlin/git-site
bun run build
```

Expected: Build succeeds, `dist/tools/index.html` contains categorised tool cards.

- [ ] **Step 4: Commit**

```bash
git add src/components/ToolCard.astro src/pages/tools.astro
git commit -m "feat: add tools page with categorised tool list"
```

---

### Task 7: Content Collections (Guides & Onboarding)

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/guides/conventional-commits.mdx`
- Create: `src/content/onboarding/getting-started.mdx`
- Create: `src/pages/guides/index.astro`
- Create: `src/pages/guides/[slug].astro`
- Create: `src/pages/onboarding/index.astro`
- Create: `src/pages/onboarding/[slug].astro`
- Create: `src/layouts/GuideLayout.astro`

- [ ] **Step 1: Define content collections**

Create `src/content.config.ts` at the `src/` root:

```typescript
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

const onboarding = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/onboarding' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    step: z.number(),
  }),
});

export const collections = { guides, onboarding };
```

- [ ] **Step 2: Create initial guide content**

Create `src/content/guides/conventional-commits.mdx`:

```mdx
---
title: "Conventional Commits Cheatsheet"
description: "Our take on commit types, scopes, and examples. Keep your git history clean and useful."
date: 2026-04-10
tags: ["git", "workflow"]
---

A quick reference for writing consistent, meaningful commit messages. Based on the [Conventional Commits](https://www.conventionalcommits.org/) spec with our own additions.

## Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

## Types

| Type | When to use | Example |
|------|------------|---------|
| `feat` | New feature | `feat(auth): add SSO login` |
| `fix` | Bug fix | `fix(api): handle null response from upstream` |
| `docs` | Documentation only | `docs: update API examples in README` |
| `style` | Formatting, no code change | `style: fix indentation in config` |
| `refactor` | Code change that neither fixes nor adds | `refactor(db): extract query builder` |
| `perf` | Performance improvement | `perf(search): add index on user_email` |
| `test` | Adding or fixing tests | `test(auth): add login flow integration tests` |
| `chore` | Build, CI, tooling | `chore: update GitHub Actions to v4` |
| `ci` | CI/CD changes | `ci: add nightly build schedule` |
| `build` | Build system or dependencies | `build: upgrade Astro to 5.x` |
| `revert` | Reverting a previous commit | `revert: undo feat(auth) SSO login` |

## Scopes

Scopes are optional but useful. Use the area of the codebase being changed:

- `auth`, `api`, `ui`, `db`, `config`, `ci`, `deps`
- Keep them short, consistent, and lowercase

## Breaking Changes

Add `!` after the type/scope or use the `BREAKING CHANGE:` footer:

```
feat(api)!: change authentication to OAuth2

BREAKING CHANGE: API key authentication is no longer supported.
All clients must migrate to OAuth2 tokens.
```

## Good Commit Messages

- Start with lowercase after the colon
- Use imperative mood ("add" not "added" or "adds")
- Keep the first line under 72 characters
- Use the body for "why", not "what" (the diff shows what)

## Examples

```
feat(projects): add star count to project cards

Show GitHub star count on each project card to help
visitors gauge project popularity at a glance.
```

```
fix(nav): prevent menu staying open after navigation

The mobile hamburger menu remained open when clicking
a nav link. Now closes on any link click.
```

```
chore(deps): update astro to 5.2.0
```
```

- [ ] **Step 3: Create initial onboarding content**

Create `src/content/onboarding/getting-started.mdx`:

```mdx
---
title: "Getting Started"
description: "Prerequisites and first steps for new team members"
step: 1
---

Welcome to Gremlin LTD. Let's get you set up.

## Prerequisites

Before you start, make sure you have:

- macOS, Linux, or WSL2 on Windows
- A GitHub account added to the [GremlinLTD](https://github.com/GremlinLTD) org
- Terminal access (iTerm2, Alacritty, or the built-in terminal)

## First Steps

1. **Install Homebrew** (macOS/Linux):

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. **Install core tools:**

```bash
brew install bun starship jq yq git
```

3. **Set up your shell:**

Add to your shell config (`~/.zshrc` or `~/.bashrc`):

```bash
eval "$(starship init zsh)"
```

4. **Clone this site** to verify everything works:

```bash
git clone git@github.com:GremlinLTD/GremlinLTD.github.io.git
cd GremlinLTD.github.io
bun install
bun run dev
```

If you see the site running locally, you're good to go.

## Next Steps

Check out the [Recommended Tools](/tools/) page for the full list of tools we use, and the [Conventional Commits](/guides/conventional-commits/) guide for our commit message format.
```

- [ ] **Step 4: Create GuideLayout**

Create `src/layouts/GuideLayout.astro`:

```astro
---
import BaseLayout from './BaseLayout.astro';

interface Props {
  title: string;
  description: string;
  date?: Date;
  tags?: string[];
  backLink: string;
  backLabel: string;
}

const { title, description, date, tags, backLink, backLabel } = Astro.props;
---
<BaseLayout title={title} description={description}>
  <article class="container guide-article">
    <a href={backLink} class="back-link">&larr; {backLabel}</a>
    <h1>{title}</h1>
    {date && (
      <time class="guide-date" datetime={date.toISOString()}>
        {date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
      </time>
    )}
    {tags && tags.length > 0 && (
      <div class="guide-tags">
        {tags.map(tag => <span class="tag">{tag}</span>)}
      </div>
    )}
    <div class="guide-content">
      <slot />
    </div>
  </article>
</BaseLayout>

<style>
  .guide-article {
    padding: var(--space-3xl) 0;
    max-width: 800px;
  }
  .back-link {
    display: inline-block;
    font-size: 0.875rem;
    color: var(--color-text-muted);
    margin-bottom: var(--space-lg);
  }
  .back-link:hover {
    color: var(--electric-teal);
    text-decoration: none;
  }
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: var(--space-sm);
  }
  .guide-date {
    display: block;
    color: var(--color-text-muted);
    font-size: 0.875rem;
    margin-bottom: var(--space-sm);
  }
  .guide-tags {
    display: flex;
    gap: var(--space-sm);
    margin-bottom: var(--space-2xl);
  }
  .tag {
    font-size: 0.75rem;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    padding: 0.15rem 0.5rem;
    color: var(--color-text-muted);
  }
  .guide-content {
    line-height: 1.7;
  }
  .guide-content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin: var(--space-2xl) 0 var(--space-md);
  }
  .guide-content :global(h3) {
    font-size: 1.25rem;
    font-weight: 600;
    margin: var(--space-xl) 0 var(--space-sm);
  }
  .guide-content :global(p) {
    margin-bottom: var(--space-md);
    color: var(--color-text-secondary);
  }
  .guide-content :global(pre) {
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    padding: var(--space-md);
    overflow-x: auto;
    margin-bottom: var(--space-md);
    font-size: 0.875rem;
  }
  .guide-content :global(code:not(pre code)) {
    background: var(--color-bg-secondary);
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
    font-size: 0.875em;
  }
  .guide-content :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: var(--space-md);
    font-size: 0.875rem;
  }
  .guide-content :global(th),
  .guide-content :global(td) {
    border: 1px solid var(--color-border);
    padding: var(--space-sm) var(--space-md);
    text-align: left;
  }
  .guide-content :global(th) {
    background: var(--color-bg-secondary);
    font-weight: 600;
  }
  .guide-content :global(ul),
  .guide-content :global(ol) {
    margin-bottom: var(--space-md);
    padding-left: var(--space-xl);
    color: var(--color-text-secondary);
  }
  .guide-content :global(li) {
    margin-bottom: var(--space-xs);
  }
</style>
```

- [ ] **Step 5: Create guides listing page**

Create `src/pages/guides/index.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

const guides = (await getCollection('guides')).sort(
  (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
);
---
<BaseLayout title="Guides" description="Engineering guides, cheatsheets, and reference material from Gremlin LTD">
  <div class="container page-section">
    <h1>Guides</h1>
    <p class="page-lead">Cheatsheets, references, and things we wish we'd written down sooner.</p>

    <div class="guides-list">
      {guides.map(guide => (
        <a href={`/guides/${guide.id}/`} class="guide-item">
          <h3>{guide.data.title}</h3>
          <p>{guide.data.description}</p>
          <div class="guide-item-meta">
            <time datetime={guide.data.date.toISOString()}>
              {guide.data.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </time>
            {guide.data.tags.length > 0 && (
              <div class="guide-item-tags">
                {guide.data.tags.map(tag => <span class="tag">{tag}</span>)}
              </div>
            )}
          </div>
        </a>
      ))}
    </div>
  </div>
</BaseLayout>

<style>
  .page-section { padding: var(--space-3xl) 0; }
  h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: var(--space-sm); }
  .page-lead { color: var(--color-text-secondary); font-size: 1.125rem; margin-bottom: var(--space-2xl); }
  .guides-list { display: flex; flex-direction: column; gap: var(--space-md); }
  .guide-item {
    display: block;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: var(--space-lg);
    text-decoration: none;
    color: inherit;
    transition: border-color 0.2s;
  }
  .guide-item:hover { border-color: var(--electric-teal); text-decoration: none; }
  .guide-item h3 { font-size: 1.125rem; font-weight: 600; margin-bottom: var(--space-xs); color: var(--color-text); }
  .guide-item p { color: var(--color-text-secondary); font-size: 0.875rem; margin-bottom: var(--space-sm); }
  .guide-item-meta { display: flex; align-items: center; gap: var(--space-md); font-size: 0.75rem; color: var(--color-text-muted); }
  .guide-item-tags { display: flex; gap: var(--space-xs); }
  .tag { font-size: 0.7rem; background: var(--color-bg); border: 1px solid var(--color-border); border-radius: 3px; padding: 0.1rem 0.4rem; }
</style>
```

- [ ] **Step 6: Create guide detail page**

Create `src/pages/guides/[slug].astro`:

```astro
---
import GuideLayout from '../../layouts/GuideLayout.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const guides = await getCollection('guides');
  return guides.map(guide => ({
    params: { slug: guide.id },
    props: { guide },
  }));
}

const { guide } = Astro.props;
const { Content } = await render(guide);
---
<GuideLayout
  title={guide.data.title}
  description={guide.data.description}
  date={guide.data.date}
  tags={guide.data.tags}
  backLink="/guides/"
  backLabel="All Guides"
>
  <Content />
</GuideLayout>
```

- [ ] **Step 7: Create onboarding listing page**

Create `src/pages/onboarding/index.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

const steps = (await getCollection('onboarding')).sort(
  (a, b) => a.data.step - b.data.step
);
---
<BaseLayout title="Onboarding" description="Getting started at Gremlin LTD">
  <div class="container page-section">
    <h1>Onboarding</h1>
    <p class="page-lead">Everything you need to get set up and shipping.</p>

    <div class="steps-list">
      {steps.map(step => (
        <a href={`/onboarding/${step.id}/`} class="step-item">
          <span class="step-number">{step.data.step}</span>
          <div>
            <h3>{step.data.title}</h3>
            <p>{step.data.description}</p>
          </div>
        </a>
      ))}
    </div>
  </div>
</BaseLayout>

<style>
  .page-section { padding: var(--space-3xl) 0; }
  h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: var(--space-sm); }
  .page-lead { color: var(--color-text-secondary); font-size: 1.125rem; margin-bottom: var(--space-2xl); }
  .steps-list { display: flex; flex-direction: column; gap: var(--space-md); }
  .step-item {
    display: flex;
    align-items: center;
    gap: var(--space-lg);
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: var(--space-lg);
    text-decoration: none;
    color: inherit;
    transition: border-color 0.2s;
  }
  .step-item:hover { border-color: var(--electric-teal); text-decoration: none; }
  .step-number {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--electric-teal);
    min-width: 2.5rem;
    text-align: center;
  }
  .step-item h3 { font-size: 1.125rem; font-weight: 600; color: var(--color-text); margin-bottom: var(--space-xs); }
  .step-item p { color: var(--color-text-secondary); font-size: 0.875rem; }
</style>
```

- [ ] **Step 8: Create onboarding detail page**

Create `src/pages/onboarding/[slug].astro`:

```astro
---
import GuideLayout from '../../layouts/GuideLayout.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const steps = await getCollection('onboarding');
  return steps.map(step => ({
    params: { slug: step.id },
    props: { step },
  }));
}

const { step } = Astro.props;
const { Content } = await render(step);
---
<GuideLayout
  title={step.data.title}
  description={step.data.description}
  backLink="/onboarding/"
  backLabel="All Steps"
>
  <Content />
</GuideLayout>
```

- [ ] **Step 9: Verify build**

Run:
```bash
cd /Users/trozz/git/gremlin/git-site
bun run build
```

Expected: Build succeeds. Check that these files exist:
- `dist/guides/index.html`
- `dist/guides/conventional-commits/index.html`
- `dist/onboarding/index.html`
- `dist/onboarding/getting-started/index.html`

- [ ] **Step 10: Commit**

```bash
git add src/content.config.ts src/content/ src/layouts/GuideLayout.astro src/pages/guides/ src/pages/onboarding/
git commit -m "feat: add guides and onboarding content collections with initial content"
```

---

### Task 8: Homepage

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Build the homepage**

Replace `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { fetchPublicRepos } from '../lib/github';
import { loadTools } from '../lib/github';
import { getCollection } from 'astro:content';

const repos = await fetchPublicRepos();
const tools = loadTools();
const guides = await getCollection('guides');
const onboarding = await getCollection('onboarding');
---
<BaseLayout title="Home" description="Gremlin LTD - Open source projects, recommended tools, and engineering guides.">
  <section class="hero">
    <div class="container">
      <h1>Open Source & Resources</h1>
      <p class="hero-tagline">Our public projects, tooling recommendations, and engineering guides. Technical excellence without the jargon.</p>
    </div>
  </section>

  <section class="stats container">
    <div class="stats-grid">
      <div class="stat">
        <span class="stat-number">{repos.length}</span>
        <span class="stat-label">Public Repos</span>
      </div>
      <div class="stat">
        <span class="stat-number">{tools.length}</span>
        <span class="stat-label">Recommended Tools</span>
      </div>
      <div class="stat">
        <span class="stat-number">{guides.length}</span>
        <span class="stat-label">Guides</span>
      </div>
      <div class="stat">
        <span class="stat-number">{onboarding.length}</span>
        <span class="stat-label">Onboarding Steps</span>
      </div>
    </div>
  </section>

  <section class="sections container">
    <div class="sections-grid">
      <a href="/projects/" class="section-card">
        <h2>Projects</h2>
        <p>Open source tools, libraries, and infrastructure components from our team.</p>
      </a>
      <a href="/tools/" class="section-card">
        <h2>Tools</h2>
        <p>Developer tools we use daily. Battle-tested, worth installing.</p>
      </a>
      <a href="/guides/" class="section-card">
        <h2>Guides</h2>
        <p>Cheatsheets, references, and things we wish we'd written down sooner.</p>
      </a>
      <a href="/onboarding/" class="section-card">
        <h2>Onboarding</h2>
        <p>Everything you need to get set up and shipping.</p>
      </a>
    </div>
  </section>
</BaseLayout>

<style>
  .hero {
    background: linear-gradient(135deg, var(--deep-midnight) 0%, #2a3350 100%);
    color: white;
    padding: var(--space-4xl) 0;
    text-align: center;
  }
  .hero h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: var(--space-md);
  }
  .hero-tagline {
    color: var(--electric-teal);
    font-size: 1.25rem;
    max-width: 600px;
    margin: 0 auto;
  }
  .stats {
    padding: var(--space-2xl) 0;
  }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-lg);
    text-align: center;
  }
  .stat-number {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    color: var(--electric-teal);
  }
  .stat-label {
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }
  .sections {
    padding: 0 0 var(--space-4xl);
  }
  .sections-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: var(--space-lg);
  }
  .section-card {
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: var(--space-xl);
    text-decoration: none;
    color: inherit;
    transition: border-color 0.2s, transform 0.2s;
  }
  .section-card:hover {
    border-color: var(--electric-teal);
    transform: translateY(-2px);
    text-decoration: none;
  }
  .section-card h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: var(--space-sm);
    color: var(--color-text);
  }
  .section-card p {
    color: var(--color-text-secondary);
    font-size: 0.875rem;
  }

  @media (max-width: 768px) {
    .hero h1 { font-size: 2rem; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
  }
</style>
```

- [ ] **Step 2: Verify build and dev server**

Run:
```bash
cd /Users/trozz/git/gremlin/git-site
bun run build
```

Expected: Full site builds, homepage shows stats, all nav links work.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: build homepage with hero, stats, and section cards"
```

---

### Task 9: Favicon

**Files:**
- Create: `public/favicon.svg`

- [ ] **Step 1: Create a simple SVG favicon**

Create `public/favicon.svg` using the brand teal:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#1A1F36"/>
  <text x="16" y="23" font-family="system-ui, sans-serif" font-size="20" font-weight="700" fill="#00D4AA" text-anchor="middle">G</text>
</svg>
```

- [ ] **Step 2: Commit**

```bash
git add public/favicon.svg
git commit -m "feat: add favicon"
```

---

### Task 10: GitHub Actions Deployment

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create the deploy workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 3 * * *'  # Nightly rebuild at 3am UTC
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Install, build, and upload
        uses: withastro/action@v6
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Actions workflow for Pages deployment"
```

---

### Task 11: Final Verification

- [ ] **Step 1: Full build check**

Run:
```bash
cd /Users/trozz/git/gremlin/git-site
bun run build
```

Expected: Clean build, no warnings or errors.

- [ ] **Step 2: Dev server smoke test**

Run:
```bash
cd /Users/trozz/git/gremlin/git-site
bun run dev
```

Verify in browser:
- Homepage loads with hero, stats, section cards
- Nav links all work (Projects, Tools, Guides, Onboarding)
- Projects page shows GitHub repos
- Tools page shows categorised tools with copy buttons
- Guides listing shows conventional commits entry
- Guide detail page renders MDX content with proper formatting
- Onboarding listing shows step 1
- Onboarding detail page renders content
- Dark mode toggle works
- Mobile hamburger menu works
- All pages use brand colours and typography

- [ ] **Step 3: Check dist output**

```bash
ls -R dist/ | head -30
```

Expected: Static HTML files for all pages.

- [ ] **Step 4: Commit any fixes**

If anything needed fixing during smoke test, commit those fixes.

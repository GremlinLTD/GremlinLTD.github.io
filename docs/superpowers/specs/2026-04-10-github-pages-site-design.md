# GremlinLTD.github.io - Site Design Spec

## Overview

A static GitHub Pages site serving as a public directory of GremlinLTD's open source projects, recommended developer tools, engineering guides, and team onboarding documentation. Built with Astro and bun, deployed via GitHub Actions.

## Goals

- Provide a central hub for all public GremlinLTD projects and resources
- Make it easy for team members to add new content (guides, tools, onboarding docs) without touching framework code
- Match the Gremlin LTD brand guide in design, voice, and tone
- Stay up-to-date with public repos automatically

## Tech Stack

- **Framework:** Astro (static site generation)
- **Package manager:** bun
- **Deployment:** GitHub Actions to GitHub Pages
- **Content format:** MDX (Markdown with components) via Astro content collections
- **Configuration:** YAML for tools and project ordering

## Site Structure

```
gremlinltd.github.io/
├── /                    # Homepage - hero, stats, featured content
├── /projects/           # Auto-generated project directory
├── /tools/              # Recommended dev tools
├── /guides/             # Content collection (conventional commits, dotfiles, etc.)
│   └── /[slug]/         # Individual guide pages
└── /onboarding/         # Team setup guides
    └── /[slug]/         # Individual onboarding step pages
```

## Repository Structure

```
src/
├── components/          # Shared UI (Nav, Footer, ThemeToggle, ProjectCard)
├── layouts/             # Base layout with nav, dark mode, brand tokens
├── pages/
│   ├── index.astro      # Homepage
│   ├── projects.astro   # Fetches GitHub API at build, renders cards
│   ├── tools.astro      # Recommended tools page
│   └── onboarding.astro # Onboarding index (renders content collection)
├── content/
│   ├── guides/          # MDX files, one per guide
│   └── onboarding/      # MDX files for onboarding steps
├── lib/
│   ├── github.ts        # GitHub API fetch + pinning/ordering logic
│   └── brand.ts         # Design token constants from brand guide
└── data/
    └── config.yaml      # Pinned repos, ordering overrides, tool list
```

## Page Designs

### Homepage

- **Navigation:** Sticky top nav with logo, section links (Projects, Tools, Guides, Onboarding), dark mode toggle. Hamburger menu on mobile.
- **Hero:** Tagline using the brand mission statement, e.g. "Open Source & Resources"
- **Stats row:** Auto-counted metrics (public repos, tools listed, guides available)
- **Featured cards:** Links into each section with brief descriptions

### Projects Page

- Grid of cards fetched from GitHub API at build time
- Each card shows: repo name, description, primary language, stars, last updated date
- Links to the GitHub repo; shows a "Live Demo" link if `homepageUrl` is set
- Ordering controlled by `data/config.yaml`:

```yaml
projects:
  pinned:
    - space-investigator    # always first
    - aws-ssh-config        # always second
  hidden: []                # repos to exclude if needed
```

- Repos not in `pinned` appear after pinned ones, sorted by most recently updated

### Tools Page

- Categorised list from `data/config.yaml`
- Each tool entry: name, one-liner description, install command (copyable), link to project
- Categories: Package Managers, Shell & Terminal, Kubernetes, Data Processing, Infrastructure

```yaml
tools:
  - name: bun
    description: Fast JavaScript runtime, bundler, and package manager
    url: https://bun.sh
    install: "curl -fsSL https://bun.sh/install | bash"
    category: Package Managers
  - name: starship
    description: Minimal, fast, customisable shell prompt
    url: https://starship.rs
    install: "brew install starship"
    category: Shell & Terminal
  - name: stern
    description: Multi pod and container log tailing for Kubernetes
    url: https://github.com/stern/stern
    install: "brew install stern"
    category: Kubernetes
```

### Guides (Content Collection)

- Astro content collection using MDX
- Frontmatter schema: title, description, date, tags
- Auto-generated listing page with all guides
- Individual guide pages with auto-generated table of contents from headings
- Initial content: Conventional Commits Cheatsheet

```mdx
---
title: "Conventional Commits Cheatsheet"
description: "Our take on commit types, scopes, and examples"
date: 2026-04-10
tags: ["git", "workflow"]
---
```

### Onboarding (Content Collection)

- Same MDX approach as guides
- Ordered by a `step` frontmatter field for sequential flow
- Steps cover: prerequisites, tools to install, repo access, local environment setup

```mdx
---
title: "Install Core Tools"
description: "Get your development environment ready"
step: 2
---
```

## Design System

All styling derives from the Gremlin LTD brand guide. Design tokens are sourced from the brand guide repo's `design-tokens.json` and translated into CSS custom properties during implementation.

### Colours

- **Primary:** Electric Teal (#00D4AA), Deep Midnight (#1A1F36)
- **Secondary:** Energetic Coral (#FF6B6B), Bright Sky (#4ECDC4)
- **Neutrals:** Cloud Grey (#F7F9FB), Steel Grey (#95A1B5), Charcoal (#556178)
- **Dark mode:** Full token set from brand guide (bg #0A0D1A, surface #141829, teal #00E5BB, etc.)

### Typography

- **Font stack:** System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, etc.)
- **Mono:** SF Mono, Monaco, Cascadia Code, Roboto Mono, Consolas
- **Headings:** h1 2.5rem/700, h2 2rem/600, h3 1.5rem/600
- **Body:** 1rem/1.6 line-height

### Spacing

- Scale: xs (4px), sm (8px), md (16px), lg (24px), xl (32px), 2xl (48px), 3xl (64px), 4xl (96px)

### Theme Switching

- CSS custom properties for all tokens
- `prefers-color-scheme` media query for system detection
- Manual toggle stores preference in `localStorage`
- Dark mode tokens already defined in brand guide

## Brand Voice

All copy on the site follows the brand voice guidelines:

- **Direct, friendly, confident, honest, helpful, transparent**
- No corporate buzzwords, no jargon, no excessive formality
- Technical content written in plain English
- Example: "Let's get your environment sorted" not "Please configure your development environment"

## Deployment

### GitHub Actions Workflow

- **Trigger on push to `main`:** Build and deploy to GitHub Pages
- **Nightly scheduled rebuild:** Keeps project data fresh from GitHub API
- **Manual `workflow_dispatch`:** On-demand rebuild trigger

### GitHub API Integration

- Fetch public repos from `GremlinLTD` org at build time
- Merge with `config.yaml` for pinning/ordering/hiding
- Uses the `GITHUB_TOKEN` automatically available in Actions (5,000 requests/hr) to avoid unauthenticated rate limits

## Content Authoring

Content authors never need to touch Astro components or layouts:

- **New guide:** Add an MDX file to `src/content/guides/`
- **New onboarding step:** Add an MDX file to `src/content/onboarding/`
- **New tool:** Add an entry to `src/data/config.yaml`
- **Reorder projects:** Edit `pinned` list in `src/data/config.yaml`

The framework handles listing pages, navigation, and rendering automatically.

## Non-Goals

- No CMS or admin interface
- No server-side rendering (pure static)
- No search (can be added later if needed)
- No analytics (can be added later if needed)
- No comments or user-generated content

# Slug Security Website

Astro + React islands + Tailwind v4. Posts content lives in the `src/posts` submodule.

## Setup

```bash
nix develop
git submodule update --init --recursive
bun install
```

## Development

```bash
bun run dev          # astro dev server
bun run build        # fetch:events + astro check + astro build
bun run preview      # preview production build
```

## Deployment

GitHub Pages, via `.github/workflows/deploy.yml`. Triggers on push to `main` and on a 30-minute cron so the calendar feed stays fresh.

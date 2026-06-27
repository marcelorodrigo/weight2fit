# Garmin Tools

## Tech Stack

- **Framework**: Nuxt 4, SPA mode (`ssr: false`)
- **UI**: Nuxt UI v4, TailwindCSS v4
- **Package Manager**: pnpm 11.8.0
- **Node**: 26.x (see `.node-version`, `.nvmrc`)
- **TypeScript**: 6.0.3

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server at `localhost:3000` |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build |
| `pnpm lint` | ESLint v10 flat config (from `eslint.config.mjs`) |
| `pnpm typecheck` | `nuxt typecheck` (vue-tsc) |
| `pnpm test` | `vitest run` — runs all tests once |
| `pnpm test:watch` | `vitest` — runs tests in watch mode |
| `pnpm postinstall` | `nuxt prepare` — generates `.nuxt/` types. Runs automatically on install. |

## Required: Run lint + typecheck + test before committing

```bash
pnpm lint && pnpm typecheck && pnpm test
```

CI (`.github/workflows/ci.yml`) runs `pnpm install` → `pnpm run lint` → `pnpm run typecheck` → `pnpm run test` on every push/PR to `master`.

## Lint specifics

- ESLint flat config via `eslint.config.mjs`, imports `./.nuxt/eslint.config.mjs`
- Nuxt ESLint stylistic: `commaDangle: never`, `braceStyle: 1tbs`

## Testing

- **Framework**: Vitest 4 via `@nuxt/test-utils` 4
- **Config**: `vitest.config.ts` with three projects:
  - `unit` — Node environment, no Nuxt runtime, in `test/unit/`
  - `nuxt` — Nuxt runtime environment, for components/composables, in `test/nuxt/`
  - `e2e` — Node environment, for end-to-end tests, in `test/e2e/`
- **Run tests**: `pnpm test`
- **Run a specific project**: `npx vitest --project unit`
- **Helpers**: `mountSuspended` / `renderSuspended` from `@nuxt/test-utils/runtime`
- **Nuxt DevTools**: Vitest integration available via `@nuxt/test-utils/module` (already in `nuxt.config.ts`)

## Generated files

`.nuxt/` is gitignored but required for typechecking and ESLint. Run `pnpm install` (or `nuxt prepare`) to regenerate.

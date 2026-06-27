# Architecture Spec: Garmin Weight FIT File Generator

## Overview

A new `/weight` route provides a browser-only form for entering body composition measurements. On submit, `@garmin/fitsdk` (already installed) encodes a valid FIT binary entirely on the client, which is then streamed to the user as a file download. No backend, no Garmin account integration. The index page (`/`) is left untouched as a landing/hub for future tools.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Route | `/weight` (new page) | Index stays as tool landing hub; each tool gets its own route |
| Validation | `UForm` `validate` prop with custom function | No validation library installed; adding one for 1 form is over-engineering |
| FIT encoding | Extracted to `app/composables/useWeightFit.ts` | Single Responsibility — encoding logic is independent of UI and independently testable |
| Form sections | `UCard` per section (Basic, Body Composition, Metabolic, Ratings) | Nuxt UI v4 idiomatic grouping; less overwhelming than a flat 13-field list |
| `userProfileIndex` | Hardcoded to `0`, not exposed in UI | Always `0` for single-user setups; no user confusion |
| Rating fields | `UInputNumber` with `min=1` / `max=9` | Garmin physique/visceral scales are 1–9 integers |
| Weight unit | Kilograms only | FIT spec stores kg natively; no conversion needed |
| Timestamp | `new Date()` at generation time | No historical imports in scope |
| Download | `Blob` + `URL.createObjectURL` + `<a>.click()` | Native browser API, no dependencies |
| Test framework | None currently — tests deferred until framework installed | `package.json` has no test script or test dependencies (see AGENTS.md) |

## Project Context

_This section is the single source of project conventions for the Implementer and Code Reviewer. Both agents must read this section and only perform additional exploration if a specific detail is missing._

### Structure

```
garmin-tools/
├── app/
│   ├── app.vue               # App shell: UApp > UHeader > UMain > NuxtPage > UFooter
│   ├── app.config.ts         # UI theme: primary=green, neutral=slate
│   ├── assets/css/main.css   # TailwindCSS + @nuxt/ui imports, custom green palette
│   ├── components/
│   │   ├── AppLogo.vue
│   │   └── TemplateMenu.vue
│   └── pages/
│       └── index.vue         # Starter landing page (leave untouched)
├── nuxt.config.ts            # ssr: false, modules: @nuxt/ui, @nuxt/eslint, @nuxtjs/seo
├── package.json              # @garmin/fitsdk@21.208.0 already in dependencies
└── eslint.config.mjs         # Flat config; stylistic: commaDangle: never, braceStyle: 1tbs
```

### Conventions

- **Naming:** PascalCase for Vue components (`WeightForm.vue`), camelCase for composables (`useWeightFit.ts`), kebab-case for page routes (`/weight` → `pages/weight.vue`)
- **Code style:** ESLint enforces `commaDangle: never` and `braceStyle: 1tbs`. TypeScript strict. `<script setup lang="ts">` for all SFCs.
- **Test style:** No framework installed. Tests cannot be added until a framework (e.g. Vitest) is configured.
- **DI pattern:** Composables via `use*` convention; state passed as arguments or returned as reactive refs.

### Dependencies

- **Runtime:** `nuxt@^4.4.8`, `@nuxt/ui@^4.9.0`, `tailwindcss@^4.3.1`, `@garmin/fitsdk@^21.208.0`, `@nuxtjs/seo@5.3.1`
- **Dev:** `@nuxt/eslint@^1.16.0`, `eslint@^10.5.0`, `typescript@^6.0.3`, `vue-tsc@^3.3.5`
- **No validation library installed** — no Zod, Valibot, Yup, or Joi.

### Patterns

- **SPA (`ssr: false`)** — all code runs in the browser; no server-side concerns.
- **File-based routing** — `app/pages/weight.vue` maps to `/weight`.
- **Nuxt UI v4 components** — `UForm`, `UFormField`, `UInputNumber`, `UInput`, `UCard`, `UButton`, `UPageHero`, `UBadge`, etc.
- **Composables** — extracted to `app/composables/` and auto-imported by Nuxt.
- **`useSeoMeta` + `useHead`** — used in `app.vue` and can be used per-page.

## Component Design

### Components / Modules

| Component | Input | Output | Description |
|-----------|-------|--------|-------------|
| `app/pages/weight.vue` | URL: `/weight` | Rendered page | Page component: form state, validation, submit handler, section layout |
| `app/composables/useWeightFit.ts` | `WeightFormState` | `Uint8Array` | Encodes a FIT file using `@garmin/fitsdk`; pure function logic wrapped in composable |

### Inputs / Outputs

#### `WeightFormState` (form reactive state)

All fields are `number | undefined` except `weight` which is `number | undefined` but required by validation.

| Field | FIT field | Type | Required | Validation |
|-------|-----------|------|----------|------------|
| `weight` | `weight` | `number` | Yes | > 0 |
| `percentFat` | `percentFat` | `number` | No | 0–100 |
| `percentHydration` | `percentHydration` | `number` | No | 0–100 |
| `visceralFatMass` | `visceralFatMass` | `number` | No | ≥ 0 |
| `boneMass` | `boneMass` | `number` | No | ≥ 0 |
| `muscleMass` | `muscleMass` | `number` | No | ≥ 0 |
| `basalMet` | `basalMet` | `number` | No | ≥ 0 |
| `physiqueRating` | `physiqueRating` | `number` | No | integer, 1–9 |
| `activeMet` | `activeMet` | `number` | No | ≥ 0 |
| `metabolicAge` | `metabolicAge` | `number` | No | integer, ≥ 1 |
| `visceralFatRating` | `visceralFatRating` | `number` | No | integer, 1–9 |
| `bmi` | `bmi` | `number` | No | > 0 |

`userProfileIndex` is NOT in the form state — hardcoded to `0` in the composable.

### Validators

Custom `validate` function inline in `weight.vue` (passed to `UForm`'s `:validate` prop):

```
validate(state: Partial<WeightFormState>): FormError[]
```

Rules:
- `weight`: required, must be a positive number (`> 0`)
- `percentFat`: if present, must be between 0 and 100
- `percentHydration`: if present, must be between 0 and 100
- `visceralFatMass`: if present, must be `≥ 0`
- `boneMass`: if present, must be `≥ 0`
- `muscleMass`: if present, must be `≥ 0`
- `basalMet`: if present, must be `≥ 0`
- `physiqueRating`: if present, must be integer between 1 and 9
- `activeMet`: if present, must be `≥ 0`
- `metabolicAge`: if present, must be integer `≥ 1`
- `visceralFatRating`: if present, must be integer between 1 and 9
- `bmi`: if present, must be `> 0`

### External Boundaries

| Interface | Implementation | External System | Purpose |
|-----------|---------------|-----------------|---------|
| `@garmin/fitsdk` Encoder | `Encoder` class from SDK | Browser memory | Encodes FIT binary from message objects |
| Browser download API | `Blob` + `URL.createObjectURL` + anchor click | Browser file system | Triggers `.fit` file download |

### Public Entry Points

| Element | Path / Trigger | Input | Output | Notes |
|---------|---------------|-------|--------|-------|
| Page route | `GET /weight` | — | Rendered form | SPA page |
| Form submit | `@submit` event on `UForm` | `WeightFormState` | `.fit` download | Validates, encodes, triggers download |

## Package Structure

```
garmin-tools/
└── app/
    ├── composables/
    │   └── useWeightFit.ts       ← NEW: FIT encoding logic
    └── pages/
        ├── index.vue             ← EXISTING (unchanged)
        └── weight.vue            ← NEW: /weight page with form
```

## Data Flow

```
User fills form (weight.vue)
  └── UForm :validate="validate"
        └── On submit: FormSubmitEvent<WeightFormState>
              └── onSubmit(event) calls useWeightFit(event.data)
                    └── useWeightFit.ts
                          ├── new Encoder()
                          ├── encoder.onMesg(FILE_ID, { type: 'weight', manufacturer: 'garmin', product: 2429, serialNumber: 0, timeCreated: new Date() })
                          ├── encoder.onMesg(WEIGHT_SCALE, { timestamp: new Date(), weight, ...optionalFields })
                          └── returns encoder.close() → Uint8Array
                    └── new Blob([bytes], { type: 'application/octet-stream' })
                    └── a.href = URL.createObjectURL(blob)
                    └── a.download = 'weight-<ISO-date>.fit'
                    └── a.click() → browser downloads file
```

## Error Handling

| Error | Surface | When |
|-------|---------|------|
| `weight` missing or zero | Inline form error via `UFormField` | `validate()` returns `[{ name: 'weight', message: 'Weight is required and must be greater than 0' }]` |
| Percentage out of range | Inline form error | `validate()` returns error for that field |
| Rating out of range | Inline form error | `validate()` returns error for that field |
| SDK encoding failure | `useToast()` error toast | Wrap `encoder.close()` in try/catch; surface with `useToast().add({ color: 'error', title: 'Failed to generate FIT file' })` |

## Test Strategy

> **Note:** The project has no test framework installed (`package.json` has no test script or test runner). The test strategy below defines what must be covered once a framework (Vitest is recommended — it is already a dev dependency of `@garmin/fitsdk` itself) is configured.

### `useWeightFit.ts` (unit tests — highest priority)

- Encodes a FIT file with only `weight` provided and returns a non-empty `Uint8Array`
- Encodes a FIT file with all optional fields populated
- Returned bytes decode correctly via `Decoder` (round-trip): `weight`, `percentFat`, `bmi` match inputs
- `timestamp` and `timeCreated` are set to `Date` instances (not raw numbers)
- `userProfileIndex` is always `0` regardless of input

### `weight.vue` validation function (unit tests)

- Returns error for missing `weight`
- Returns error for `weight = 0`
- Returns error for `percentFat = 110`
- Returns error for `physiqueRating = 10`
- Returns no errors for valid full state
- Returns no errors when all optional fields are `undefined`

### `weight.vue` page (component/e2e tests)

- Form renders all four section cards
- Submit button is disabled / form shows errors when weight is empty
- Happy path: fill weight, click submit, file download is triggered
- Optional fields: form submits without them

## Open Items for Implementer

1. **Vitest setup:** Tests cannot be written until Vitest (or another runner) is added to `package.json` as a dev dependency and configured. Coordinate with the user before writing test files.
2. **Download filename convention:** Use `weight-${new Date().toISOString().slice(0, 10)}.fit` (e.g. `weight-2026-06-27.fit`).
3. **`UCard` vs `UPageCard`:** Nuxt UI v4 exposes both. Use `UCard` for section grouping — it is the general-purpose card component. `UPageCard` is for marketing/landing layouts.
4. **`UPageHero` on `/weight`:** Add a minimal `UPageHero` (title + description) above the form, consistent with the index page pattern.
5. **Form section titles:** Suggested groupings:
   - **Basic** — `weight`, `bmi`
   - **Body Composition** — `percentFat`, `percentHydration`, `visceralFatMass`, `boneMass`, `muscleMass`
   - **Metabolic** — `basalMet`, `activeMet`, `metabolicAge`
   - **Ratings** — `physiqueRating`, `visceralFatRating`
6. **`UInputNumber`** — Use for all numeric fields. Set `:min` and `:max` where applicable to aid UX.
7. **Hint text:** Add `help` prop to `UFormField` for fields that need context:
   - `physiqueRating`: "Garmin physique rating scale: 1 (Obese) to 9 (Very lean)"
   - `visceralFatRating`: "Garmin visceral fat rating: 1–9"
   - `basalMet` / `activeMet`: "kcal/day"
   - `bmi`: "kg/m²"

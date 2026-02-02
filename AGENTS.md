## Overview

This repository uses NestJS for the API and Next.js (App Router) for the web UI. Automated agents should follow the conventions and boundaries below when proposing changes.

---

## Scope

- Allowed: small, well-scoped PRs that add documentation, tests, bug fixes, small features, refactors with tests, and CI/task automation.
- Allowed with review: changes that touch codegen, build scripts, or generated artifacts (must include generators + tests and a human reviewer).
- Forbidden without human approval: secrets, infra changes, publishing packages, direct edits to generated files, destructive DB operations, or broad structural refactors.

---

## Conventions & expectations

- Backend (NestJS): feature modules per domain, Controllers/Services, DTO classes (class-transformer/class-validator), Swagger decorators, Prisma client (in `packages/database`), use `ValidationPipe`, guard-based auth (`JwtGuard`), `Logger`, and explicit try/catch with helpers like `throwIfNotFound`.

- Frontend (Next.js / React): app router with server components by default; annotate client components with `'use client'`. Prefer named exports (e.g., `export const X`) and use `@repo/codegen` for typed API clients and MSW mocks. Styling uses Tailwind via `packages/design-system`.

---

## 🧭 General coding conventions

- TypeScript everywhere — prefer explicit types over `any`.
- Filenames in kebab-case (e.g., `users.controller.ts`, `recipe-card.tsx`) and exported types/classes in PascalCase.
- Use feature-based folders (e.g., `src/recipes`, `src/users`, etc.) for both Nest and Next code.
- Avoid editing generated code (see Generated Code section below).
- Run lint & tests locally (or in CI) for any non-trivial change.

---

## 🔧 NestJS (backend) conventions

- Structure: feature modules (e.g., `users`, `recipes`, `ai`) with a `module.ts`, `controller.ts`, `service.ts`, `contracts/` (DTOs) and `*.response.ts` output types.
- DTOs: use class-based DTOs with `class-transformer` (@Type) / `class-validator` and decorate with `@ApiProperty` for Swagger.
- Error handling: try/catch in controllers/services when appropriate; use helpers like `throwIfNotFound` to normalize not-found errors.
- Validation: use `ValidationPipe` and custom pipes for non-standard validation logic.
- Logging: use `private readonly logger = new Logger(ClassName.name)` where helpful.
- Swagger: keep DTOs and response classes documented with `@Api*` decorators and keep `apps/api/swagger.json` updated by the Swagger generator.
- Testing: unit tests and e2e tests live under `apps/api/test`. Prefer explicit test coverage for new features.
- Database: Prisma client is generated under `packages/database/generated/prisma`. Use migrations and `prisma generate` as needed.

---

## ⚛️ Next.js / React (frontend) conventions

- App router (`app/`): server components by default; annotate client components with `'use client'`.
- Export style: prefer **named exports** (e.g., `export const RecipeCard = () => {}`), avoid default exports for components when possible.
- Styling: TailwindCSS classes; file-level PostCSS/ Tailwind setup lives in `packages/design-system` and `apps/ui`.
- Data fetching: prefer typed `@repo/codegen` hooks and generated controllers (e.g., `useRecipesControllerCreateRecipeV1`).
- Images & links: use `next/image` and `next/link` where appropriate.
- State: local stores and provider patterns (Zustand-like) are used in `providers/` and `stores/`.
- Tests: Jest + MSW are used for component and hook testing. MSW mocks come from `@repo/codegen` (dist-cjs) during tests.

---

## 🛑 Generated code / artifacts

Do NOT modify generated files directly. Key generated artifacts:

- `packages/codegen` (Orval-generated typed API clients + MSW handlers)
- `packages/zod-schemas` (generated Zod schemas used by the AI service)
- `packages/database/generated/prisma` (Prisma client)
- `apps/api/swagger.json` (OpenAPI spec that drives `codegen`)

If you need to change generated types/APIs:

1. Update the authoritative source (e.g., `apps/api` controllers/DTOs or the OpenAPI spec).
2. Run the generator(s): e.g., `pnpm -w -F @repo/codegen build` (or use the package's `build` script) and `prisma generate` for DB changes.
3. Add/modify tests and update usage sites in the codebase.

---

## 🧪 Testing & CI expectations

- New functionality should include unit tests and/or e2e tests as appropriate.
- Use MSW mocks for frontend tests (they come from `@repo/codegen` dist artifacts).
- Before opening a PR, ensure: `pnpm -w run lint` and `pnpm -w run test` pass locally or mention known, justified exceptions in the PR.

---

## 📋 PR checklist for agents (must be enforced)

1. Small, focused PR with clear description and motivation. ✅
2. Add/modify tests for new behavior. ✅
3. Run `pnpm -w run lint` and `pnpm -w run test` locally/CI. ✅
4. Update Swagger/OpenAPI and `@repo/codegen` artifacts where API surface changes are made. ✅
5. Do not commit secrets or environment variables. ⚠️
6. Ensure generated files are updated via the proper build steps (do not hand-edit generated files). ✅

---

## 🧰 Useful commands (examples)

- At the repository root (use Turbo via workspace scripts):

  ```bash
  # Build everything (runs `turbo run build`):
  pnpm -w run build

  # Start dev (monorepo-aware):
  pnpm -w run dev

  # Run lint/tests across the workspace:
  pnpm -w run lint
  pnpm -w run test
  ```

- Turborepo CLI (alternative to workspace scripts):

  ```bash
  # Run a task across the repo:
  npx turbo run build

  # Run a task only for changed packages since main:
  npx turbo run test --since origin/main

  # Run a pipeline in parallel and stream logs:
  npx turbo run dev
  ```

- From inside an app or package folder (use local `pnpm`):

  ```bash
  # Build a single app or package:
  cd apps/api && pnpm run build

  # Run tests for a single app:
  cd apps/ui && pnpm run test

  # Run lint for a package:
  cd packages/codegen && pnpm run lint
  ```

- Codegen / generators:

  ```bash
  # From repo root (target a specific package with the -F flag):
  pnpm -w -F @repo/codegen build

  # Or from the package folder directly:
  cd packages/codegen && pnpm run build
  ```

---

## 🔐 Agent boundaries — what an automated agent MUST NOT do without human approval

- Never commit secrets or credentials, or modify files that contain secrets.
- Do not push or merge changes that affect infrastructure (deployments, production secrets, CI) without human sign-off.
- Avoid large or risky structural refactors without creating an RFC-style PR and getting at least one human review.
- Do not modify generated artifacts directly — run the canonical generators instead.
- Do not apply database migrations to production or run destructive `prisma` operations without owner approval.
- Do not publish new npm packages or change package visibility without coordination.

> If an agent is uncertain about risk or missing context, it should open a draft PR with a clear title and description and request a human reviewer.

If you'd like, I can: (1) open a draft PR adding this `AGENTS.md`, (2) add a short CODEGEN checklist to the repo README, or (3) add a quick GH Action that runs the `codegen` step on `push` when `apps/api/swagger.json` changes. Which would you prefer? ✨

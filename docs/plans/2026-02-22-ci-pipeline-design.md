# CI Pipeline Design

## Overview

Minimal GitHub Actions CI for the coffee_exp monorepo, covering the API (Python/FastAPI) and Web (React/TypeScript) apps. Two separate workflows with path filters so only relevant CI runs when files change.

## Workflow 1: API CI (`api-ci.yml`)

**Triggers:** Push and PR to `main` when `api/**` changes.

**Environment:** Ubuntu latest, Python 3.11, uv package manager.

**Services:** PostgreSQL 16 container (matches docker-compose).

**Steps:**

1. **Lint** — `black --check app tests`
2. **Test** — `pytest -v` against Postgres service container
3. **Migrations check** — `alembic upgrade head` to verify migrations apply cleanly

**Environment variables:** `DATABASE_URL` and `TEST_DATABASE_URL` pointing to the Postgres service.

## Workflow 2: Web CI (`web-ci.yml`)

**Triggers:** Push and PR to `main` when `web/**` changes.

**Environment:** Ubuntu latest, Node 20.

**Steps:**

1. **Lint** — `npm run lint`
2. **Typecheck** — `tsc -b`
3. **Test** — `npx vitest run`
4. **Build** — `npm run build`

## Decisions

- **Separate workflows over single workflow:** Path filters avoid running unnecessary CI. Acceptable trade-off of two files for a small repo.
- **Real Postgres in API CI:** Matches local test setup, catches real DB issues.
- **No mobile CI:** Expo/React Native CI is more complex; deferred for later.
- **No deployment:** This is a CI-only pipeline. CD can be added when needed.

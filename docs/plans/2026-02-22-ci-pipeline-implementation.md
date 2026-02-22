# CI Pipeline Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add GitHub Actions CI pipelines for the API and Web apps with lint, test, and build steps.

**Architecture:** Two separate workflow files triggered by path filters. API workflow runs lint, tests against a real Postgres service, and migration check. Web workflow runs lint, typecheck, tests, and build.

**Tech Stack:** GitHub Actions, Python 3.11, uv, pytest, Black, Node 20, npm, Vitest, ESLint, TypeScript

---

### Task 1: Create API CI workflow

**Files:**
- Create: `.github/workflows/api-ci.yml`

**Step 1: Create the workflow file**

```yaml
name: API CI

on:
  push:
    branches: [main]
    paths: ['api/**']
  pull_request:
    branches: [main]
    paths: ['api/**']

jobs:
  api:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: api

    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: coffee_exp_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd "pg_isready -U postgres"
          --health-interval 5s
          --health-timeout 5s
          --health-retries 5

    env:
      DATABASE_URL: postgresql://postgres:postgres@localhost:5432/coffee_exp_test
      TEST_DATABASE_URL: postgresql://postgres:postgres@localhost:5432/coffee_exp_test
      SECRET_KEY: ci-test-secret-key

    steps:
      - uses: actions/checkout@v4

      - uses: astral-sh/setup-uv@v4
        with:
          version: "latest"

      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Install dependencies
        run: uv sync

      - name: Lint
        run: uv run black --check app tests

      - name: Run migrations
        run: uv run alembic upgrade head

      - name: Test
        run: uv run pytest -v
```

**Step 2: Verify the file is valid YAML**

Run: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/api-ci.yml'))"`
Expected: No output (valid YAML)

**Step 3: Commit**

```bash
git add .github/workflows/api-ci.yml
git commit -m "ci: add API CI workflow with lint, migrations, and tests"
```

---

### Task 2: Create Web CI workflow

**Files:**
- Create: `.github/workflows/web-ci.yml`

**Step 1: Create the workflow file**

```yaml
name: Web CI

on:
  push:
    branches: [main]
    paths: ['web/**']
  pull_request:
    branches: [main]
    paths: ['web/**']

jobs:
  web:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: web

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
          cache-dependency-path: web/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Typecheck
        run: npx tsc -b

      - name: Test
        run: npx vitest run

      - name: Build
        run: npm run build
```

**Step 2: Verify the file is valid YAML**

Run: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/web-ci.yml'))"`
Expected: No output (valid YAML)

**Step 3: Commit**

```bash
git add .github/workflows/web-ci.yml
git commit -m "ci: add Web CI workflow with lint, typecheck, test, and build"
```

---

### Task 3: Verify both workflows locally

**Step 1: Validate YAML structure of both files**

Run: `python3 -c "import yaml; [yaml.safe_load(open(f'.github/workflows/{f}')) for f in ['api-ci.yml', 'web-ci.yml']]; print('Both valid')"`
Expected: `Both valid`

**Step 2: Verify API lint passes locally**

Run: `cd api && uv run black --check app tests`
Expected: `All done!` or similar success message

**Step 3: Verify Web lint passes locally**

Run: `cd web && npm run lint`
Expected: No errors

**Step 4: Verify Web typecheck passes locally**

Run: `cd web && npx tsc -b`
Expected: No errors (exit code 0)

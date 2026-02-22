<p align="center">
  <img src="docs/readme_banner.png" alt="Coffee Exp banner" />
</p>

# Coffee Exp ☕

**A personal brewing journal for the curious coffee lover.**

> _"Life's too short for bad coffee — and too rich not to remember the good ones."_

Coffee Exp is a minimalistic app built to help coffee enthusiasts track their brewing experiences — every pour-over, every espresso shot, every lazy French press Sunday morning. Log what you brewed, how you brewed it, rate the result, and over time build a personal archive of your coffee journey.

Born out of a simple need: the creator loves coffee and kept forgetting which beans, ratios, and methods made that *one perfect cup*. Coffee Exp fixes that.

---

## What's on the menu

- **Brewing journal** — Record each session with method, grams, water volume, and free-form notes
- **5-axis ratings** — Score flavor, acidity, aroma, appearance, and bitterness on a 1–5 scale (overall calculated automatically)
- **Coffee & brand catalog** — Keep a personal inventory of beans you've tried, organized by brand and country
- **Location tagging** — Remember *where* that great cup happened (GPS on mobile)
- **Multi-platform** — Web app for the desktop, mobile app for brewing on the go
- **Clean & cozy UI** — Material UI on web, React Native Paper on mobile — no clutter, just coffee

---

## Tech stack

### Backend

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![SQLModel](https://img.shields.io/badge/SQLModel-009688?logo=fastapi&logoColor=white)](https://sqlmodel.tiangolo.com/)
[![Alembic](https://img.shields.io/badge/Alembic-migrations-6BA81E)](https://alembic.sqlalchemy.org/)
[![Black](https://img.shields.io/badge/code%20style-Black-000000)](https://github.com/psf/black)
[![uv](https://img.shields.io/badge/uv-package%20manager-DE5FE9?logo=uv&logoColor=white)](https://docs.astral.sh/uv/)

### Web

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![MUI](https://img.shields.io/badge/Material%20UI-7-007FFF?logo=mui&logoColor=white)](https://mui.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5-EF4444?logo=reactquery&logoColor=white)](https://tanstack.com/query)

### Mobile

[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![React Native Paper](https://img.shields.io/badge/RN%20Paper-5-6200EE)](https://reactnativepaper.com/)

### Infrastructure

[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![GitHub Actions](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)](https://github.com/features/actions)

---

## Getting started

### Prerequisites

- [Docker & Docker Compose](https://docs.docker.com/get-docker/)
- [Node.js 20+](https://nodejs.org/) (for web/mobile)
- [uv](https://docs.astral.sh/uv/getting-started/installation/) (for the API)

### Quickstart with Docker (recommended)

```bash
# Clone the repo
git clone https://github.com/henriquecaltram/coffee_exp.git
cd coffee_exp

# Spin up everything — API, web, and databases
docker-compose up
```

| Service        | URL                        |
| -------------- | -------------------------- |
| API            | http://localhost:8000      |
| Web            | http://localhost:3000      |
| PostgreSQL Dev | localhost:5432             |

### Manual setup

<details>
<summary><strong>API</strong></summary>

```bash
cd api

# Install dependencies
make install        # or: uv sync

# Create your .env from the example
cp .env.example .env

# Run database migrations
make migrate

# Start the dev server (http://localhost:8000)
make dev
```

**Available make commands:**

| Command                          | Description                  |
| -------------------------------- | ---------------------------- |
| `make install`                   | Install dependencies         |
| `make dev`                       | Start dev server             |
| `make test`                      | Run tests                    |
| `make test-cov`                  | Tests with HTML coverage     |
| `make format`                    | Format code with Black       |
| `make lint`                      | Check formatting             |
| `make migrate`                   | Run pending migrations       |
| `make migrate-new name="..."`    | Create a new migration       |
| `make migrate-down`              | Rollback last migration      |

</details>

<details>
<summary><strong>Web</strong></summary>

```bash
cd web

# Install dependencies
npm install

# Start dev server with HMR (http://localhost:3000)
npm run dev
```

Other scripts: `npm run build`, `npm run lint`, `npx vitest run`

</details>

<details>
<summary><strong>Mobile</strong></summary>

```bash
cd mobile

# Install dependencies
npm install

# Start Expo dev server
npm start

# Or run on a specific platform
npm run ios
npm run android
```

</details>

### Environment variables

**API** (`api/.env`)

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/coffee_exp_dev
TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:5433/coffee_exp_test
SECRET_KEY=change-me-in-production
```

**Web** — set `VITE_API_URL` to point to the API (defaults to `http://localhost:8000` in Docker).

---

## Project structure

```
coffee_exp/
├── api/                  # FastAPI backend
│   ├── app/
│   │   ├── models/       # SQLModel database models
│   │   ├── schemas/      # Pydantic request/response schemas
│   │   ├── routes/       # API endpoint handlers
│   │   ├── services/     # Business logic
│   │   └── database/     # DB connection & session
│   ├── migrations/       # Alembic migrations
│   ├── tests/
│   └── Makefile
├── web/                  # React + Vite frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── contexts/
│       └── api/
├── mobile/               # Expo + React Native app
│   └── app/
├── docker-compose.yml
└── .github/workflows/    # CI pipelines
```

---

## License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  <em>Now go brew something wonderful.</em>
</p>

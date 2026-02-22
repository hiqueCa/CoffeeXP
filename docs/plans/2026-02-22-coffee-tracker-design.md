# Coffee Brewing Tracker — Design Document

Date: 2026-02-22

## Overview

A personal app for recording coffee brewing experiences. Tracks the bean, brand, brewing method, ratio (grams/ml), location (GPS), subjective ratings, and free-text notes. Provides a central history of all brewings with timestamps and locations.

## Architecture

Flat monorepo with Docker Compose orchestration.

```
coffee_exp/
├── api/          # FastAPI + SQLModel (Python)
├── web/          # React + MUI (Vite, TypeScript)
├── mobile/       # React Native + Expo (TypeScript)
├── docker-compose.yml
└── docs/
```

- `api`, `web`, `db`, and `db-test` run as Docker Compose services.
- `mobile` runs on the host via Expo dev server (needs access to simulators/devices).
- Both frontends connect to the single API.

## Data Model

### CoffeeBrand

| Field      | Type     | Notes              |
|------------|----------|--------------------|
| id         | int (PK) | auto-increment     |
| name       | str      |                    |
| country    | str      |                    |
| created_at | datetime | UTC                |
| updated_at | datetime | UTC                |

### Coffee

| Field      | Type        | Notes                    |
|------------|-------------|--------------------------|
| id         | int (PK)    | auto-increment           |
| name       | str         |                          |
| price      | Decimal(2)  | 2 decimal places         |
| brand_id   | int (FK)    | references CoffeeBrand   |
| created_at | datetime    | UTC                      |
| updated_at | datetime    | UTC                      |

Relationships: belongs to CoffeeBrand (N:1), has many Brewings (1:N).

### Rating

| Field      | Type     | Notes                              |
|------------|----------|------------------------------------|
| id         | int (PK) | auto-increment                     |
| flavor     | int      | 1-5, validated                     |
| acidic     | int      | 1-5, validated                     |
| aroma      | int      | 1-5, validated                     |
| appearance | int      | 1-5, validated                     |
| bitter     | int      | 1-5, validated                     |
| overall    | int      | 1-5, auto-calculated rounded avg   |
| created_at | datetime | UTC                                |
| updated_at | datetime | UTC                                |

Relationships: belongs to Brewing (1:1).

### Brewing

| Field      | Type     | Notes                              |
|------------|----------|------------------------------------|
| id         | int (PK) | auto-increment                     |
| coffee_id  | int (FK) | references Coffee                  |
| rating_id  | int (FK) | references Rating                  |
| method     | str      | e.g. "V60", "French Press"         |
| grams      | int      | grams of coffee                    |
| ml         | int      | milliliters of water               |
| notes      | str      | free-text perceptions/observations |
| latitude   | float    | GPS latitude                       |
| longitude  | float    | GPS longitude                      |
| location   | str      | reverse-geocoded name              |
| created_at | datetime | UTC, doubles as brewing timestamp  |
| updated_at | datetime | UTC                                |

Relationships: belongs to Coffee (N:1), has one Rating (1:1).

## API Endpoints

All endpoints require JWT auth unless noted.

### Authentication

- `POST /auth/register` — create account (public)
- `POST /auth/login` — JWT login with email + password (public)

### Coffee Brands

- `GET /coffee-brands` — list all brands
- `POST /coffee-brands` — create a brand
- `GET /coffee-brands/{id}` — get brand details
- `PUT /coffee-brands/{id}` — update brand
- `DELETE /coffee-brands/{id}` — delete brand

### Coffees

- `GET /coffees` — list all coffees (filterable by brand)
- `POST /coffees` — create a coffee
- `GET /coffees/{id}` — get coffee details
- `PUT /coffees/{id}` — update coffee
- `DELETE /coffees/{id}` — delete coffee

### Brewings

- `GET /brewings` — list all brewings (filterable, sortable by date, paginated)
- `POST /brewings` — create a brewing with inline rating payload
- `GET /brewings/{id}` — get brewing details (includes rating, coffee, brand)
- `PUT /brewings/{id}` — update brewing
- `DELETE /brewings/{id}` — delete brewing

### Health

- `GET /health` — health check (public)

## Docker Services

| Service   | Image / Build           | Port | Notes                          |
|-----------|-------------------------|------|--------------------------------|
| db        | postgres:16-alpine      | 5432 | Dev PostgreSQL                 |
| db-test   | postgres:16-alpine      | 5433 | Test PostgreSQL                |
| api       | Build from ./api        | 8000 | FastAPI, depends on db         |
| web       | Build from ./web        | 3000 | Vite dev / nginx prod          |

- `api` waits for `db` health check before starting.
- `web` depends on `api`.
- Dev uses bind mounts for hot-reload on `api/` and `web/` source.
- DB data persisted via Docker volumes.

## Testing Strategy

**TDD is mandatory.** All features are implemented test-first: write failing tests, implement to pass, refactor.

### API

- Test database: `db-test` service on port 5433 (`coffee_exp_test` database).
- Pytest + pytest-asyncio.
- Fixtures: session-scoped table creation, function-scoped transaction rollback.
- Real database interactions — minimal mocking.
- Test layers: unit (models, services), integration (routes hitting test DB).

### Web

- Vitest + React Testing Library.
- API calls mocked at the network layer.

### Mobile

- Jest + React Native Testing Library (via Expo).

## Tech Stack Summary

### API

- Python >= 3.11
- FastAPI + Uvicorn
- SQLModel (SQLAlchemy + Pydantic)
- Alembic (migrations)
- PostgreSQL 16
- uv (package manager)
- JWT auth (python-jose + passlib)

### Web

- React 18+ with TypeScript
- Vite (build tool)
- Material UI (MUI)
- React Router
- TanStack Query (server state)
- Vitest + React Testing Library

### Mobile

- React Native with Expo
- TypeScript
- React Native Paper (Material Design)
- Expo Router (navigation)
- expo-location (GPS)
- TanStack Query (server state)
- Jest + React Native Testing Library

## Frontend Screens

1. **Login** — email + password
2. **Brewing list** (home) — scrollable feed sorted by date, search/filter
3. **Brewing detail** — full brewing info: coffee, brand, method, ratio, rating, notes, location, timestamp
4. **New brewing form** — log a new brewing: select/create coffee, set method, grams, ml, rate, add notes, capture GPS location
5. **Coffee list** — browse/manage coffees and brands
6. **Coffee detail** — view a coffee with its brewing history

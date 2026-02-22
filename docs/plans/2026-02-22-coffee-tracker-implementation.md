# Coffee Brewing Tracker Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a full-stack coffee brewing tracker with a FastAPI backend, React web app, and Expo mobile app in a Docker-orchestrated monorepo.

**Architecture:** Flat monorepo (`coffee_exp/`) with `api/`, `web/`, `mobile/` directories. Docker Compose orchestrates PostgreSQL (dev + test), the API, and the web frontend. Mobile runs via Expo on the host. Both frontends consume the same REST API with JWT auth.

**Tech Stack:** Python 3.11 / FastAPI / SQLModel / PostgreSQL 16 / Alembic / React / Vite / MUI / Expo / React Native Paper / TanStack Query

**TDD Mandate:** Every feature is implemented test-first. Write failing test → verify failure → implement → verify pass → commit.

---

## Phase 1: Project Scaffold & Infrastructure

### Task 1: Root Docker Compose & directory structure

**Files:**
- Create: `docker-compose.yml`
- Create: `api/.gitkeep` (placeholder, replaced in Task 2)
- Create: `web/.gitkeep` (placeholder, replaced later)
- Create: `mobile/.gitkeep` (placeholder, replaced later)
- Create: `.gitignore`

**Step 1: Create root .gitignore**

```gitignore
# Python
__pycache__/
*.py[cod]
*.egg-info/
.venv/
*.egg

# Node
node_modules/
dist/
.expo/

# Environment
.env
.env.local

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Docker
*.log
```

**Step 2: Create docker-compose.yml**

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: coffee_exp_dev
    ports:
      - "5432:5432"
    volumes:
      - dev_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  db-test:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: coffee_exp_test
    ports:
      - "5433:5432"
    volumes:
      - test_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - ./api:/app
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/coffee_exp_dev
      TEST_DATABASE_URL: postgresql://postgres:postgres@db-test:5432/coffee_exp_test
      SECRET_KEY: dev-secret-key-change-in-production
    depends_on:
      db:
        condition: service_healthy
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

  web:
    build:
      context: ./web
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - ./web:/app
      - /app/node_modules
    environment:
      VITE_API_URL: http://localhost:8000
    depends_on:
      - api

volumes:
  dev_data:
  test_data:
```

**Step 3: Create placeholder directories**

```bash
mkdir -p api web mobile
```

**Step 4: Commit**

```bash
git add .gitignore docker-compose.yml
git commit -m "feat: add root docker-compose and gitignore"
```

---

### Task 2: API project scaffold

**Files:**
- Create: `api/pyproject.toml`
- Create: `api/Dockerfile`
- Create: `api/Makefile`
- Create: `api/.env.example`
- Create: `api/app/__init__.py`
- Create: `api/app/main.py`
- Create: `api/app/config.py`
- Create: `api/app/database/__init__.py`
- Create: `api/tests/__init__.py`
- Create: `api/tests/conftest.py`

**Step 1: Create pyproject.toml**

```toml
[project]
name = "coffee-exp-api"
version = "0.1.0"
description = "Coffee brewing experience tracker API"
requires-python = ">=3.11"
dependencies = [
    "fastapi>=0.109.0",
    "uvicorn>=0.27.0",
    "sqlmodel>=0.0.22",
    "alembic>=1.13.0",
    "psycopg2-binary>=2.9.0",
    "pydantic-settings>=2.1.0",
    "python-dotenv>=1.0.0",
    "python-jose[cryptography]>=3.3.0",
    "passlib[bcrypt]>=1.7.4",
]

[tool.uv]
dev-dependencies = [
    "pytest>=8.0.0",
    "pytest-asyncio>=0.23.0",
    "pytest-cov>=4.0.0",
    "httpx>=0.26.0",
    "black>=24.0.0",
]

[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]

[tool.coverage.run]
source = ["app"]
omit = ["*/tests/*"]
```

**Step 2: Create Dockerfile**

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Copy dependency files
COPY pyproject.toml uv.lock* ./

# Install dependencies
RUN uv sync --frozen --no-install-project 2>/dev/null || uv sync --no-install-project

# Copy application code
COPY . .

# Install the project
RUN uv sync --frozen 2>/dev/null || uv sync

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Step 3: Create Makefile**

```makefile
.PHONY: install dev test test-cov format lint migrate migrate-new

install:
	uv sync

dev:
	uv run uvicorn app.main:app --reload --port 8000

test:
	uv run pytest -v

test-cov:
	uv run pytest --cov --cov-report=html -v

format:
	uv run black app tests

lint:
	uv run black --check app tests

migrate:
	uv run alembic upgrade head

migrate-new:
	uv run alembic revision --autogenerate -m "$(name)"

migrate-down:
	uv run alembic downgrade -1
```

**Step 4: Create .env.example**

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/coffee_exp_dev
TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:5433/coffee_exp_test
SECRET_KEY=change-me-in-production
```

**Step 5: Create app/config.py**

```python
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = ""
    test_database_url: str = ""
    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    class Config:
        env_file = ".env"


settings = Settings()
```

**Step 6: Create app/database/__init__.py**

```python
from sqlmodel import SQLModel, Session, create_engine

from app.config import settings

engine = create_engine(settings.database_url)


def get_session():
    with Session(engine) as session:
        yield session
```

**Step 7: Create app/main.py**

```python
from fastapi import FastAPI

app = FastAPI(title="Coffee Exp API", version="0.1.0")


@app.get("/health")
def health_check():
    return {"status": "ok"}
```

**Step 8: Create app/__init__.py**

Empty file.

**Step 9: Create tests/conftest.py**

```python
import pytest
from sqlmodel import SQLModel, Session, create_engine
from fastapi.testclient import TestClient

from app.config import settings
from app.main import app
from app.database import get_session

test_engine = create_engine(settings.test_database_url)


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    SQLModel.metadata.create_all(test_engine)
    yield
    SQLModel.metadata.drop_all(test_engine)


@pytest.fixture(name="session")
def session_fixture():
    connection = test_engine.connect()
    transaction = connection.begin()
    session = Session(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()
```

**Step 10: Create tests/__init__.py**

Empty file.

**Step 11: Write health check test**

Create `api/tests/test_health.py`:

```python
def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
```

**Step 12: Install dependencies and verify test passes**

```bash
cd api && uv sync && uv run pytest tests/test_health.py -v
```

Expected: PASS

**Step 13: Commit**

```bash
git add api/
git commit -m "feat: scaffold API project with FastAPI, test infrastructure, and health endpoint"
```

---

### Task 3: Alembic migrations setup

**Files:**
- Create: `api/alembic.ini`
- Create: `api/alembic/env.py`
- Create: `api/alembic/script.py.mako`
- Create: `api/alembic/versions/.gitkeep`

**Step 1: Initialize alembic**

```bash
cd api && uv run alembic init alembic
```

**Step 2: Update alembic/env.py**

Replace the generated `env.py` with:

```python
from logging.config import fileConfig

from alembic import context
from sqlmodel import SQLModel

from app.config import settings

config = context.config
config.set_main_option("sqlalchemy.url", settings.database_url)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Import all models so they register with SQLModel.metadata
from app.models import *  # noqa: F401, F403

target_metadata = SQLModel.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = config.attributes.get("connection", None)
    if connectable is None:
        from sqlalchemy import engine_from_config, pool
        connectable = engine_from_config(
            config.get_section(config.config_ini_section, {}),
            prefix="sqlalchemy.",
            poolclass=pool.NullPool,
        )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
```

**Step 3: Create app/models/__init__.py**

```python
from app.models.base_model import BaseModel
from app.models.coffee_brand import CoffeeBrand
from app.models.coffee import Coffee
from app.models.rating import Rating
from app.models.brewing import Brewing

__all__ = ["BaseModel", "CoffeeBrand", "Coffee", "Rating", "Brewing"]
```

Note: The model files are created in Tasks 4-7. This import file will cause import errors until those exist. Create stub files first, then flesh them out in following tasks.

**Step 4: Commit**

```bash
git add api/alembic.ini api/alembic/ api/app/models/__init__.py
git commit -m "feat: configure alembic for database migrations"
```

---

## Phase 2: API Models (TDD)

### Task 4: BaseModel

**Files:**
- Create: `api/app/models/base_model.py`
- Create: `api/tests/models/__init__.py`
- Create: `api/tests/models/test_base_model.py`

**Step 1: Write failing test**

`api/tests/models/test_base_model.py`:

```python
from datetime import datetime, timezone

from app.models.base_model import BaseModel
from sqlmodel import Field


class FakeModel(BaseModel, table=True):
    __tablename__ = "fake_model"
    name: str = Field()


def test_base_model_has_id():
    model = FakeModel(name="test")
    assert model.id is None  # None before DB insert


def test_base_model_has_timestamps():
    model = FakeModel(name="test")
    assert isinstance(model.created_at, datetime)
    assert isinstance(model.updated_at, datetime)


def test_base_model_timestamps_are_utc():
    model = FakeModel(name="test")
    assert model.created_at.tzinfo == timezone.utc
    assert model.updated_at.tzinfo == timezone.utc
```

**Step 2: Run test to verify failure**

```bash
cd api && uv run pytest tests/models/test_base_model.py -v
```

Expected: FAIL (module not found)

**Step 3: Implement BaseModel**

`api/app/models/base_model.py`:

```python
from datetime import datetime, timezone
from typing import Optional

from sqlmodel import SQLModel, Field


class BaseModel(SQLModel):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
```

**Step 4: Run test to verify pass**

```bash
cd api && uv run pytest tests/models/test_base_model.py -v
```

Expected: PASS

**Step 5: Commit**

```bash
git add api/app/models/base_model.py api/tests/models/
git commit -m "feat: add BaseModel with id and UTC timestamps"
```

---

### Task 5: CoffeeBrand model

**Files:**
- Create: `api/app/models/coffee_brand.py`
- Create: `api/tests/models/test_coffee_brand.py`

**Step 1: Write failing test**

`api/tests/models/test_coffee_brand.py`:

```python
from app.models.coffee_brand import CoffeeBrand


def test_coffee_brand_creation():
    brand = CoffeeBrand(name="Illy", country="Italy")
    assert brand.name == "Illy"
    assert brand.country == "Italy"
    assert brand.id is None


def test_coffee_brand_persists_to_database(session):
    brand = CoffeeBrand(name="Lavazza", country="Italy")
    session.add(brand)
    session.commit()
    session.refresh(brand)
    assert brand.id is not None
    assert brand.name == "Lavazza"
```

**Step 2: Run test to verify failure**

```bash
cd api && uv run pytest tests/models/test_coffee_brand.py -v
```

Expected: FAIL

**Step 3: Implement CoffeeBrand**

`api/app/models/coffee_brand.py`:

```python
from typing import TYPE_CHECKING, List

from sqlmodel import Field, Relationship

from app.models.base_model import BaseModel

if TYPE_CHECKING:
    from app.models.coffee import Coffee


class CoffeeBrand(BaseModel, table=True):
    __tablename__ = "coffee_brand"

    name: str = Field()
    country: str = Field()

    coffees: List["Coffee"] = Relationship(back_populates="coffee_brand")
```

**Step 4: Run test to verify pass**

```bash
cd api && uv run pytest tests/models/test_coffee_brand.py -v
```

Expected: PASS

**Step 5: Commit**

```bash
git add api/app/models/coffee_brand.py api/tests/models/test_coffee_brand.py
git commit -m "feat: add CoffeeBrand model"
```

---

### Task 6: Coffee model

**Files:**
- Create: `api/app/models/coffee.py`
- Create: `api/tests/models/test_coffee.py`

**Step 1: Write failing test**

`api/tests/models/test_coffee.py`:

```python
from decimal import Decimal

from app.models.coffee import Coffee
from app.models.coffee_brand import CoffeeBrand


def test_coffee_creation():
    coffee = Coffee(name="Classic Roast", price=Decimal("12.99"))
    assert coffee.name == "Classic Roast"
    assert coffee.price == Decimal("12.99")


def test_coffee_persists_with_brand(session):
    brand = CoffeeBrand(name="Illy", country="Italy")
    session.add(brand)
    session.commit()
    session.refresh(brand)

    coffee = Coffee(name="Classico", price=Decimal("14.50"), coffee_brand_id=brand.id)
    session.add(coffee)
    session.commit()
    session.refresh(coffee)

    assert coffee.id is not None
    assert coffee.coffee_brand_id == brand.id
    assert coffee.coffee_brand.name == "Illy"
```

**Step 2: Run test to verify failure**

```bash
cd api && uv run pytest tests/models/test_coffee.py -v
```

Expected: FAIL

**Step 3: Implement Coffee**

`api/app/models/coffee.py`:

```python
from decimal import Decimal
from typing import TYPE_CHECKING, Optional, List

from sqlmodel import Field, Relationship

from app.models.base_model import BaseModel

if TYPE_CHECKING:
    from app.models.coffee_brand import CoffeeBrand
    from app.models.brewing import Brewing


class Coffee(BaseModel, table=True):
    __tablename__ = "coffee"

    name: str = Field()
    price: Decimal = Field(max_digits=10, decimal_places=2)
    coffee_brand_id: Optional[int] = Field(default=None, foreign_key="coffee_brand.id")

    coffee_brand: Optional["CoffeeBrand"] = Relationship(back_populates="coffees")
    brewings: List["Brewing"] = Relationship(back_populates="coffee")
```

**Step 4: Run test to verify pass**

```bash
cd api && uv run pytest tests/models/test_coffee.py -v
```

Expected: PASS

**Step 5: Commit**

```bash
git add api/app/models/coffee.py api/tests/models/test_coffee.py
git commit -m "feat: add Coffee model with brand relationship"
```

---

### Task 7: Rating model with validation

**Files:**
- Create: `api/app/models/rating.py`
- Create: `api/app/services/__init__.py`
- Create: `api/app/services/overall_calculator.py`
- Create: `api/tests/models/test_rating.py`
- Create: `api/tests/services/__init__.py`
- Create: `api/tests/services/test_overall_calculator.py`

**Step 1: Write failing tests for OverallCalculator**

`api/tests/services/test_overall_calculator.py`:

```python
from app.services.overall_calculator import OverallCalculator


def test_calculates_average():
    scores = {"flavor": 5, "acidic": 4, "aroma": 3, "appearance": 2, "bitter": 1}
    assert OverallCalculator.calculate(scores) == 3


def test_rounds_average():
    scores = {"flavor": 5, "acidic": 5, "aroma": 5, "appearance": 5, "bitter": 4}
    assert OverallCalculator.calculate(scores) == 5


def test_all_ones():
    scores = {"flavor": 1, "acidic": 1, "aroma": 1, "appearance": 1, "bitter": 1}
    assert OverallCalculator.calculate(scores) == 1
```

**Step 2: Run to verify failure**

```bash
cd api && uv run pytest tests/services/test_overall_calculator.py -v
```

Expected: FAIL

**Step 3: Implement OverallCalculator**

`api/app/services/overall_calculator.py`:

```python
class OverallCalculator:
    FIELDS = ["flavor", "acidic", "aroma", "appearance", "bitter"]

    @classmethod
    def calculate(cls, scores: dict) -> int:
        values = [scores[field] for field in cls.FIELDS]
        return round(sum(values) / len(values))
```

`api/app/services/__init__.py`: empty file.

**Step 4: Verify calculator passes**

```bash
cd api && uv run pytest tests/services/test_overall_calculator.py -v
```

Expected: PASS

**Step 5: Write failing Rating tests**

`api/tests/models/test_rating.py`:

```python
import pytest

from app.models.rating import Rating


def test_rating_creation_with_valid_values():
    rating = Rating(flavor=4, acidic=3, aroma=5, appearance=4, bitter=2)
    assert rating.flavor == 4
    assert rating.overall == 4  # round((4+3+5+4+2)/5) = round(3.6) = 4


def test_rating_accepts_boundary_values():
    rating = Rating(flavor=1, acidic=1, aroma=1, appearance=1, bitter=1)
    assert rating.overall == 1
    rating = Rating(flavor=5, acidic=5, aroma=5, appearance=5, bitter=5)
    assert rating.overall == 5


def test_rating_rejects_value_below_minimum():
    with pytest.raises(ValueError):
        Rating(flavor=0, acidic=3, aroma=3, appearance=3, bitter=3)


def test_rating_rejects_value_above_maximum():
    with pytest.raises(ValueError):
        Rating(flavor=6, acidic=3, aroma=3, appearance=3, bitter=3)


def test_rating_persists_to_database(session):
    rating = Rating(flavor=4, acidic=3, aroma=5, appearance=4, bitter=2)
    session.add(rating)
    session.commit()
    session.refresh(rating)
    assert rating.id is not None
    assert rating.overall == 4
```

**Step 6: Run to verify failure**

```bash
cd api && uv run pytest tests/models/test_rating.py -v
```

Expected: FAIL

**Step 7: Implement Rating**

`api/app/models/rating.py`:

```python
from typing import Optional

from sqlmodel import Field

from app.models.base_model import BaseModel
from app.services.overall_calculator import OverallCalculator


VALIDATABLE_FIELDS = ["flavor", "acidic", "aroma", "appearance", "bitter"]


class Rating(BaseModel, table=True):
    __tablename__ = "rating"

    flavor: int = Field()
    acidic: int = Field()
    aroma: int = Field()
    appearance: int = Field()
    bitter: int = Field()
    overall: Optional[int] = Field(default=None)

    def __init__(self, **data):
        super().__init__(**data)
        self._validate_ratings()
        self.overall = OverallCalculator.calculate(
            {field: getattr(self, field) for field in VALIDATABLE_FIELDS}
        )

    def _validate_ratings(self):
        for field in VALIDATABLE_FIELDS:
            value = getattr(self, field)
            if value < 1 or value > 5:
                raise ValueError(f"{field} must be between 1 and 5, got {value}")
```

**Step 8: Verify all rating tests pass**

```bash
cd api && uv run pytest tests/models/test_rating.py tests/services/test_overall_calculator.py -v
```

Expected: PASS

**Step 9: Commit**

```bash
git add api/app/models/rating.py api/app/services/ api/tests/models/test_rating.py api/tests/services/
git commit -m "feat: add Rating model with 1-5 validation and auto-calculated overall"
```

---

### Task 8: Brewing model

**Files:**
- Create: `api/app/models/brewing.py`
- Create: `api/tests/models/test_brewing.py`

**Step 1: Write failing test**

`api/tests/models/test_brewing.py`:

```python
from decimal import Decimal

from app.models.brewing import Brewing
from app.models.coffee import Coffee
from app.models.coffee_brand import CoffeeBrand
from app.models.rating import Rating


def test_brewing_creation():
    brewing = Brewing(method="V60", grams=15, ml=250, notes="Fruity and bright")
    assert brewing.method == "V60"
    assert brewing.grams == 15
    assert brewing.ml == 250
    assert brewing.notes == "Fruity and bright"


def test_brewing_with_location():
    brewing = Brewing(
        method="French Press",
        grams=20,
        ml=300,
        latitude=52.3676,
        longitude=4.9041,
        location="Amsterdam, NL",
    )
    assert brewing.latitude == 52.3676
    assert brewing.longitude == 4.9041
    assert brewing.location == "Amsterdam, NL"


def test_brewing_persists_with_relationships(session):
    brand = CoffeeBrand(name="Illy", country="Italy")
    session.add(brand)
    session.commit()
    session.refresh(brand)

    coffee = Coffee(name="Classico", price=Decimal("14.50"), coffee_brand_id=brand.id)
    session.add(coffee)
    session.commit()
    session.refresh(coffee)

    rating = Rating(flavor=4, acidic=3, aroma=5, appearance=4, bitter=2)
    session.add(rating)
    session.commit()
    session.refresh(rating)

    brewing = Brewing(
        coffee_id=coffee.id,
        rating_id=rating.id,
        method="V60",
        grams=15,
        ml=250,
        notes="Excellent cup",
        latitude=52.3676,
        longitude=4.9041,
        location="Amsterdam, NL",
    )
    session.add(brewing)
    session.commit()
    session.refresh(brewing)

    assert brewing.id is not None
    assert brewing.coffee.name == "Classico"
    assert brewing.rating.overall == 4
```

**Step 2: Run test to verify failure**

```bash
cd api && uv run pytest tests/models/test_brewing.py -v
```

Expected: FAIL

**Step 3: Implement Brewing**

`api/app/models/brewing.py`:

```python
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship

from app.models.base_model import BaseModel

if TYPE_CHECKING:
    from app.models.coffee import Coffee
    from app.models.rating import Rating


class Brewing(BaseModel, table=True):
    __tablename__ = "brewing"

    coffee_id: Optional[int] = Field(default=None, foreign_key="coffee.id")
    rating_id: Optional[int] = Field(default=None, foreign_key="rating.id")
    method: str = Field()
    grams: int = Field()
    ml: int = Field()
    notes: Optional[str] = Field(default=None)
    latitude: Optional[float] = Field(default=None)
    longitude: Optional[float] = Field(default=None)
    location: Optional[str] = Field(default=None)

    coffee: Optional["Coffee"] = Relationship(back_populates="brewings")
    rating: Optional["Rating"] = Relationship()
```

**Step 4: Run test to verify pass**

```bash
cd api && uv run pytest tests/models/test_brewing.py -v
```

Expected: PASS

**Step 5: Commit**

```bash
git add api/app/models/brewing.py api/tests/models/test_brewing.py
git commit -m "feat: add Brewing model with location, notes, and relationships"
```

---

### Task 9: Generate initial Alembic migration

**Step 1: Start the dev database**

```bash
docker compose up db -d
```

**Step 2: Create .env for local development**

Create `api/.env`:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/coffee_exp_dev
TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:5433/coffee_exp_test
SECRET_KEY=dev-secret-key
```

**Step 3: Generate migration**

```bash
cd api && uv run alembic revision --autogenerate -m "initial tables"
```

**Step 4: Apply migration**

```bash
cd api && uv run alembic upgrade head
```

**Step 5: Verify all tests still pass**

```bash
docker compose up db-test -d
cd api && uv run pytest -v
```

Expected: All tests PASS

**Step 6: Commit**

```bash
git add api/alembic/ api/.env.example
git commit -m "feat: add initial database migration for all tables"
```

Note: Do NOT commit `api/.env`. Ensure it's in `.gitignore`.

---

## Phase 3: API Auth (TDD)

### Task 10: User model

**Files:**
- Create: `api/app/models/user.py`
- Create: `api/tests/models/test_user.py`
- Modify: `api/app/models/__init__.py` — add User import

**Step 1: Write failing test**

`api/tests/models/test_user.py`:

```python
from app.models.user import User


def test_user_creation():
    user = User(email="test@example.com", hashed_password="hashed123")
    assert user.email == "test@example.com"
    assert user.hashed_password == "hashed123"


def test_user_persists_to_database(session):
    user = User(email="test@example.com", hashed_password="hashed123")
    session.add(user)
    session.commit()
    session.refresh(user)
    assert user.id is not None
```

**Step 2: Run to verify failure**

```bash
cd api && uv run pytest tests/models/test_user.py -v
```

**Step 3: Implement User**

`api/app/models/user.py`:

```python
from sqlmodel import Field

from app.models.base_model import BaseModel


class User(BaseModel, table=True):
    __tablename__ = "user"

    email: str = Field(unique=True, index=True)
    hashed_password: str = Field()
```

Update `api/app/models/__init__.py`:

```python
from app.models.base_model import BaseModel
from app.models.coffee_brand import CoffeeBrand
from app.models.coffee import Coffee
from app.models.rating import Rating
from app.models.brewing import Brewing
from app.models.user import User

__all__ = ["BaseModel", "CoffeeBrand", "Coffee", "Rating", "Brewing", "User"]
```

**Step 4: Verify pass**

```bash
cd api && uv run pytest tests/models/test_user.py -v
```

**Step 5: Generate migration and commit**

```bash
cd api && uv run alembic revision --autogenerate -m "add user table"
cd api && uv run alembic upgrade head
git add api/app/models/user.py api/app/models/__init__.py api/tests/models/test_user.py api/alembic/
git commit -m "feat: add User model with email and hashed_password"
```

---

### Task 11: Auth service (password hashing + JWT)

**Files:**
- Create: `api/app/services/auth.py`
- Create: `api/tests/services/test_auth.py`

**Step 1: Write failing tests**

`api/tests/services/test_auth.py`:

```python
from app.services.auth import AuthService


def test_hash_password_returns_different_string():
    password = "mysecretpassword"
    hashed = AuthService.hash_password(password)
    assert hashed != password


def test_verify_password_returns_true_for_correct():
    password = "mysecretpassword"
    hashed = AuthService.hash_password(password)
    assert AuthService.verify_password(password, hashed) is True


def test_verify_password_returns_false_for_incorrect():
    hashed = AuthService.hash_password("correct")
    assert AuthService.verify_password("wrong", hashed) is False


def test_create_access_token():
    token = AuthService.create_access_token({"sub": "test@example.com"})
    assert isinstance(token, str)
    assert len(token) > 0


def test_decode_access_token():
    token = AuthService.create_access_token({"sub": "test@example.com"})
    payload = AuthService.decode_access_token(token)
    assert payload["sub"] == "test@example.com"


def test_decode_invalid_token_returns_none():
    payload = AuthService.decode_access_token("invalid.token.here")
    assert payload is None
```

**Step 2: Run to verify failure**

```bash
cd api && uv run pytest tests/services/test_auth.py -v
```

**Step 3: Implement AuthService**

`api/app/services/auth.py`:

```python
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def create_access_token(data: dict) -> str:
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.access_token_expire_minutes
        )
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)

    @staticmethod
    def decode_access_token(token: str) -> dict | None:
        try:
            return jwt.decode(
                token, settings.secret_key, algorithms=[settings.algorithm]
            )
        except JWTError:
            return None
```

**Step 4: Verify pass**

```bash
cd api && uv run pytest tests/services/test_auth.py -v
```

**Step 5: Commit**

```bash
git add api/app/services/auth.py api/tests/services/test_auth.py
git commit -m "feat: add AuthService with password hashing and JWT tokens"
```

---

### Task 12: Auth routes (register + login)

**Files:**
- Create: `api/app/schemas/__init__.py`
- Create: `api/app/schemas/auth.py`
- Create: `api/app/routes/__init__.py`
- Create: `api/app/routes/auth.py`
- Create: `api/tests/routes/__init__.py`
- Create: `api/tests/routes/test_auth.py`
- Modify: `api/app/main.py` — include auth router

**Step 1: Write failing tests**

`api/tests/routes/test_auth.py`:

```python
def test_register_creates_user(client):
    response = client.post(
        "/auth/register",
        json={"email": "new@example.com", "password": "secret123"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "new@example.com"
    assert "id" in data
    assert "password" not in data
    assert "hashed_password" not in data


def test_register_rejects_duplicate_email(client):
    client.post(
        "/auth/register",
        json={"email": "dup@example.com", "password": "secret123"},
    )
    response = client.post(
        "/auth/register",
        json={"email": "dup@example.com", "password": "secret123"},
    )
    assert response.status_code == 400


def test_login_returns_token(client):
    client.post(
        "/auth/register",
        json={"email": "login@example.com", "password": "secret123"},
    )
    response = client.post(
        "/auth/login",
        json={"email": "login@example.com", "password": "secret123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_rejects_wrong_password(client):
    client.post(
        "/auth/register",
        json={"email": "wrong@example.com", "password": "secret123"},
    )
    response = client.post(
        "/auth/login",
        json={"email": "wrong@example.com", "password": "wrongpass"},
    )
    assert response.status_code == 401
```

**Step 2: Run to verify failure**

```bash
cd api && uv run pytest tests/routes/test_auth.py -v
```

**Step 3: Create auth schemas**

`api/app/schemas/auth.py`:

```python
from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    email: str
    password: str


class RegisterResponse(BaseModel):
    id: int
    email: str


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
```

`api/app/schemas/__init__.py`: empty file.

**Step 4: Create auth routes**

`api/app/routes/auth.py`:

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.database import get_session
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    RegisterResponse,
    TokenResponse,
)
from app.services.auth import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
def register(request: RegisterRequest, session: Session = Depends(get_session)):
    existing = session.exec(
        select(User).where(User.email == request.email)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=request.email,
        hashed_password=AuthService.hash_password(request.password),
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return RegisterResponse(id=user.id, email=user.email)


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == request.email)).first()
    if not user or not AuthService.verify_password(
        request.password, user.hashed_password
    ):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = AuthService.create_access_token({"sub": user.email})
    return TokenResponse(access_token=token)
```

`api/app/routes/__init__.py`: empty file.

**Step 5: Update main.py to include router**

`api/app/main.py`:

```python
from fastapi import FastAPI

from app.routes.auth import router as auth_router

app = FastAPI(title="Coffee Exp API", version="0.1.0")

app.include_router(auth_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
```

**Step 6: Verify pass**

```bash
cd api && uv run pytest tests/routes/test_auth.py -v
```

**Step 7: Commit**

```bash
git add api/app/schemas/ api/app/routes/ api/app/main.py api/tests/routes/
git commit -m "feat: add auth routes (register + login) with JWT"
```

---

### Task 13: Auth dependency (get_current_user)

**Files:**
- Create: `api/app/dependencies.py`
- Create: `api/tests/test_dependencies.py`

**Step 1: Write failing test**

`api/tests/test_dependencies.py`:

```python
import pytest
from fastapi import HTTPException

from app.dependencies import get_current_user
from app.models.user import User
from app.services.auth import AuthService


def test_get_current_user_returns_user(session):
    user = User(email="dep@example.com", hashed_password="hashed")
    session.add(user)
    session.commit()
    session.refresh(user)

    token = AuthService.create_access_token({"sub": user.email})
    result = get_current_user(token=token, session=session)
    assert result.email == "dep@example.com"


def test_get_current_user_raises_for_invalid_token(session):
    with pytest.raises(HTTPException) as exc_info:
        get_current_user(token="bad-token", session=session)
    assert exc_info.value.status_code == 401
```

**Step 2: Run to verify failure**

```bash
cd api && uv run pytest tests/test_dependencies.py -v
```

**Step 3: Implement get_current_user**

`api/app/dependencies.py`:

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlmodel import Session, select

from app.database import get_session
from app.models.user import User
from app.services.auth import AuthService

security = HTTPBearer()


def get_current_user(
    token: str = None,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session),
) -> User:
    token_str = token if token else credentials.credentials
    payload = AuthService.decode_access_token(token_str)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    email = payload.get("sub")
    user = session.exec(select(User).where(User.email == email)).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user
```

**Step 4: Verify pass**

```bash
cd api && uv run pytest tests/test_dependencies.py -v
```

**Step 5: Commit**

```bash
git add api/app/dependencies.py api/tests/test_dependencies.py
git commit -m "feat: add get_current_user auth dependency"
```

---

## Phase 4: API CRUD Routes (TDD)

### Task 14: CoffeeBrand CRUD routes

**Files:**
- Create: `api/app/schemas/coffee_brand.py`
- Create: `api/app/routes/coffee_brands.py`
- Create: `api/tests/routes/test_coffee_brands.py`
- Modify: `api/app/main.py` — include coffee_brands router
- Modify: `api/tests/conftest.py` — add `auth_header` fixture

**Step 1: Add auth_header fixture to conftest.py**

Add to `api/tests/conftest.py`:

```python
from app.models.user import User
from app.services.auth import AuthService


@pytest.fixture(name="auth_header")
def auth_header_fixture(session: Session):
    user = User(email="test@test.com", hashed_password=AuthService.hash_password("test"))
    session.add(user)
    session.commit()
    session.refresh(user)
    token = AuthService.create_access_token({"sub": user.email})
    return {"Authorization": f"Bearer {token}"}
```

**Step 2: Write failing tests**

`api/tests/routes/test_coffee_brands.py`:

```python
def test_create_coffee_brand(client, auth_header):
    response = client.post(
        "/coffee-brands",
        json={"name": "Illy", "country": "Italy"},
        headers=auth_header,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Illy"
    assert data["country"] == "Italy"
    assert "id" in data


def test_create_coffee_brand_requires_auth(client):
    response = client.post(
        "/coffee-brands",
        json={"name": "Illy", "country": "Italy"},
    )
    assert response.status_code == 403


def test_list_coffee_brands(client, auth_header):
    client.post("/coffee-brands", json={"name": "Illy", "country": "Italy"}, headers=auth_header)
    client.post("/coffee-brands", json={"name": "Lavazza", "country": "Italy"}, headers=auth_header)

    response = client.get("/coffee-brands", headers=auth_header)
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_get_coffee_brand(client, auth_header):
    create_response = client.post(
        "/coffee-brands", json={"name": "Illy", "country": "Italy"}, headers=auth_header
    )
    brand_id = create_response.json()["id"]

    response = client.get(f"/coffee-brands/{brand_id}", headers=auth_header)
    assert response.status_code == 200
    assert response.json()["name"] == "Illy"


def test_get_coffee_brand_not_found(client, auth_header):
    response = client.get("/coffee-brands/999", headers=auth_header)
    assert response.status_code == 404


def test_update_coffee_brand(client, auth_header):
    create_response = client.post(
        "/coffee-brands", json={"name": "Ily", "country": "Italy"}, headers=auth_header
    )
    brand_id = create_response.json()["id"]

    response = client.put(
        f"/coffee-brands/{brand_id}",
        json={"name": "Illy", "country": "Italy"},
        headers=auth_header,
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Illy"


def test_delete_coffee_brand(client, auth_header):
    create_response = client.post(
        "/coffee-brands", json={"name": "Illy", "country": "Italy"}, headers=auth_header
    )
    brand_id = create_response.json()["id"]

    response = client.delete(f"/coffee-brands/{brand_id}", headers=auth_header)
    assert response.status_code == 204

    response = client.get(f"/coffee-brands/{brand_id}", headers=auth_header)
    assert response.status_code == 404
```

**Step 3: Run to verify failure**

```bash
cd api && uv run pytest tests/routes/test_coffee_brands.py -v
```

**Step 4: Create schemas**

`api/app/schemas/coffee_brand.py`:

```python
from pydantic import BaseModel


class CoffeeBrandCreate(BaseModel):
    name: str
    country: str


class CoffeeBrandUpdate(BaseModel):
    name: str | None = None
    country: str | None = None


class CoffeeBrandResponse(BaseModel):
    id: int
    name: str
    country: str
```

**Step 5: Create routes**

`api/app/routes/coffee_brands.py`:

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.database import get_session
from app.dependencies import get_current_user
from app.models.coffee_brand import CoffeeBrand
from app.models.user import User
from app.schemas.coffee_brand import (
    CoffeeBrandCreate,
    CoffeeBrandResponse,
    CoffeeBrandUpdate,
)

router = APIRouter(prefix="/coffee-brands", tags=["coffee-brands"])


@router.post("/", response_model=CoffeeBrandResponse, status_code=status.HTTP_201_CREATED)
def create_coffee_brand(
    data: CoffeeBrandCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    brand = CoffeeBrand(**data.model_dump())
    session.add(brand)
    session.commit()
    session.refresh(brand)
    return brand


@router.get("/", response_model=list[CoffeeBrandResponse])
def list_coffee_brands(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return session.exec(select(CoffeeBrand)).all()


@router.get("/{brand_id}", response_model=CoffeeBrandResponse)
def get_coffee_brand(
    brand_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    brand = session.get(CoffeeBrand, brand_id)
    if not brand:
        raise HTTPException(status_code=404, detail="Coffee brand not found")
    return brand


@router.put("/{brand_id}", response_model=CoffeeBrandResponse)
def update_coffee_brand(
    brand_id: int,
    data: CoffeeBrandUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    brand = session.get(CoffeeBrand, brand_id)
    if not brand:
        raise HTTPException(status_code=404, detail="Coffee brand not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(brand, key, value)
    session.add(brand)
    session.commit()
    session.refresh(brand)
    return brand


@router.delete("/{brand_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_coffee_brand(
    brand_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    brand = session.get(CoffeeBrand, brand_id)
    if not brand:
        raise HTTPException(status_code=404, detail="Coffee brand not found")
    session.delete(brand)
    session.commit()
```

**Step 6: Update main.py**

Add to `api/app/main.py`:

```python
from app.routes.coffee_brands import router as coffee_brands_router

app.include_router(coffee_brands_router)
```

**Step 7: Verify pass**

```bash
cd api && uv run pytest tests/routes/test_coffee_brands.py -v
```

**Step 8: Commit**

```bash
git add api/app/schemas/coffee_brand.py api/app/routes/coffee_brands.py api/tests/routes/test_coffee_brands.py api/app/main.py api/tests/conftest.py
git commit -m "feat: add CoffeeBrand CRUD routes with auth"
```

---

### Task 15: Coffee CRUD routes

**Files:**
- Create: `api/app/schemas/coffee.py`
- Create: `api/app/routes/coffees.py`
- Create: `api/tests/routes/test_coffees.py`
- Modify: `api/app/main.py` — include coffees router

**Step 1: Write failing tests**

`api/tests/routes/test_coffees.py`:

```python
def _create_brand(client, auth_header):
    response = client.post(
        "/coffee-brands", json={"name": "Illy", "country": "Italy"}, headers=auth_header
    )
    return response.json()["id"]


def test_create_coffee(client, auth_header):
    brand_id = _create_brand(client, auth_header)
    response = client.post(
        "/coffees",
        json={"name": "Classico", "price": "14.50", "coffee_brand_id": brand_id},
        headers=auth_header,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Classico"
    assert data["price"] == "14.50"


def test_list_coffees(client, auth_header):
    brand_id = _create_brand(client, auth_header)
    client.post("/coffees", json={"name": "A", "price": "10.00", "coffee_brand_id": brand_id}, headers=auth_header)
    client.post("/coffees", json={"name": "B", "price": "12.00", "coffee_brand_id": brand_id}, headers=auth_header)

    response = client.get("/coffees", headers=auth_header)
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_list_coffees_filter_by_brand(client, auth_header):
    brand1 = client.post("/coffee-brands", json={"name": "Illy", "country": "Italy"}, headers=auth_header).json()["id"]
    brand2 = client.post("/coffee-brands", json={"name": "Lavazza", "country": "Italy"}, headers=auth_header).json()["id"]
    client.post("/coffees", json={"name": "A", "price": "10.00", "coffee_brand_id": brand1}, headers=auth_header)
    client.post("/coffees", json={"name": "B", "price": "12.00", "coffee_brand_id": brand2}, headers=auth_header)

    response = client.get(f"/coffees?brand_id={brand1}", headers=auth_header)
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["name"] == "A"


def test_get_coffee(client, auth_header):
    brand_id = _create_brand(client, auth_header)
    create_response = client.post(
        "/coffees", json={"name": "Classico", "price": "14.50", "coffee_brand_id": brand_id}, headers=auth_header
    )
    coffee_id = create_response.json()["id"]

    response = client.get(f"/coffees/{coffee_id}", headers=auth_header)
    assert response.status_code == 200
    assert response.json()["name"] == "Classico"


def test_update_coffee(client, auth_header):
    brand_id = _create_brand(client, auth_header)
    create_response = client.post(
        "/coffees", json={"name": "Clasico", "price": "14.50", "coffee_brand_id": brand_id}, headers=auth_header
    )
    coffee_id = create_response.json()["id"]

    response = client.put(
        f"/coffees/{coffee_id}",
        json={"name": "Classico"},
        headers=auth_header,
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Classico"


def test_delete_coffee(client, auth_header):
    brand_id = _create_brand(client, auth_header)
    create_response = client.post(
        "/coffees", json={"name": "Classico", "price": "14.50", "coffee_brand_id": brand_id}, headers=auth_header
    )
    coffee_id = create_response.json()["id"]

    response = client.delete(f"/coffees/{coffee_id}", headers=auth_header)
    assert response.status_code == 204
```

**Step 2: Run to verify failure**

```bash
cd api && uv run pytest tests/routes/test_coffees.py -v
```

**Step 3: Create schemas**

`api/app/schemas/coffee.py`:

```python
from pydantic import BaseModel


class CoffeeCreate(BaseModel):
    name: str
    price: str
    coffee_brand_id: int | None = None


class CoffeeUpdate(BaseModel):
    name: str | None = None
    price: str | None = None
    coffee_brand_id: int | None = None


class CoffeeResponse(BaseModel):
    id: int
    name: str
    price: str
    coffee_brand_id: int | None = None
```

**Step 4: Create routes**

`api/app/routes/coffees.py`:

```python
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session, select

from app.database import get_session
from app.dependencies import get_current_user
from app.models.coffee import Coffee
from app.models.user import User
from app.schemas.coffee import CoffeeCreate, CoffeeResponse, CoffeeUpdate

router = APIRouter(prefix="/coffees", tags=["coffees"])


@router.post("/", response_model=CoffeeResponse, status_code=status.HTTP_201_CREATED)
def create_coffee(
    data: CoffeeCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    coffee = Coffee(
        name=data.name,
        price=Decimal(data.price),
        coffee_brand_id=data.coffee_brand_id,
    )
    session.add(coffee)
    session.commit()
    session.refresh(coffee)
    return CoffeeResponse(
        id=coffee.id, name=coffee.name, price=str(coffee.price), coffee_brand_id=coffee.coffee_brand_id
    )


@router.get("/", response_model=list[CoffeeResponse])
def list_coffees(
    brand_id: int | None = Query(default=None),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    statement = select(Coffee)
    if brand_id is not None:
        statement = statement.where(Coffee.coffee_brand_id == brand_id)
    coffees = session.exec(statement).all()
    return [
        CoffeeResponse(id=c.id, name=c.name, price=str(c.price), coffee_brand_id=c.coffee_brand_id)
        for c in coffees
    ]


@router.get("/{coffee_id}", response_model=CoffeeResponse)
def get_coffee(
    coffee_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    coffee = session.get(Coffee, coffee_id)
    if not coffee:
        raise HTTPException(status_code=404, detail="Coffee not found")
    return CoffeeResponse(
        id=coffee.id, name=coffee.name, price=str(coffee.price), coffee_brand_id=coffee.coffee_brand_id
    )


@router.put("/{coffee_id}", response_model=CoffeeResponse)
def update_coffee(
    coffee_id: int,
    data: CoffeeUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    coffee = session.get(Coffee, coffee_id)
    if not coffee:
        raise HTTPException(status_code=404, detail="Coffee not found")
    update_data = data.model_dump(exclude_unset=True)
    if "price" in update_data:
        update_data["price"] = Decimal(update_data["price"])
    for key, value in update_data.items():
        setattr(coffee, key, value)
    session.add(coffee)
    session.commit()
    session.refresh(coffee)
    return CoffeeResponse(
        id=coffee.id, name=coffee.name, price=str(coffee.price), coffee_brand_id=coffee.coffee_brand_id
    )


@router.delete("/{coffee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_coffee(
    coffee_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    coffee = session.get(Coffee, coffee_id)
    if not coffee:
        raise HTTPException(status_code=404, detail="Coffee not found")
    session.delete(coffee)
    session.commit()
```

**Step 5: Update main.py**

Add to `api/app/main.py`:

```python
from app.routes.coffees import router as coffees_router

app.include_router(coffees_router)
```

**Step 6: Verify pass**

```bash
cd api && uv run pytest tests/routes/test_coffees.py -v
```

**Step 7: Commit**

```bash
git add api/app/schemas/coffee.py api/app/routes/coffees.py api/tests/routes/test_coffees.py api/app/main.py
git commit -m "feat: add Coffee CRUD routes with brand filtering"
```

---

### Task 16: Brewing CRUD routes (with inline rating)

**Files:**
- Create: `api/app/schemas/brewing.py`
- Create: `api/app/routes/brewings.py`
- Create: `api/tests/routes/test_brewings.py`
- Modify: `api/app/main.py` — include brewings router

**Step 1: Write failing tests**

`api/tests/routes/test_brewings.py`:

```python
def _setup_coffee(client, auth_header):
    brand = client.post(
        "/coffee-brands", json={"name": "Illy", "country": "Italy"}, headers=auth_header
    ).json()
    coffee = client.post(
        "/coffees",
        json={"name": "Classico", "price": "14.50", "coffee_brand_id": brand["id"]},
        headers=auth_header,
    ).json()
    return coffee["id"]


def test_create_brewing_with_rating(client, auth_header):
    coffee_id = _setup_coffee(client, auth_header)
    response = client.post(
        "/brewings",
        json={
            "coffee_id": coffee_id,
            "method": "V60",
            "grams": 15,
            "ml": 250,
            "notes": "Fruity and bright",
            "latitude": 52.3676,
            "longitude": 4.9041,
            "location": "Amsterdam, NL",
            "rating": {
                "flavor": 4,
                "acidic": 3,
                "aroma": 5,
                "appearance": 4,
                "bitter": 2,
            },
        },
        headers=auth_header,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["method"] == "V60"
    assert data["notes"] == "Fruity and bright"
    assert data["latitude"] == 52.3676
    assert data["location"] == "Amsterdam, NL"
    assert data["rating"]["overall"] == 4


def test_list_brewings(client, auth_header):
    coffee_id = _setup_coffee(client, auth_header)
    for i in range(3):
        client.post(
            "/brewings",
            json={
                "coffee_id": coffee_id,
                "method": "V60",
                "grams": 15,
                "ml": 250,
                "rating": {"flavor": 3, "acidic": 3, "aroma": 3, "appearance": 3, "bitter": 3},
            },
            headers=auth_header,
        )

    response = client.get("/brewings", headers=auth_header)
    assert response.status_code == 200
    assert len(response.json()) == 3


def test_get_brewing_includes_relations(client, auth_header):
    coffee_id = _setup_coffee(client, auth_header)
    create_response = client.post(
        "/brewings",
        json={
            "coffee_id": coffee_id,
            "method": "V60",
            "grams": 15,
            "ml": 250,
            "rating": {"flavor": 4, "acidic": 3, "aroma": 5, "appearance": 4, "bitter": 2},
        },
        headers=auth_header,
    )
    brewing_id = create_response.json()["id"]

    response = client.get(f"/brewings/{brewing_id}", headers=auth_header)
    assert response.status_code == 200
    data = response.json()
    assert data["coffee"]["name"] == "Classico"
    assert data["coffee"]["brand"]["name"] == "Illy"
    assert data["rating"]["flavor"] == 4


def test_update_brewing(client, auth_header):
    coffee_id = _setup_coffee(client, auth_header)
    create_response = client.post(
        "/brewings",
        json={
            "coffee_id": coffee_id,
            "method": "V60",
            "grams": 15,
            "ml": 250,
            "rating": {"flavor": 3, "acidic": 3, "aroma": 3, "appearance": 3, "bitter": 3},
        },
        headers=auth_header,
    )
    brewing_id = create_response.json()["id"]

    response = client.put(
        f"/brewings/{brewing_id}",
        json={"notes": "Actually quite good"},
        headers=auth_header,
    )
    assert response.status_code == 200
    assert response.json()["notes"] == "Actually quite good"


def test_delete_brewing(client, auth_header):
    coffee_id = _setup_coffee(client, auth_header)
    create_response = client.post(
        "/brewings",
        json={
            "coffee_id": coffee_id,
            "method": "V60",
            "grams": 15,
            "ml": 250,
            "rating": {"flavor": 3, "acidic": 3, "aroma": 3, "appearance": 3, "bitter": 3},
        },
        headers=auth_header,
    )
    brewing_id = create_response.json()["id"]

    response = client.delete(f"/brewings/{brewing_id}", headers=auth_header)
    assert response.status_code == 204
```

**Step 2: Run to verify failure**

```bash
cd api && uv run pytest tests/routes/test_brewings.py -v
```

**Step 3: Create schemas**

`api/app/schemas/brewing.py`:

```python
from pydantic import BaseModel


class RatingCreate(BaseModel):
    flavor: int
    acidic: int
    aroma: int
    appearance: int
    bitter: int


class RatingResponse(BaseModel):
    id: int
    flavor: int
    acidic: int
    aroma: int
    appearance: int
    bitter: int
    overall: int


class CoffeeBrandNested(BaseModel):
    id: int
    name: str
    country: str


class CoffeeNested(BaseModel):
    id: int
    name: str
    price: str
    brand: CoffeeBrandNested | None = None


class BrewingCreate(BaseModel):
    coffee_id: int
    method: str
    grams: int
    ml: int
    notes: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    location: str | None = None
    rating: RatingCreate


class BrewingUpdate(BaseModel):
    method: str | None = None
    grams: int | None = None
    ml: int | None = None
    notes: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    location: str | None = None


class BrewingResponse(BaseModel):
    id: int
    method: str
    grams: int
    ml: int
    notes: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    location: str | None = None
    created_at: str
    rating: RatingResponse | None = None
    coffee: CoffeeNested | None = None
```

**Step 4: Create routes**

`api/app/routes/brewings.py`:

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.database import get_session
from app.dependencies import get_current_user
from app.models.brewing import Brewing
from app.models.rating import Rating
from app.models.user import User
from app.schemas.brewing import (
    BrewingCreate,
    BrewingResponse,
    BrewingUpdate,
    CoffeeBrandNested,
    CoffeeNested,
    RatingResponse,
)

router = APIRouter(prefix="/brewings", tags=["brewings"])


def _build_response(brewing: Brewing) -> BrewingResponse:
    rating_resp = None
    if brewing.rating:
        rating_resp = RatingResponse(
            id=brewing.rating.id,
            flavor=brewing.rating.flavor,
            acidic=brewing.rating.acidic,
            aroma=brewing.rating.aroma,
            appearance=brewing.rating.appearance,
            bitter=brewing.rating.bitter,
            overall=brewing.rating.overall,
        )
    coffee_resp = None
    if brewing.coffee:
        brand_resp = None
        if brewing.coffee.coffee_brand:
            brand_resp = CoffeeBrandNested(
                id=brewing.coffee.coffee_brand.id,
                name=brewing.coffee.coffee_brand.name,
                country=brewing.coffee.coffee_brand.country,
            )
        coffee_resp = CoffeeNested(
            id=brewing.coffee.id,
            name=brewing.coffee.name,
            price=str(brewing.coffee.price),
            brand=brand_resp,
        )
    return BrewingResponse(
        id=brewing.id,
        method=brewing.method,
        grams=brewing.grams,
        ml=brewing.ml,
        notes=brewing.notes,
        latitude=brewing.latitude,
        longitude=brewing.longitude,
        location=brewing.location,
        created_at=brewing.created_at.isoformat(),
        rating=rating_resp,
        coffee=coffee_resp,
    )


@router.post("/", response_model=BrewingResponse, status_code=status.HTTP_201_CREATED)
def create_brewing(
    data: BrewingCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    rating = Rating(**data.rating.model_dump())
    session.add(rating)
    session.commit()
    session.refresh(rating)

    brewing = Brewing(
        coffee_id=data.coffee_id,
        rating_id=rating.id,
        method=data.method,
        grams=data.grams,
        ml=data.ml,
        notes=data.notes,
        latitude=data.latitude,
        longitude=data.longitude,
        location=data.location,
    )
    session.add(brewing)
    session.commit()
    session.refresh(brewing)
    return _build_response(brewing)


@router.get("/", response_model=list[BrewingResponse])
def list_brewings(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    brewings = session.exec(select(Brewing).order_by(Brewing.created_at.desc())).all()
    return [_build_response(b) for b in brewings]


@router.get("/{brewing_id}", response_model=BrewingResponse)
def get_brewing(
    brewing_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    brewing = session.get(Brewing, brewing_id)
    if not brewing:
        raise HTTPException(status_code=404, detail="Brewing not found")
    return _build_response(brewing)


@router.put("/{brewing_id}", response_model=BrewingResponse)
def update_brewing(
    brewing_id: int,
    data: BrewingUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    brewing = session.get(Brewing, brewing_id)
    if not brewing:
        raise HTTPException(status_code=404, detail="Brewing not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(brewing, key, value)
    session.add(brewing)
    session.commit()
    session.refresh(brewing)
    return _build_response(brewing)


@router.delete("/{brewing_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_brewing(
    brewing_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    brewing = session.get(Brewing, brewing_id)
    if not brewing:
        raise HTTPException(status_code=404, detail="Brewing not found")
    if brewing.rating:
        session.delete(brewing.rating)
    session.delete(brewing)
    session.commit()
```

**Step 5: Update main.py**

Add to `api/app/main.py`:

```python
from app.routes.brewings import router as brewings_router

app.include_router(brewings_router)
```

**Step 6: Verify pass**

```bash
cd api && uv run pytest tests/routes/test_brewings.py -v
```

**Step 7: Run full API test suite**

```bash
cd api && uv run pytest -v
```

Expected: ALL PASS

**Step 8: Commit**

```bash
git add api/app/schemas/brewing.py api/app/routes/brewings.py api/tests/routes/test_brewings.py api/app/main.py
git commit -m "feat: add Brewing CRUD routes with inline rating creation"
```

---

## Phase 5: Web Frontend

### Task 17: Web project scaffold

**Files:**
- Create: `web/` via Vite scaffold
- Create: `web/Dockerfile`

**Step 1: Scaffold React + TypeScript project with Vite**

```bash
cd /Users/henriquecaltram/personal_projects/coffee_exp
npm create vite@latest web -- --template react-ts
```

**Step 2: Install dependencies**

```bash
cd web
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install @tanstack/react-query axios react-router-dom
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**Step 3: Create Dockerfile**

`web/Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
```

**Step 4: Configure Vitest**

Update `web/vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

Create `web/src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom'
```

**Step 5: Commit**

```bash
git add web/
git commit -m "feat: scaffold web app with React, MUI, Vite, and Vitest"
```

---

### Task 18: Web API client & auth context

**Files:**
- Create: `web/src/api/client.ts`
- Create: `web/src/api/auth.ts`
- Create: `web/src/contexts/AuthContext.tsx`
- Create: `web/src/test/setup.ts` (if not done)

**Step 1: Write failing test**

`web/src/api/__tests__/client.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { apiClient } from '../client'

describe('apiClient', () => {
  it('has correct base URL', () => {
    expect(apiClient.defaults.baseURL).toBeDefined()
  })
})
```

**Step 2: Implement API client**

`web/src/api/client.ts`:

```typescript
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

**Step 3: Implement auth API**

`web/src/api/auth.ts`:

```typescript
import { apiClient } from './client'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<TokenResponse>('/auth/login', data),

  register: (data: RegisterRequest) =>
    apiClient.post('/auth/register', data),
}
```

**Step 4: Implement AuthContext**

`web/src/contexts/AuthContext.tsx`:

```tsx
import { createContext, useContext, useState, ReactNode } from 'react'
import { authApi, LoginRequest, RegisterRequest } from '../api/auth'

interface AuthContextType {
  token: string | null
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  )

  const login = async (data: LoginRequest) => {
    const response = await authApi.login(data)
    const newToken = response.data.access_token
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  const register = async (data: RegisterRequest) => {
    await authApi.register(data)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated: !!token, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

**Step 5: Verify test passes**

```bash
cd web && npx vitest run
```

**Step 6: Commit**

```bash
git add web/src/api/ web/src/contexts/
git commit -m "feat: add web API client and auth context"
```

---

### Task 19: Web login screen

**Files:**
- Create: `web/src/pages/LoginPage.tsx`
- Create: `web/src/pages/__tests__/LoginPage.test.tsx`

**Step 1: Write failing test**

`web/src/pages/__tests__/LoginPage.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '../../contexts/AuthContext'
import LoginPage from '../LoginPage'

const renderLoginPage = () => {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

describe('LoginPage', () => {
  it('renders email and password fields', () => {
    renderLoginPage()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('renders login button', () => {
    renderLoginPage()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('renders link to register', () => {
    renderLoginPage()
    expect(screen.getByText(/register/i)).toBeInTheDocument()
  })
})
```

**Step 2: Run to verify failure**

```bash
cd web && npx vitest run src/pages/__tests__/LoginPage.test.tsx
```

**Step 3: Implement LoginPage**

`web/src/pages/LoginPage.tsx`:

```tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Box, Button, Container, TextField, Typography, Alert } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login({ email, password })
      navigate('/')
    } catch {
      setError('Invalid credentials')
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Coffee Exp
        </Typography>
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </Box>
        <Typography sx={{ mt: 2 }}>
          Don't have an account? <Link to="/register">Register</Link>
        </Typography>
      </Box>
    </Container>
  )
}
```

**Step 4: Verify pass**

```bash
cd web && npx vitest run src/pages/__tests__/LoginPage.test.tsx
```

**Step 5: Commit**

```bash
git add web/src/pages/
git commit -m "feat: add web login page with MUI"
```

---

### Task 20: Web app routing & layout

**Files:**
- Modify: `web/src/App.tsx`
- Create: `web/src/pages/RegisterPage.tsx`
- Create: `web/src/pages/BrewingListPage.tsx` (stub)
- Create: `web/src/components/Layout.tsx`

**Step 1: Implement Layout**

`web/src/components/Layout.tsx`:

```tsx
import { Outlet, useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
            Coffee Exp
          </Typography>
          <Button color="inherit" onClick={() => navigate('/coffees')}>Coffees</Button>
          <Button color="inherit" onClick={() => { logout(); navigate('/login') }}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 3 }}>
        <Outlet />
      </Container>
    </Box>
  )
}
```

**Step 2: Create stub BrewingListPage**

`web/src/pages/BrewingListPage.tsx`:

```tsx
import { Typography } from '@mui/material'

export default function BrewingListPage() {
  return <Typography variant="h4">My Brewings</Typography>
}
```

**Step 3: Create RegisterPage**

`web/src/pages/RegisterPage.tsx`:

```tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Box, Button, Container, TextField, Typography, Alert } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await register({ email, password })
      navigate('/login')
    } catch {
      setError('Registration failed')
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>Register</Typography>
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField label="Email" type="email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Register</Button>
        </Box>
        <Typography sx={{ mt: 2 }}>
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Box>
    </Container>
  )
}
```

**Step 4: Update App.tsx with routing**

`web/src/App.tsx`:

```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, createTheme } from '@mui/material'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BrewingListPage from './pages/BrewingListPage'

const queryClient = new QueryClient()
const theme = createTheme()

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<BrewingListPage />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
```

**Step 5: Verify tests pass**

```bash
cd web && npx vitest run
```

**Step 6: Commit**

```bash
git add web/src/
git commit -m "feat: add web app routing, layout, register page"
```

---

### Task 21: Web brewing list page

**Files:**
- Create: `web/src/api/brewings.ts`
- Modify: `web/src/pages/BrewingListPage.tsx`
- Create: `web/src/pages/__tests__/BrewingListPage.test.tsx`

**Step 1: Create brewings API module**

`web/src/api/brewings.ts`:

```typescript
import { apiClient } from './client'

export interface Rating {
  id: number
  flavor: number
  acidic: number
  aroma: number
  appearance: number
  bitter: number
  overall: number
}

export interface CoffeeBrand {
  id: number
  name: string
  country: string
}

export interface Coffee {
  id: number
  name: string
  price: string
  brand: CoffeeBrand | null
}

export interface Brewing {
  id: number
  method: string
  grams: number
  ml: number
  notes: string | null
  latitude: number | null
  longitude: number | null
  location: string | null
  created_at: string
  rating: Rating | null
  coffee: Coffee | null
}

export interface CreateBrewingRequest {
  coffee_id: number
  method: string
  grams: number
  ml: number
  notes?: string
  latitude?: number
  longitude?: number
  location?: string
  rating: {
    flavor: number
    acidic: number
    aroma: number
    appearance: number
    bitter: number
  }
}

export const brewingsApi = {
  list: () => apiClient.get<Brewing[]>('/brewings'),
  get: (id: number) => apiClient.get<Brewing>(`/brewings/${id}`),
  create: (data: CreateBrewingRequest) => apiClient.post<Brewing>('/brewings', data),
  update: (id: number, data: Partial<Brewing>) => apiClient.put<Brewing>(`/brewings/${id}`, data),
  delete: (id: number) => apiClient.delete(`/brewings/${id}`),
}
```

**Step 2: Write failing test for BrewingListPage**

`web/src/pages/__tests__/BrewingListPage.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import BrewingListPage from '../BrewingListPage'

vi.mock('../../api/brewings', () => ({
  brewingsApi: {
    list: vi.fn().mockResolvedValue({
      data: [
        {
          id: 1,
          method: 'V60',
          grams: 15,
          ml: 250,
          notes: 'Great cup',
          location: 'Amsterdam, NL',
          created_at: '2026-02-22T10:00:00',
          rating: { id: 1, flavor: 4, acidic: 3, aroma: 5, appearance: 4, bitter: 2, overall: 4 },
          coffee: { id: 1, name: 'Classico', price: '14.50', brand: { id: 1, name: 'Illy', country: 'Italy' } },
        },
      ],
    }),
  },
}))

const renderPage = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <BrewingListPage />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('BrewingListPage', () => {
  it('renders page title', () => {
    renderPage()
    expect(screen.getByText(/my brewings/i)).toBeInTheDocument()
  })

  it('displays brewing data after loading', async () => {
    renderPage()
    expect(await screen.findByText('V60')).toBeInTheDocument()
    expect(await screen.findByText('Classico')).toBeInTheDocument()
  })
})
```

**Step 3: Run to verify failure**

```bash
cd web && npx vitest run src/pages/__tests__/BrewingListPage.test.tsx
```

**Step 4: Implement BrewingListPage**

`web/src/pages/BrewingListPage.tsx`:

```tsx
import { useQuery } from '@tanstack/react-query'
import {
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Chip,
  Box,
  CircularProgress,
  Fab,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom'
import { brewingsApi, Brewing } from '../api/brewings'

export default function BrewingListPage() {
  const navigate = useNavigate()
  const { data: brewings, isLoading } = useQuery({
    queryKey: ['brewings'],
    queryFn: () => brewingsApi.list().then((r) => r.data),
  })

  if (isLoading) return <CircularProgress />

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Brewings
      </Typography>
      <Grid container spacing={2}>
        {brewings?.map((brewing: Brewing) => (
          <Grid item xs={12} sm={6} md={4} key={brewing.id}>
            <Card>
              <CardActionArea onClick={() => navigate(`/brewings/${brewing.id}`)}>
                <CardContent>
                  <Typography variant="h6">{brewing.coffee?.name}</Typography>
                  <Typography color="text.secondary">{brewing.coffee?.brand?.name}</Typography>
                  <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={brewing.method} size="small" />
                    <Chip label={`${brewing.grams}g / ${brewing.ml}ml`} size="small" variant="outlined" />
                    {brewing.rating && (
                      <Chip label={`${brewing.rating.overall}/5`} size="small" color="primary" />
                    )}
                  </Box>
                  {brewing.location && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {brewing.location}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {new Date(brewing.created_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Fab color="primary" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={() => navigate('/brewings/new')}>
        <AddIcon />
      </Fab>
    </Box>
  )
}
```

**Step 5: Verify pass**

```bash
cd web && npx vitest run src/pages/__tests__/BrewingListPage.test.tsx
```

**Step 6: Commit**

```bash
git add web/src/
git commit -m "feat: add web brewing list page with TanStack Query"
```

---

### Task 22: Web brewing detail page + new brewing form

**Files:**
- Create: `web/src/pages/BrewingDetailPage.tsx`
- Create: `web/src/pages/NewBrewingPage.tsx`
- Create: `web/src/api/coffees.ts`
- Modify: `web/src/App.tsx` — add routes

This task follows the same TDD pattern: write tests first for each component (renders expected elements), then implement, then verify.

**Step 1: Create coffees API**

`web/src/api/coffees.ts`:

```typescript
import { apiClient } from './client'
import { CoffeeBrand } from './brewings'

export interface CoffeeDetail {
  id: number
  name: string
  price: string
  coffee_brand_id: number | null
}

export const coffeesApi = {
  list: (brandId?: number) => {
    const params = brandId ? { brand_id: brandId } : {}
    return apiClient.get<CoffeeDetail[]>('/coffees', { params })
  },
  get: (id: number) => apiClient.get<CoffeeDetail>(`/coffees/${id}`),
  create: (data: { name: string; price: string; coffee_brand_id?: number }) =>
    apiClient.post<CoffeeDetail>('/coffees', data),
}

export const coffeeBrandsApi = {
  list: () => apiClient.get<CoffeeBrand[]>('/coffee-brands'),
  create: (data: { name: string; country: string }) =>
    apiClient.post<CoffeeBrand>('/coffee-brands', data),
}
```

**Step 2: Implement BrewingDetailPage**

`web/src/pages/BrewingDetailPage.tsx`:

```tsx
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Button,
  Rating as MuiRating,
  Grid,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { brewingsApi } from '../api/brewings'

export default function BrewingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: brewing, isLoading } = useQuery({
    queryKey: ['brewing', id],
    queryFn: () => brewingsApi.get(Number(id)).then((r) => r.data),
  })

  if (isLoading) return <CircularProgress />
  if (!brewing) return <Typography>Brewing not found</Typography>

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>Back</Button>
      <Typography variant="h4" sx={{ mt: 2 }}>{brewing.coffee?.name}</Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {brewing.coffee?.brand?.name} &mdash; {brewing.coffee?.brand?.country}
      </Typography>

      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Method</Typography>
              <Chip label={brewing.method} />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Ratio</Typography>
              <Typography>{brewing.grams}g / {brewing.ml}ml</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Location</Typography>
              <Typography>{brewing.location || 'Not recorded'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Date</Typography>
              <Typography>{new Date(brewing.created_at).toLocaleString()}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {brewing.rating && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Rating ({brewing.rating.overall}/5)</Typography>
            {['flavor', 'acidic', 'aroma', 'appearance', 'bitter'].map((field) => (
              <Box key={field} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ width: 100, textTransform: 'capitalize' }}>{field}</Typography>
                <MuiRating value={brewing.rating![field as keyof typeof brewing.rating] as number} readOnly max={5} />
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {brewing.notes && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Notes</Typography>
            <Typography>{brewing.notes}</Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
```

**Step 3: Implement NewBrewingPage**

`web/src/pages/NewBrewingPage.tsx`:

```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  Rating as MuiRating,
  Alert,
} from '@mui/material'
import { brewingsApi, CreateBrewingRequest } from '../api/brewings'
import { coffeesApi } from '../api/coffees'

export default function NewBrewingPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    coffee_id: 0,
    method: '',
    grams: 0,
    ml: 0,
    notes: '',
    flavor: 3,
    acidic: 3,
    aroma: 3,
    appearance: 3,
    bitter: 3,
  })

  const { data: coffees } = useQuery({
    queryKey: ['coffees'],
    queryFn: () => coffeesApi.list().then((r) => r.data),
  })

  const mutation = useMutation({
    mutationFn: (data: CreateBrewingRequest) => brewingsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brewings'] })
      navigate('/')
    },
    onError: () => setError('Failed to create brewing'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      coffee_id: form.coffee_id,
      method: form.method,
      grams: form.grams,
      ml: form.ml,
      notes: form.notes || undefined,
      rating: {
        flavor: form.flavor,
        acidic: form.acidic,
        aroma: form.aroma,
        appearance: form.appearance,
        bitter: form.bitter,
      },
    })
  }

  const update = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }))

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h4" gutterBottom>New Brewing</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField select label="Coffee" fullWidth margin="normal" value={form.coffee_id || ''} onChange={(e) => update('coffee_id', Number(e.target.value))} required>
        {coffees?.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
      </TextField>

      <TextField label="Method" fullWidth margin="normal" value={form.method} onChange={(e) => update('method', e.target.value)} placeholder="e.g. V60, French Press" required />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField label="Grams" type="number" margin="normal" value={form.grams || ''} onChange={(e) => update('grams', Number(e.target.value))} required />
        <TextField label="ML" type="number" margin="normal" value={form.ml || ''} onChange={(e) => update('ml', Number(e.target.value))} required />
      </Box>

      <TextField label="Notes" fullWidth multiline rows={3} margin="normal" value={form.notes} onChange={(e) => update('notes', e.target.value)} />

      <Typography variant="h6" sx={{ mt: 2 }}>Rating</Typography>
      {['flavor', 'acidic', 'aroma', 'appearance', 'bitter'].map((field) => (
        <Box key={field} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography sx={{ width: 100, textTransform: 'capitalize' }}>{field}</Typography>
          <MuiRating value={form[field as keyof typeof form] as number} onChange={(_, v) => update(field, v ?? 1)} max={5} />
        </Box>
      ))}

      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={mutation.isPending}>
        Save Brewing
      </Button>
    </Box>
  )
}
```

**Step 4: Update App.tsx routes**

Add to the protected routes in `web/src/App.tsx`:

```tsx
import BrewingDetailPage from './pages/BrewingDetailPage'
import NewBrewingPage from './pages/NewBrewingPage'

// Inside the protected Route element:
<Route path="/brewings/new" element={<NewBrewingPage />} />
<Route path="/brewings/:id" element={<BrewingDetailPage />} />
```

**Step 5: Run all web tests**

```bash
cd web && npx vitest run
```

**Step 6: Commit**

```bash
git add web/src/
git commit -m "feat: add brewing detail, new brewing form, and coffees API"
```

---

### Task 23: Web coffee list & detail pages

**Files:**
- Create: `web/src/pages/CoffeeListPage.tsx`
- Create: `web/src/pages/CoffeeDetailPage.tsx`
- Modify: `web/src/App.tsx` — add coffee routes

Follow the same TDD pattern. These pages list coffees with their brands and show a coffee's brewing history.

Implementation follows the same patterns as brewing pages — use TanStack Query, MUI components, and route to detail views. Add routes `/coffees` and `/coffees/:id` to App.tsx.

**Commit:**

```bash
git add web/src/
git commit -m "feat: add coffee list and detail pages"
```

---

## Phase 6: Mobile App (Expo)

### Task 24: Mobile project scaffold

**Step 1: Create Expo project**

```bash
cd /Users/henriquecaltram/personal_projects/coffee_exp
npx create-expo-app@latest mobile --template blank-typescript
```

**Step 2: Install dependencies**

```bash
cd mobile
npx expo install react-native-paper react-native-safe-area-context
npx expo install expo-location expo-router expo-constants expo-linking
npm install @tanstack/react-query axios
npm install -D @testing-library/react-native jest-expo
```

**Step 3: Commit**

```bash
git add mobile/
git commit -m "feat: scaffold mobile app with Expo and React Native Paper"
```

---

### Task 25: Mobile API client & auth

**Files:**
- Create: `mobile/src/api/client.ts`
- Create: `mobile/src/api/auth.ts`
- Create: `mobile/src/contexts/AuthContext.tsx`

Same API client pattern as web, but using `expo-secure-store` for token storage instead of `localStorage`. Same auth context pattern with login/register/logout.

**Commit:**

```bash
git add mobile/src/
git commit -m "feat: add mobile API client and auth context"
```

---

### Task 26: Mobile screens (login, brewing list, brewing detail, new brewing)

Mobile screens follow the same patterns as web but use React Native Paper components instead of MUI, and Expo Router instead of React Router. The key mobile-specific addition is `expo-location` for GPS capture in the new brewing form.

Each screen follows TDD: write component tests with React Native Testing Library first, then implement.

Key screens:
- Login screen (React Native Paper TextInput + Button)
- Brewing list (FlatList with Paper Card components)
- Brewing detail (ScrollView with rating display)
- New brewing form (with `expo-location` for GPS capture)

**Commit after each screen.**

---

## Phase 7: Integration & Polish

### Task 27: Docker Compose full stack verification

**Step 1: Build and start all services**

```bash
cd /Users/henriquecaltram/personal_projects/coffee_exp
docker compose up --build
```

**Step 2: Verify services**

- `http://localhost:8000/health` returns `{"status": "ok"}`
- `http://localhost:8000/docs` shows Swagger UI with all endpoints
- `http://localhost:3000` loads the web app login page
- API tests pass inside the container:

```bash
docker compose up db-test -d
docker compose exec api uv run pytest -v
```

**Step 3: Commit any fixes**

```bash
git add .
git commit -m "fix: docker compose integration adjustments"
```

---

### Task 28: Run full test suites and verify

**Step 1: API tests**

```bash
cd api && uv run pytest -v --cov
```

**Step 2: Web tests**

```bash
cd web && npx vitest run
```

**Step 3: Mobile tests**

```bash
cd mobile && npx jest
```

All should pass. Fix any issues before proceeding.

**Final commit:**

```bash
git add .
git commit -m "chore: verify full test suite passes across all services"
```

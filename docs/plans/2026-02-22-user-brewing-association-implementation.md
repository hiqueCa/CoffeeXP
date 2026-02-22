# User-Brewing Association Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Associate Brewing records with the authenticated User so each user only sees and manages their own brewings.

**Architecture:** Add `user_id` FK to Brewing model, scope all brewing routes by current user, return 404 for unauthorized access. Coffee/CoffeeBrand remain shared.

**Tech Stack:** FastAPI, SQLModel, Alembic, pytest

---

### Task 1: Add user_id to Brewing model and create migration

**Files:**
- Modify: `api/app/models/brewing.py`
- Modify: `api/app/models/user.py`
- Create: new Alembic migration via autogenerate

**Step 1: Update Brewing model**

Add `user_id` field and `user` relationship to `api/app/models/brewing.py`:

```python
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship

from app.models.base_model import BaseModel

if TYPE_CHECKING:
    from app.models.coffee import Coffee
    from app.models.rating import Rating
    from app.models.user import User


class Brewing(BaseModel, table=True):
    __tablename__ = "brewing"

    coffee_id: Optional[int] = Field(default=None, foreign_key="coffee.id")
    rating_id: Optional[int] = Field(default=None, foreign_key="rating.id")
    user_id: int = Field(foreign_key="user.id")
    method: str = Field()
    grams: int = Field()
    ml: int = Field()
    notes: Optional[str] = Field(default=None)
    latitude: Optional[float] = Field(default=None)
    longitude: Optional[float] = Field(default=None)
    location: Optional[str] = Field(default=None)

    coffee: Optional["Coffee"] = Relationship(back_populates="brewings")
    rating: Optional["Rating"] = Relationship()
    user: Optional["User"] = Relationship(back_populates="brewings")
```

**Step 2: Update User model**

Add `brewings` relationship to `api/app/models/user.py`:

```python
from typing import TYPE_CHECKING, List

from sqlmodel import Field, Relationship

from app.models.base_model import BaseModel

if TYPE_CHECKING:
    from app.models.brewing import Brewing


class User(BaseModel, table=True):
    __tablename__ = "user"

    email: str = Field(unique=True, index=True)
    hashed_password: str = Field()

    brewings: List["Brewing"] = Relationship(back_populates="user")
```

**Step 3: Generate and apply migration**

Run: `cd api && uv run alembic revision --autogenerate -m "add user_id to brewing"`
Run: `cd api && uv run alembic upgrade head`

**Step 4: Commit**

```bash
git add api/app/models/brewing.py api/app/models/user.py api/app/migrations/versions/
git commit -m "feat: add user_id foreign key to Brewing model"
```

---

### Task 2: Scope brewing routes by current user

**Files:**
- Modify: `api/app/routes/brewings.py`

**Step 1: Update create_brewing**

Add `user_id=current_user.id` to the Brewing constructor.

**Step 2: Update list_brewings**

Add `.where(Brewing.user_id == current_user.id)` to the select query.

**Step 3: Update get_brewing**

Replace `session.get(Brewing, brewing_id)` with a select query filtering by both `Brewing.id == brewing_id` and `Brewing.user_id == current_user.id`.

**Step 4: Update update_brewing**

Same scoped select as get_brewing.

**Step 5: Update delete_brewing**

Same scoped select as get_brewing.

**Step 6: Run existing tests**

Run: `cd api && uv run pytest tests/routes/test_brewings.py -v`
Expected: All 5 existing tests pass

**Step 7: Commit**

```bash
git add api/app/routes/brewings.py
git commit -m "feat: scope all brewing routes by authenticated user"
```

---

### Task 3: Add multi-user isolation tests

**Files:**
- Modify: `api/tests/conftest.py`
- Modify: `api/tests/routes/test_brewings.py`

**Step 1: Add second user fixture**

Add `auth_header_user_b` fixture to conftest.py (email: `userb@test.com`).

**Step 2: Add isolation tests**

Add 4 tests to test_brewings.py:
- `test_user_cannot_list_other_users_brewings`
- `test_user_cannot_get_other_users_brewing`
- `test_user_cannot_update_other_users_brewing`
- `test_user_cannot_delete_other_users_brewing`

Each creates brewings as user A, then attempts access as user B and expects 404 (or empty list for the list endpoint).

**Step 3: Run full test suite**

Run: `cd api && uv run pytest -v`
Expected: All tests pass

**Step 4: Commit**

```bash
git add api/tests/conftest.py api/tests/routes/test_brewings.py
git commit -m "test: add multi-user isolation tests for brewings"
```

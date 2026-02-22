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

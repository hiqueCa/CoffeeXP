from sqlalchemy import MetaData, Column, Integer, String, DateTime, Table
from datetime import datetime, timezone
from sqlalchemy.orm import registry
from sqlalchemy.dialects.postgresql import JSONB
from app.models import *

metadata = MetaData()
mapper_registry = registry()


def common_columns():
    return [
        Column("id", Integer, primary_key=True),
        Column("created_at", DateTime, default=lambda: datetime.now(timezone.utc)),
        Column(
            "updated_at",
            DateTime,
            default=lambda: datetime.now(timezone.utc),
            onupdate=lambda: datetime.now(timezone.utc),
        ),
    ]


user_table = Table(
    "user",
    metadata,
    *common_columns(),
    Column("email", String, nullable=False),
    Column("hashed_password", String, nullable=False),
)

brewing_table = Table(
    "brewing",
    metadata,
    *common_columns(),
    Column("user_id", Integer, nullable=False),
    Column("coffee", JSONB, nullable=False),
    Column("method", JSONB, nullable=False),
    Column("rating", Integer, nullable=False),
)

mapper_registry.map_imperatively(User, user_table)
mapper_registry.map_imperatively(Brewing, brewing_table)

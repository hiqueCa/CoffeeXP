from sqlalchemy import MetaData, Column, Integer, String, DateTime, Table, ForeignKey
from datetime import datetime, timezone
from sqlalchemy.orm import registry, relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.domain import *

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
    "users",
    metadata,
    *common_columns(),
    Column("email", String, nullable=False),
    Column("hashed_password", String, nullable=False),
)

brewing_table = Table(
    "brewings",
    metadata,
    *common_columns(),
    Column("user_id", Integer, ForeignKey("users.id"), nullable=False),
    Column("coffee", JSONB, nullable=False),
    Column("method", String, nullable=False),
    Column("grind_size", String, nullable=False),
    Column("water_volume", Integer, nullable=False),
    Column("coffee_amount", Integer, nullable=False),
    Column("rating", Integer, nullable=False),
)

mapper_registry.map_imperatively(User, user_table)
mapper_registry.map_imperatively(Brewing, brewing_table, properties={
    "user": relationship(User, lazy="joined"),
})

from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from app.config import settings

engine = create_engine(settings.database_url) if settings.database_url else None


def get_session():
    with Session(engine) as session:
        yield session

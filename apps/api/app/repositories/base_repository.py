from typing import Any, Generic, Type, TypeVar
from app.repositories.abstract_repository import AbstractRepository
from sqlalchemy.orm import Session

TEntity = TypeVar("TEntity")


class BaseRepository(AbstractRepository, Generic[TEntity]):
    def __init__(self, session: Session, entity: Type[TEntity]):
        self.session = session
        self.entity = entity

    def get(self, **conditions: Any) -> TEntity | None:
        return self.session.query(self.entity).filter_by(**conditions).first()

    def list(self, **conditions: Any) -> list[TEntity]:
        query = self.session.query(self.entity)

        if conditions:
            query = query.filter_by(**conditions)

        return query.all()

    def add(self, entity: TEntity) -> TEntity:
        self.session.add(entity)
        self.session.commit()
        self.session.refresh(entity)
        return entity

    def delete(self, entity_id: int) -> None:
        entity = self.get(entity_id)
        if entity:
            self.session.delete(entity)
            self.session.commit()

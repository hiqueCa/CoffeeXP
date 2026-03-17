from app.repositories.abstract_repository import AbstractRepository
from app.domain.user import User
from sqlalchemy.orm import Session


class UserRepository(AbstractRepository):
    def __init__(self, session: Session):
        self.session = session

    def get(self, entity_id: int) -> User | None:
        return self.session.query(User).filter_by(id=entity_id).first()

    def list(self) -> list[User]:
        return self.session.query(User).all()

    def add(self, entity: User) -> User:
        self.session.add(entity)
        self.session.commit()
        self.session.refresh(entity)
        return entity

    def delete(self, entity_id: int) -> None:
        entity = self.get(entity_id)
        if entity:
            self.session.delete(entity)
            self.session.commit()

from app.domain.brewing import Brewing
from sqlalchemy.orm import Session

from app.repositories.base_repository import BaseRepository


class BrewingRepository(BaseRepository[Brewing]):
    def __init__(self, session: Session):
        super().__init__(session, Brewing)

    def list_by_user(self, user_id: int) -> list[Brewing]:
        return self.session.query(self.entity).filter_by(user_id=user_id).all()

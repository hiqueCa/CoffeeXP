from app.domain.brewing import Brewing
from sqlalchemy.orm import Session

from app.repositories.base_repository import BaseRepository


class BrewingRepository(BaseRepository):
    def __init__(self, session: Session):
        super().__init__(session, Brewing)

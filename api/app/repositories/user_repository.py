from app.domain.user import User
from sqlalchemy.orm import Session

from app.repositories.base_repository import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self, session: Session):
        super().__init__(session, User)

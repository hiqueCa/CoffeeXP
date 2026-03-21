from app.domain.user import User
from sqlalchemy.orm import Session

from app.repositories.base_repository import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self, session: Session):
        super().__init__(session, User)

    def get_by_email(self, email: str) -> User | None:
        return self.session.query(User).filter_by(email=email).first()

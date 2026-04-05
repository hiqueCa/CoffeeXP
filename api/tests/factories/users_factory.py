from app.domain.user import User
from app.services.auth_service import AuthService
from sqlalchemy.orm import Session


class UsersFactory:
    @staticmethod
    def create(session: Session = None):
        user = User(
            email="test@test.com", hashed_password=AuthService.hash_password("test")
        )
        session.add(user)
        session.commit()
        session.refresh(user)

        return user

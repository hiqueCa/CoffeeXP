from datetime import datetime, timedelta, timezone
from fastapi.security import HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.domain.user import User
from app.config import settings
from app.repositories.user_repository import UserRepository
from app.services.base_service import BaseService

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()


class AuthService(BaseService):

    def __init__(self, repository: UserRepository):
        super().__init__(repository)

    def register_user(self, email: str, password: str):
        existing_user = self.repository.get_by_email(email)
        if existing_user:
            raise ValueError("Email already registered")

        user = User(email=email, hashed_password=self.hash_password(password))
        user = self.repository.add(user)

        return user

    def authenticate_user(self, email: str, password: str) -> str:
        user = self.repository.get_by_email(email)

        if not user or not self.verify_password(password, user.hashed_password):
            raise ValueError("Invalid credentials")

        bearer_token = self.create_access_token({"sub": user.email})
        return bearer_token

    def get_current_user(self, token: str) -> User:
        payload = self.decode_access_token(token)
        if payload is None:
            raise ValueError("Invalid or expired token")

        email = payload.get("sub")
        user = self.repository.get_by_email(email)
        if user is None:
            raise ValueError("User not found")

        return user

    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def create_access_token(data: dict) -> str:
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.access_token_expire_minutes
        )
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)

    @staticmethod
    def decode_access_token(token: str) -> dict | None:
        try:
            return jwt.decode(
                token, settings.secret_key, algorithms=[settings.algorithm]
            )
        except JWTError:
            return None

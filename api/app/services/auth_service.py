from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.domain.user import User
from app.config import settings
from app.repositories.user_repository import UserRepository

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:

    def __init__(self, session: Session, repository: UserRepository):
        self.session = session
        self.repository = repository

    def register_user(self, email: str, password: str):
        existing_user = self.repository.get_by_email(email)
        if existing_user:
            raise ValueError("Email already registered")

        user = User(email=email, hashed_password=self.hash_password(password))
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user

    def authenticate_user(self, email: str, password: str) -> str:
        user = self.repository.get_by_email(email)

        if not user or not self.verify_password(password, user.hashed_password):
            raise ValueError("Invalid credentials")

        bearer_token = self.create_access_token({"sub": user.email})
        return bearer_token

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

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.database import get_session
from app.domain.user import User
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService

security = HTTPBearer()


def get_current_user(
    token: str = None,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    repository: UserRepository = Depends(lambda: UserRepository(get_session())),
) -> User:
    token_str = token if token else credentials.credentials
    payload = AuthService.decode_access_token(token_str)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    email = payload.get("sub")
    user = repository.get_by_email(email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user

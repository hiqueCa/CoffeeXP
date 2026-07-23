from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.database import get_session
from app.domain.user import User
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService

security = HTTPBearer()


def get_current_user(
    token: str | None = None,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session),
) -> User:
    token_str = token if token else credentials.credentials
    auth_service = AuthService(UserRepository(session))

    try:
        return auth_service.get_current_user(token_str)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )

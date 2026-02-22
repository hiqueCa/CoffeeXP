import pytest
from fastapi import HTTPException

from app.dependencies import get_current_user
from app.models.user import User
from app.services.auth import AuthService


def test_get_current_user_returns_user(session):
    user = User(email="dep@example.com", hashed_password="hashed")
    session.add(user)
    session.commit()
    session.refresh(user)

    token = AuthService.create_access_token({"sub": user.email})
    result = get_current_user(token=token, session=session)
    assert result.email == "dep@example.com"


def test_get_current_user_raises_for_invalid_token(session):
    with pytest.raises(HTTPException) as exc_info:
        get_current_user(token="bad-token", session=session)
    assert exc_info.value.status_code == 401

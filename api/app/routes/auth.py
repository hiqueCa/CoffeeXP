from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_session
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    RegisterResponse,
    TokenResponse,
)
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED
)
def register(request: RegisterRequest, session: Session = Depends(get_session)):
    try:
        auth_service = AuthService(session)
        user = auth_service.register_user(request.email, request.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return RegisterResponse(id=user.id, email=user.email)


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, session: Session = Depends(get_session)):
    try:
        auth_service = AuthService(session)
        token = auth_service.authenticate_user(request.email, request.password)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))

    return TokenResponse(access_token=token)

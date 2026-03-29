from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_session
from app.dependencies import get_current_user
from app.domain.user import User
from app.repositories.brewing_repository import BrewingRepository
from app.schemas.brewing import (
    BrewingCreate,
    BrewingResponse,
)
from app.services.brewing_service import BrewingService

router = APIRouter(prefix="/brewings", tags=["brewings"])


@router.post("/", response_model=BrewingResponse, status_code=status.HTTP_201_CREATED)
def create_brewing(
    data: BrewingCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    brewing_service = BrewingService(BrewingRepository(session), current_user)
    brewing = brewing_service.create_brewing(data)
    return brewing


@router.get("/{brewing_id}", response_model=BrewingResponse)
def get_brewing(
    brewing_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    brewing_service = BrewingService(BrewingRepository(session), current_user)
    brewing = brewing_service.get_brewing_by_id(brewing_id)
    return brewing

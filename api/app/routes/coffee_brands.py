from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.database import get_session
from app.dependencies import get_current_user
from app.models.coffee_brand import CoffeeBrand
from app.models.user import User
from app.schemas.coffee_brand import (
    CoffeeBrandCreate,
    CoffeeBrandResponse,
    CoffeeBrandUpdate,
)

router = APIRouter(prefix="/coffee-brands", tags=["coffee-brands"])


@router.post(
    "/", response_model=CoffeeBrandResponse, status_code=status.HTTP_201_CREATED
)
def create_coffee_brand(
    data: CoffeeBrandCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    brand = CoffeeBrand(**data.model_dump())
    session.add(brand)
    session.commit()
    session.refresh(brand)
    return brand


@router.get("/", response_model=list[CoffeeBrandResponse])
def list_coffee_brands(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return session.exec(select(CoffeeBrand)).all()


@router.get("/{brand_id}", response_model=CoffeeBrandResponse)
def get_coffee_brand(
    brand_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    brand = session.get(CoffeeBrand, brand_id)
    if not brand:
        raise HTTPException(status_code=404, detail="Coffee brand not found")
    return brand


@router.put("/{brand_id}", response_model=CoffeeBrandResponse)
def update_coffee_brand(
    brand_id: int,
    data: CoffeeBrandUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    brand = session.get(CoffeeBrand, brand_id)
    if not brand:
        raise HTTPException(status_code=404, detail="Coffee brand not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(brand, key, value)
    session.add(brand)
    session.commit()
    session.refresh(brand)
    return brand


@router.delete("/{brand_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_coffee_brand(
    brand_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    brand = session.get(CoffeeBrand, brand_id)
    if not brand:
        raise HTTPException(status_code=404, detail="Coffee brand not found")
    session.delete(brand)
    session.commit()

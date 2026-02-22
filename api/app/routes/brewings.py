from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.database import get_session
from app.dependencies import get_current_user
from app.models.brewing import Brewing
from app.models.rating import Rating
from app.models.user import User
from app.schemas.brewing import (
    BrewingCreate,
    BrewingResponse,
    BrewingUpdate,
    CoffeeBrandNested,
    CoffeeNested,
    RatingResponse,
)

router = APIRouter(prefix="/brewings", tags=["brewings"])


def _build_response(brewing: Brewing) -> BrewingResponse:
    rating_resp = None
    if brewing.rating:
        rating_resp = RatingResponse(
            id=brewing.rating.id,
            flavor=brewing.rating.flavor,
            acidic=brewing.rating.acidic,
            aroma=brewing.rating.aroma,
            appearance=brewing.rating.appearance,
            bitter=brewing.rating.bitter,
            overall=brewing.rating.overall,
        )
    coffee_resp = None
    if brewing.coffee:
        brand_resp = None
        if brewing.coffee.coffee_brand:
            brand_resp = CoffeeBrandNested(
                id=brewing.coffee.coffee_brand.id,
                name=brewing.coffee.coffee_brand.name,
                country=brewing.coffee.coffee_brand.country,
            )
        coffee_resp = CoffeeNested(
            id=brewing.coffee.id,
            name=brewing.coffee.name,
            price=str(brewing.coffee.price),
            brand=brand_resp,
        )
    return BrewingResponse(
        id=brewing.id,
        method=brewing.method,
        grams=brewing.grams,
        ml=brewing.ml,
        notes=brewing.notes,
        latitude=brewing.latitude,
        longitude=brewing.longitude,
        location=brewing.location,
        created_at=brewing.created_at.isoformat(),
        rating=rating_resp,
        coffee=coffee_resp,
    )


@router.post("/", response_model=BrewingResponse, status_code=status.HTTP_201_CREATED)
def create_brewing(
    data: BrewingCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    rating = Rating(**data.rating.model_dump())
    session.add(rating)
    session.commit()
    session.refresh(rating)

    brewing = Brewing(
        coffee_id=data.coffee_id,
        rating_id=rating.id,
        method=data.method,
        grams=data.grams,
        ml=data.ml,
        notes=data.notes,
        latitude=data.latitude,
        longitude=data.longitude,
        location=data.location,
    )
    session.add(brewing)
    session.commit()
    session.refresh(brewing)
    return _build_response(brewing)


@router.get("/", response_model=list[BrewingResponse])
def list_brewings(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    brewings = session.exec(select(Brewing).order_by(Brewing.created_at.desc())).all()
    return [_build_response(b) for b in brewings]


@router.get("/{brewing_id}", response_model=BrewingResponse)
def get_brewing(
    brewing_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    brewing = session.get(Brewing, brewing_id)
    if not brewing:
        raise HTTPException(status_code=404, detail="Brewing not found")
    return _build_response(brewing)


@router.put("/{brewing_id}", response_model=BrewingResponse)
def update_brewing(
    brewing_id: int,
    data: BrewingUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    brewing = session.get(Brewing, brewing_id)
    if not brewing:
        raise HTTPException(status_code=404, detail="Brewing not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(brewing, key, value)
    session.add(brewing)
    session.commit()
    session.refresh(brewing)
    return _build_response(brewing)


@router.delete("/{brewing_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_brewing(
    brewing_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    brewing = session.get(Brewing, brewing_id)
    if not brewing:
        raise HTTPException(status_code=404, detail="Brewing not found")
    if brewing.rating:
        session.delete(brewing.rating)
    session.delete(brewing)
    session.commit()

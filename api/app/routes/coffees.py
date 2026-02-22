from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session, select

from app.database import get_session
from app.dependencies import get_current_user
from app.models.coffee import Coffee
from app.models.user import User
from app.schemas.coffee import CoffeeCreate, CoffeeResponse, CoffeeUpdate

router = APIRouter(prefix="/coffees", tags=["coffees"])


@router.post("/", response_model=CoffeeResponse, status_code=status.HTTP_201_CREATED)
def create_coffee(
    data: CoffeeCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    coffee = Coffee(
        name=data.name,
        price=Decimal(data.price),
        coffee_brand_id=data.coffee_brand_id,
    )
    session.add(coffee)
    session.commit()
    session.refresh(coffee)
    return CoffeeResponse(
        id=coffee.id, name=coffee.name, price=str(coffee.price), coffee_brand_id=coffee.coffee_brand_id
    )


@router.get("/", response_model=list[CoffeeResponse])
def list_coffees(
    brand_id: int | None = Query(default=None),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    statement = select(Coffee)
    if brand_id is not None:
        statement = statement.where(Coffee.coffee_brand_id == brand_id)
    coffees = session.exec(statement).all()
    return [
        CoffeeResponse(id=c.id, name=c.name, price=str(c.price), coffee_brand_id=c.coffee_brand_id)
        for c in coffees
    ]


@router.get("/{coffee_id}", response_model=CoffeeResponse)
def get_coffee(
    coffee_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    coffee = session.get(Coffee, coffee_id)
    if not coffee:
        raise HTTPException(status_code=404, detail="Coffee not found")
    return CoffeeResponse(
        id=coffee.id, name=coffee.name, price=str(coffee.price), coffee_brand_id=coffee.coffee_brand_id
    )


@router.put("/{coffee_id}", response_model=CoffeeResponse)
def update_coffee(
    coffee_id: int,
    data: CoffeeUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    coffee = session.get(Coffee, coffee_id)
    if not coffee:
        raise HTTPException(status_code=404, detail="Coffee not found")
    update_data = data.model_dump(exclude_unset=True)
    if "price" in update_data:
        update_data["price"] = Decimal(update_data["price"])
    for key, value in update_data.items():
        setattr(coffee, key, value)
    session.add(coffee)
    session.commit()
    session.refresh(coffee)
    return CoffeeResponse(
        id=coffee.id, name=coffee.name, price=str(coffee.price), coffee_brand_id=coffee.coffee_brand_id
    )


@router.delete("/{coffee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_coffee(
    coffee_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    coffee = session.get(Coffee, coffee_id)
    if not coffee:
        raise HTTPException(status_code=404, detail="Coffee not found")
    session.delete(coffee)
    session.commit()

from decimal import Decimal
from typing import TYPE_CHECKING, Optional, List

from sqlmodel import Field, Relationship

from app.models.base_model import BaseModel

if TYPE_CHECKING:
    from app.models.coffee_brand import CoffeeBrand
    from app.models.brewing import Brewing


class Coffee(BaseModel, table=True):
    __tablename__ = "coffee"

    name: str = Field()
    price: Decimal = Field(max_digits=10, decimal_places=2)
    coffee_brand_id: Optional[int] = Field(default=None, foreign_key="coffee_brand.id")

    coffee_brand: Optional["CoffeeBrand"] = Relationship(back_populates="coffees")
    # Relationship to Brewing will be added in Task 8 when Brewing model is created:
    # brewings: List["Brewing"] = Relationship(back_populates="coffee")

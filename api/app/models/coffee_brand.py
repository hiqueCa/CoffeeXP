from typing import TYPE_CHECKING, List

from sqlmodel import Field, Relationship

from app.models.base_model import BaseModel

if TYPE_CHECKING:
    from app.models.coffee import Coffee


class CoffeeBrand(BaseModel, table=True):
    __tablename__ = "coffee_brand"

    name: str = Field()
    country: str = Field()

    # Relationship to Coffee will be added in Task 6 when Coffee model is created:
    # coffees: List["Coffee"] = Relationship(back_populates="coffee_brand")

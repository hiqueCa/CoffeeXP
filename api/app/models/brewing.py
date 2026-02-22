from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship

from app.models.base_model import BaseModel

if TYPE_CHECKING:
    from app.models.coffee import Coffee
    from app.models.rating import Rating


class Brewing(BaseModel, table=True):
    __tablename__ = "brewing"

    coffee_id: Optional[int] = Field(default=None, foreign_key="coffee.id")
    rating_id: Optional[int] = Field(default=None, foreign_key="rating.id")
    method: str = Field()
    grams: int = Field()
    ml: int = Field()
    notes: Optional[str] = Field(default=None)
    latitude: Optional[float] = Field(default=None)
    longitude: Optional[float] = Field(default=None)
    location: Optional[str] = Field(default=None)

    coffee: Optional["Coffee"] = Relationship(back_populates="brewings")
    rating: Optional["Rating"] = Relationship()

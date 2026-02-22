from typing import List, TYPE_CHECKING
from sqlmodel import Field, Relationship

from app.models.base_model import BaseModel

if TYPE_CHECKING:
    from app.models.brewing import Brewing


class User(BaseModel, table=True):
    __tablename__ = "user"

    email: str = Field(unique=True, index=True)
    hashed_password: str = Field()

    brewings: List["Brewing"] = Relationship(back_populates="user")

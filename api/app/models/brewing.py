from typing import TYPE_CHECKING, Optional, Set

from sqlmodel import Field, Relationship

from app.models.base_model import BaseModel

if TYPE_CHECKING:
    from app.models.user import User


class Brewing:
    def __init__(
        self,
        user_id: int = None,
        method: Set[str] = None,
        coffee: Set[str] = None,
    ):
        self.user_id = user_id
        self.method = method
        self.coffee = coffee

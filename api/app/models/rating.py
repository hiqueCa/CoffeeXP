from typing import Optional

from sqlmodel import Field

from app.models.base_model import BaseModel
from app.services.overall_calculator import OverallCalculator

VALIDATABLE_FIELDS = ["flavor", "acidic", "aroma", "appearance", "bitter"]


class Rating(BaseModel, table=True):
    __tablename__ = "rating"

    flavor: int = Field()
    acidic: int = Field()
    aroma: int = Field()
    appearance: int = Field()
    bitter: int = Field()
    overall: Optional[int] = Field(default=None)

    def __init__(self, **data):
        super().__init__(**data)
        self._validate_ratings()
        self.overall = OverallCalculator.calculate(
            {field: getattr(self, field) for field in VALIDATABLE_FIELDS}
        )

    def _validate_ratings(self):
        for field in VALIDATABLE_FIELDS:
            value = getattr(self, field)
            if value < 1 or value > 5:
                raise ValueError(f"{field} must be between 1 and 5, got {value}")

from datetime import datetime
from enum import Enum

from pydantic import BaseModel


class GrindSize(str, Enum):
    coarse = "Coarse"
    medium = "Medium"
    fine = "Fine"


class RoastLevel(str, Enum):
    light = "Light"
    medium = "Medium"
    dark = "Dark"


class BrewingMethod(str, Enum):
    espresso = "Espresso"
    french_press = "French Press"
    aeropress = "Aeropress"
    cold_brew = "Cold Brew"
    moka_pot = "Moka Pot"
    v60 = "V60"
    chemex = "Chemex"


class BrewingNotes(str, Enum):
    chocolate = "Chocolate"
    citrus = "Citrus"
    floral = "Floral"
    fruity = "Fruity"


class CoffeeNested(BaseModel):
    name: str
    country: str
    price: float
    roast_level: RoastLevel


class BrewingCreate(BaseModel):
    coffee: CoffeeNested
    method: BrewingMethod
    water_volume: int
    coffee_amount: int
    grind_size: GrindSize
    rating: int
    notes: list[BrewingNotes]


class BrewingResponse(BaseModel):
    id: int
    method: BrewingMethod
    coffee: CoffeeNested
    water_volume: int
    coffee_amount: int
    grind_size: GrindSize
    created_at: datetime
    rating: int
    notes: list[BrewingNotes]

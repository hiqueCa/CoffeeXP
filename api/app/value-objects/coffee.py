from dataclasses import dataclass
from enum import Enum


class RoastLevel(str, Enum):
    LIGHT = "light"
    MEDIUM = "medium"
    DARK = "dark"


@dataclass(frozen=True)
class CoffeeBrand:
    name: str
    origin: str
    roast_level: RoastLevel

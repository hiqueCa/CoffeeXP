from dataclasses import dataclass
from enum import Enum


class BrewingType(str, Enum):
    POUR_OVER = "pour_over"
    ESPRESSO = "espresso"
    FRENCH_PRESS = "french_press"
    AEROPRESS = "aeropress"
    COLD_BREW = "cold_brew"


@dataclass(frozen=True)
class BrewingCharacteristics:
    type: BrewingType

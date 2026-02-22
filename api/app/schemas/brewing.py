from pydantic import BaseModel


class RatingCreate(BaseModel):
    flavor: int
    acidic: int
    aroma: int
    appearance: int
    bitter: int


class RatingResponse(BaseModel):
    id: int
    flavor: int
    acidic: int
    aroma: int
    appearance: int
    bitter: int
    overall: int


class CoffeeBrandNested(BaseModel):
    id: int
    name: str
    country: str


class CoffeeNested(BaseModel):
    id: int
    name: str
    price: str
    brand: CoffeeBrandNested | None = None


class BrewingCreate(BaseModel):
    coffee_id: int
    method: str
    grams: int
    ml: int
    notes: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    location: str | None = None
    rating: RatingCreate


class BrewingUpdate(BaseModel):
    method: str | None = None
    grams: int | None = None
    ml: int | None = None
    notes: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    location: str | None = None


class BrewingResponse(BaseModel):
    id: int
    method: str
    grams: int
    ml: int
    notes: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    location: str | None = None
    created_at: str
    rating: RatingResponse | None = None
    coffee: CoffeeNested | None = None

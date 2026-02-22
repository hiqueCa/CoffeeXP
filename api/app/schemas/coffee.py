from pydantic import BaseModel


class CoffeeCreate(BaseModel):
    name: str
    price: str
    coffee_brand_id: int | None = None


class CoffeeUpdate(BaseModel):
    name: str | None = None
    price: str | None = None
    coffee_brand_id: int | None = None


class CoffeeResponse(BaseModel):
    id: int
    name: str
    price: str
    coffee_brand_id: int | None = None

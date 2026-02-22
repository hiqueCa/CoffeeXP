from pydantic import BaseModel


class CoffeeBrandCreate(BaseModel):
    name: str
    country: str


class CoffeeBrandUpdate(BaseModel):
    name: str | None = None
    country: str | None = None


class CoffeeBrandResponse(BaseModel):
    id: int
    name: str
    country: str

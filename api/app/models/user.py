from sqlmodel import Field

from app.models.base_model import BaseModel


class User(BaseModel, table=True):
    __tablename__ = "user"

    email: str = Field(unique=True, index=True)
    hashed_password: str = Field()

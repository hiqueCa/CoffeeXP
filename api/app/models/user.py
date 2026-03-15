from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.brewing import Brewing


class User:
    def __init__(self, id: int, email: str, hashed_password: str):
        self.id = id
        self.email = email
        self.hashed_password = hashed_password

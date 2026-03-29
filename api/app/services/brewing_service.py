from sqlalchemy.orm import Session
from app.domain.user import User
from app.repositories.brewing_repository import BrewingRepository
from app.domain.brewing import Brewing
from app.schemas.brewing import BrewingCreate


class BrewingService:

    def __init__(
        self, session: Session, repository: BrewingRepository, user: User | None = None
    ):
        self.session = session
        self.repository = repository
        self.user = user

    def create_brewing(self, brewing_data: BrewingCreate) -> Brewing:
        brewing_dict = brewing_data.model_dump()
        if self.user:
            brewing_dict["user_id"] = self.user.id
        brewing = self.repository.add(Brewing(**brewing_dict))

        return brewing

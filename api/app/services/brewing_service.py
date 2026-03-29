from sqlalchemy.orm import Session
from app.repositories.brewing_repository import BrewingRepository
from app.domain.brewing import Brewing
from app.schemas.brewing import BrewingCreate


class BrewingService:
    def __init__(self, session: Session, repository: BrewingRepository):
        self.session = session
        self.repository = repository

    def create_brewing(self, brewing_data: BrewingCreate) -> Brewing:
        brewing = self.repository.add(Brewing(**brewing_data.model_dump()))

        return brewing

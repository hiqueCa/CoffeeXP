from app.repositories.brewing_repository import BrewingRepository
from app.domain.brewing import Brewing
from app.schemas.brewing import BrewingCreate
from app.services.base_service import BaseService


class BrewingService(BaseService[BrewingRepository]):

    def __init__(self, repository, user):
        super().__init__(repository, user)

    def create_brewing(self, brewing_data: BrewingCreate) -> Brewing:
        brewing_dict = brewing_data.model_dump()
        if self.user:
            brewing_dict["user_id"] = self.user.id

        brewing = self.repository.add(Brewing(**brewing_dict))

        return brewing

    def get_brewing_by_id(self, brewing_id: int) -> Brewing:
        brewing = self.repository.get(brewing_id)
        if not brewing:
            raise ValueError("Brewing not found")

        return brewing

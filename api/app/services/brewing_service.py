from app.repositories.brewing_repository import BrewingRepository
from app.domain.brewing import Brewing
from app.schemas.brewing import BrewingCreate
from app.services.base_service import BaseService


class BrewingService(BaseService[BrewingRepository]):

    def __init__(self, repository, user):
        super().__init__(repository, user)

    def create_brewing(self, brewing_data: BrewingCreate) -> Brewing:
        brewing_dict = brewing_data.model_dump()

        brewing = Brewing(**brewing_dict)
        if self.user.id is None:
            raise ValueError("User id is required")

        brewing.user_id = self.user.id

        brewing = self.repository.add(brewing)

        return brewing

    def get_brewing_by_id(self, id: int) -> Brewing:
        brewing = self.repository.get(id=id, user_id=self.user.id)
        if not brewing:
            raise ValueError("Brewing not found")

        return brewing

    def list_brewings(self) -> list[Brewing]:
        brewings = self.repository.list(user_id=self.user.id)
        return brewings

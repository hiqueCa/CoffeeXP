import factory
from app.domain import Brewing
from app.repositories.base_repository import BaseRepository
from app.schemas.brewing import BrewingMethod, CoffeeNested, GrindSize, RoastLevel


class BrewingFactory(factory.base.Factory):
    class Meta:
        model = Brewing

    _repository: BaseRepository = None

    coffee = CoffeeNested(
        name="Test Coffee",
        country="Brazil",
        price=29.90,
        roast_level=RoastLevel.medium,
    ).model_dump()

    method = BrewingMethod.v60
    grind_size = GrindSize.medium
    water_volume = 250
    coffee_amount = 15
    rating = 4
    user_id = 1

    @classmethod
    def _create(cls, model_class, *args, **kwargs) -> Brewing:
        instance = model_class(*args, **kwargs)
        return cls._repository.add(instance)

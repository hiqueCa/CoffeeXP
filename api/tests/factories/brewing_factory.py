import factory
from app.domain import Brewing
from app.schemas.brewing import BrewingMethod, CoffeeNested, GrindSize, RoastLevel
from tests.factories.user_factory import UserFactory

class BrewingFactory(factory.base.Factory):
    class Meta:
        model = Brewing

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
    user = factory.SubFactory(UserFactory)
    user_id = factory.LazyAttribute(lambda obj: obj.user.id)

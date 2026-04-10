from app.schemas.brewing import BrewingMethod, CoffeeNested, GrindSize

class Brewing:

    def __init__(
        self,
        coffee: CoffeeNested,
        method: BrewingMethod,
        grind_size: GrindSize,
        water_volume: int,
        coffee_amount: int,
        rating: int,
        user_id: int | None = None,
        id: int | None = None,
    ):
        self.id = id

        self.user_id = user_id
        self.method = method
        self.coffee = coffee
        self.rating = rating
        self.grind_size = grind_size
        self.water_volume = water_volume
        self.coffee_amount = coffee_amount

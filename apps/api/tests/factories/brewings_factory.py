from sqlalchemy.orm import Session

from app.domain.brewing import Brewing
from app.domain.user import User
from app.schemas.brewing import BrewingMethod, BrewingNotes, CoffeeNested, GrindSize
from tests.factories.users_factory import UsersFactory


class BrewingsFactory:
    @staticmethod
    def create(amount: int, session: Session, user: User = None) -> list[Brewing]:
        brewings = []
        if user is None:
            user = UsersFactory.create(session=session)

        for i in range(amount):
            brewing = Brewing(
                coffee=CoffeeNested(
                    name=f"Test Coffee {i}",
                    country="Test Country",
                    price=10.0 + i,
                    roast_level="Medium",
                ).model_dump(),
                method=BrewingMethod.aeropress,
                grind_size=GrindSize.medium,
                water_volume=150 + i * 10,
                coffee_amount=15 + i,
                rating=4,
                user_id=user.id,
                notes=[
                    BrewingNotes.chocolate,
                    BrewingNotes.citrus,
                    BrewingNotes.floral,
                ],
            )
            session.add(brewing)
            brewings.append(brewing)
        session.commit()

        return brewings

from decimal import Decimal

from app.models.brewing import Brewing
from app.models.coffee import Coffee
from app.models.coffee_brand import CoffeeBrand
from app.models.rating import Rating
from app.models.user import User


def test_brewing_creation():
    brewing = Brewing(method="V60", grams=15, ml=250, notes="Fruity and bright")
    assert brewing.method == "V60"
    assert brewing.grams == 15
    assert brewing.ml == 250
    assert brewing.notes == "Fruity and bright"


def test_brewing_with_location():
    brewing = Brewing(
        method="French Press",
        grams=20,
        ml=300,
        latitude=52.3676,
        longitude=4.9041,
        location="Amsterdam, NL",
    )
    assert brewing.latitude == 52.3676
    assert brewing.longitude == 4.9041
    assert brewing.location == "Amsterdam, NL"


def test_brewing_persists_with_relationships(session):
    user = User(email="test-user@test.com", hashed_password="test-hashed-password")
    session.add(user)
    session.commit()
    session.refresh(user)

    brand = CoffeeBrand(name="Illy", country="Italy")
    session.add(brand)
    session.commit()
    session.refresh(brand)

    coffee = Coffee(name="Classico", price=Decimal("14.50"), coffee_brand_id=brand.id)
    session.add(coffee)
    session.commit()
    session.refresh(coffee)

    rating = Rating(flavor=4, acidic=3, aroma=5, appearance=4, bitter=2)
    session.add(rating)
    session.commit()
    session.refresh(rating)

    brewing = Brewing(
        coffee_id=coffee.id,
        rating_id=rating.id,
        user_id=user.id,
        method="V60",
        grams=15,
        ml=250,
        notes="Excellent cup",
        latitude=52.3676,
        longitude=4.9041,
        location="Amsterdam, NL",
    )
    session.add(brewing)
    session.commit()
    session.refresh(brewing)

    assert brewing.id is not None
    assert brewing.coffee.name == "Classico"
    assert brewing.rating.overall == 4
    assert brewing.user.email == user.email

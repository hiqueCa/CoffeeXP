from decimal import Decimal

from app.models.coffee import Coffee
from app.models.coffee_brand import CoffeeBrand


def test_coffee_creation():
    coffee = Coffee(name="Classic Roast", price=Decimal("12.99"))
    assert coffee.name == "Classic Roast"
    assert coffee.price == Decimal("12.99")


def test_coffee_persists_with_brand(session):
    brand = CoffeeBrand(name="Illy", country="Italy")
    session.add(brand)
    session.commit()
    session.refresh(brand)

    coffee = Coffee(name="Classico", price=Decimal("14.50"), coffee_brand_id=brand.id)
    session.add(coffee)
    session.commit()
    session.refresh(coffee)

    assert coffee.id is not None
    assert coffee.coffee_brand_id == brand.id
    assert coffee.coffee_brand.name == "Illy"

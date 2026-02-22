from app.models.coffee_brand import CoffeeBrand


def test_coffee_brand_creation():
    brand = CoffeeBrand(name="Illy", country="Italy")
    assert brand.name == "Illy"
    assert brand.country == "Italy"
    assert brand.id is None


def test_coffee_brand_persists_to_database(session):
    brand = CoffeeBrand(name="Lavazza", country="Italy")
    session.add(brand)
    session.commit()
    session.refresh(brand)
    assert brand.id is not None
    assert brand.name == "Lavazza"

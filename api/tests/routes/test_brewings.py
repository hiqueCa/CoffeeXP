from app.domain.user import User
from app.schemas.brewing import BrewingMethod, GrindSize, RoastLevel
from tests.factories.brewings_factory import BrewingsFactory

def test_create_brewing(client, auth_header):
    response = client.post(
        "/brewings/",
        json={
            "coffee": {
                "name": "Morning Brew",
                "country": "Brazil",
                "price": 15.00,
                "roast_level": RoastLevel.medium.value,
            },
            "method": BrewingMethod.aeropress.value,
            "grind_size": GrindSize.medium.value,
            "water_volume": 150,
            "coffee_amount": 15,
            "rating": 4,
        },
        headers=auth_header,
    )

    assert response.status_code == 201
    data = response.json()
    assert data["coffee"]["name"] == "Morning Brew"
    assert data["coffee"]["country"] == "Brazil"
    assert data["coffee"]["price"] >= 15.00
    assert data["coffee"]["roast_level"] == RoastLevel.medium.value
    assert data["method"] == BrewingMethod.aeropress.value
    assert data["grind_size"] == GrindSize.medium.value
    assert data["water_volume"] == 150
    assert data["coffee_amount"] == 15
    assert data["rating"] == 4


def test_get_brewing_returns_current_user_brewing_only(client, auth_header, session):
    current_user = session.query(User).first()
    brewing = BrewingsFactory.create(1, session=session, user=current_user)[0]
    response = client.get(f"/brewings/{brewing.id}", headers=auth_header)

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == brewing.id


def test_get_brewing_returns_404_for_other_user_brewing(client, auth_header, session):
    other_user_brewing = BrewingsFactory.create(1, session=session)[0]
    response = client.get(f"/brewings/{other_user_brewing.id}", headers=auth_header)

    assert response.status_code == 404
    assert response.json()["detail"] == "Brewing not found"


def test_list_brewings_returns_current_user_brewings_only(client, auth_header, session):
    current_user = session.query(User).first()
    current_user_brewings = BrewingsFactory.create(
        3, session=session, user=current_user
    )
    other_user_brewings = BrewingsFactory.create(2, session=session)

    response = client.get("/brewings", headers=auth_header)
    assert response.status_code == 200

    data = response.json()
    assert len(data) >= 3
    assert all(
        brewing["id"] in [b.id for b in current_user_brewings] for brewing in data
    )
    assert all(
        brewing["id"] not in [b.id for b in other_user_brewings] for brewing in data
    )

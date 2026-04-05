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


def test_get_brewing(client, auth_header, session):
    brewing = BrewingsFactory.create(1, session=session)[0]
    response = client.get(f"/brewings/{brewing.id}", headers=auth_header)

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == brewing.id


def test_list_brewings(client, auth_header):
    for i in range(3):
        client.post(
            "/brewings/",
            json={
                "coffee": {
                    "name": f"Morning Brew {i}",
                    "country": "Brazil",
                    "price": 15.00 + i,
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

    response = client.get("/brewings/", headers=auth_header)
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 3
    for i in range(3):
        assert any(brewing["coffee"]["name"] == f"Morning Brew {i}" for brewing in data)

from app.schemas.brewing import BrewingMethod, GrindSize, RoastLevel


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

    print(response.json())
    assert response.status_code == 201
    data = response.json()
    assert data["coffee"]["name"] == "Morning Brew"
    assert data["coffee"]["country"] == "Brazil"
    assert data["coffee"]["price"] == 15.00
    assert data["coffee"]["roast_level"] == RoastLevel.medium.value
    assert data["method"] == BrewingMethod.aeropress.value
    assert data["grind_size"] == GrindSize.medium.value
    assert data["water_volume"] == 150
    assert data["coffee_amount"] == 15
    assert data["rating"] == 4

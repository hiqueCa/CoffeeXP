def _setup_coffee(client, auth_header):
    brand = client.post(
        "/coffee-brands", json={"name": "Illy", "country": "Italy"}, headers=auth_header
    ).json()
    coffee = client.post(
        "/coffees",
        json={"name": "Classico", "price": "14.50", "coffee_brand_id": brand["id"]},
        headers=auth_header,
    ).json()
    return coffee["id"]


def test_create_brewing_with_rating(client, auth_header):
    coffee_id = _setup_coffee(client, auth_header)
    response = client.post(
        "/brewings",
        json={
            "coffee_id": coffee_id,
            "method": "V60",
            "grams": 15,
            "ml": 250,
            "notes": "Fruity and bright",
            "latitude": 52.3676,
            "longitude": 4.9041,
            "location": "Amsterdam, NL",
            "rating": {
                "flavor": 4,
                "acidic": 3,
                "aroma": 5,
                "appearance": 4,
                "bitter": 2,
            },
        },
        headers=auth_header,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["method"] == "V60"
    assert data["notes"] == "Fruity and bright"
    assert data["latitude"] == 52.3676
    assert data["location"] == "Amsterdam, NL"
    assert data["rating"]["overall"] == 4


def test_list_brewings(client, auth_header):
    coffee_id = _setup_coffee(client, auth_header)
    for i in range(3):
        client.post(
            "/brewings",
            json={
                "coffee_id": coffee_id,
                "method": "V60",
                "grams": 15,
                "ml": 250,
                "rating": {
                    "flavor": 3,
                    "acidic": 3,
                    "aroma": 3,
                    "appearance": 3,
                    "bitter": 3,
                },
            },
            headers=auth_header,
        )

    response = client.get("/brewings", headers=auth_header)
    assert response.status_code == 200
    assert len(response.json()) == 3


def test_get_brewing_includes_relations(client, auth_header):
    coffee_id = _setup_coffee(client, auth_header)
    create_response = client.post(
        "/brewings",
        json={
            "coffee_id": coffee_id,
            "method": "V60",
            "grams": 15,
            "ml": 250,
            "rating": {
                "flavor": 4,
                "acidic": 3,
                "aroma": 5,
                "appearance": 4,
                "bitter": 2,
            },
        },
        headers=auth_header,
    )
    brewing_id = create_response.json()["id"]

    response = client.get(f"/brewings/{brewing_id}", headers=auth_header)
    assert response.status_code == 200
    data = response.json()
    assert data["coffee"]["name"] == "Classico"
    assert data["coffee"]["brand"]["name"] == "Illy"
    assert data["rating"]["flavor"] == 4


def test_update_brewing(client, auth_header):
    coffee_id = _setup_coffee(client, auth_header)
    create_response = client.post(
        "/brewings",
        json={
            "coffee_id": coffee_id,
            "method": "V60",
            "grams": 15,
            "ml": 250,
            "rating": {
                "flavor": 3,
                "acidic": 3,
                "aroma": 3,
                "appearance": 3,
                "bitter": 3,
            },
        },
        headers=auth_header,
    )
    brewing_id = create_response.json()["id"]

    response = client.put(
        f"/brewings/{brewing_id}",
        json={"notes": "Actually quite good"},
        headers=auth_header,
    )
    assert response.status_code == 200
    assert response.json()["notes"] == "Actually quite good"


def test_delete_brewing(client, auth_header):
    coffee_id = _setup_coffee(client, auth_header)
    create_response = client.post(
        "/brewings",
        json={
            "coffee_id": coffee_id,
            "method": "V60",
            "grams": 15,
            "ml": 250,
            "rating": {
                "flavor": 3,
                "acidic": 3,
                "aroma": 3,
                "appearance": 3,
                "bitter": 3,
            },
        },
        headers=auth_header,
    )
    brewing_id = create_response.json()["id"]

    response = client.delete(f"/brewings/{brewing_id}", headers=auth_header)
    assert response.status_code == 204


def _create_brewing(client, auth_header, coffee_id):
    return client.post(
        "/brewings",
        json={
            "coffee_id": coffee_id,
            "method": "V60",
            "grams": 15,
            "ml": 250,
            "rating": {
                "flavor": 3,
                "acidic": 3,
                "aroma": 3,
                "appearance": 3,
                "bitter": 3,
            },
        },
        headers=auth_header,
    )


def test_user_cannot_list_other_users_brewings(client, auth_header, auth_header_user_b):
    coffee_id = _setup_coffee(client, auth_header)
    _create_brewing(client, auth_header, coffee_id)
    _create_brewing(client, auth_header, coffee_id)

    response = client.get("/brewings", headers=auth_header_user_b)
    assert response.status_code == 200
    assert len(response.json()) == 0


def test_user_cannot_get_other_users_brewing(client, auth_header, auth_header_user_b):
    coffee_id = _setup_coffee(client, auth_header)
    brewing_id = _create_brewing(client, auth_header, coffee_id).json()["id"]

    response = client.get(f"/brewings/{brewing_id}", headers=auth_header_user_b)
    assert response.status_code == 404


def test_user_cannot_update_other_users_brewing(client, auth_header, auth_header_user_b):
    coffee_id = _setup_coffee(client, auth_header)
    brewing_id = _create_brewing(client, auth_header, coffee_id).json()["id"]

    response = client.put(
        f"/brewings/{brewing_id}",
        json={"notes": "Hacked"},
        headers=auth_header_user_b,
    )
    assert response.status_code == 404


def test_user_cannot_delete_other_users_brewing(client, auth_header, auth_header_user_b):
    coffee_id = _setup_coffee(client, auth_header)
    brewing_id = _create_brewing(client, auth_header, coffee_id).json()["id"]

    response = client.delete(f"/brewings/{brewing_id}", headers=auth_header_user_b)
    assert response.status_code == 404

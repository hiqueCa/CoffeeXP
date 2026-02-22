def _create_brand(client, auth_header):
    response = client.post(
        "/coffee-brands", json={"name": "Illy", "country": "Italy"}, headers=auth_header
    )
    return response.json()["id"]


def test_create_coffee(client, auth_header):
    brand_id = _create_brand(client, auth_header)
    response = client.post(
        "/coffees",
        json={"name": "Classico", "price": "14.50", "coffee_brand_id": brand_id},
        headers=auth_header,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Classico"
    assert data["price"] == "14.50"


def test_list_coffees(client, auth_header):
    brand_id = _create_brand(client, auth_header)
    client.post(
        "/coffees",
        json={"name": "A", "price": "10.00", "coffee_brand_id": brand_id},
        headers=auth_header,
    )
    client.post(
        "/coffees",
        json={"name": "B", "price": "12.00", "coffee_brand_id": brand_id},
        headers=auth_header,
    )

    response = client.get("/coffees", headers=auth_header)
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_list_coffees_filter_by_brand(client, auth_header):
    brand1 = client.post(
        "/coffee-brands", json={"name": "Illy", "country": "Italy"}, headers=auth_header
    ).json()["id"]
    brand2 = client.post(
        "/coffee-brands",
        json={"name": "Lavazza", "country": "Italy"},
        headers=auth_header,
    ).json()["id"]
    client.post(
        "/coffees",
        json={"name": "A", "price": "10.00", "coffee_brand_id": brand1},
        headers=auth_header,
    )
    client.post(
        "/coffees",
        json={"name": "B", "price": "12.00", "coffee_brand_id": brand2},
        headers=auth_header,
    )

    response = client.get(f"/coffees?brand_id={brand1}", headers=auth_header)
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["name"] == "A"


def test_get_coffee(client, auth_header):
    brand_id = _create_brand(client, auth_header)
    create_response = client.post(
        "/coffees",
        json={"name": "Classico", "price": "14.50", "coffee_brand_id": brand_id},
        headers=auth_header,
    )
    coffee_id = create_response.json()["id"]

    response = client.get(f"/coffees/{coffee_id}", headers=auth_header)
    assert response.status_code == 200
    assert response.json()["name"] == "Classico"


def test_update_coffee(client, auth_header):
    brand_id = _create_brand(client, auth_header)
    create_response = client.post(
        "/coffees",
        json={"name": "Clasico", "price": "14.50", "coffee_brand_id": brand_id},
        headers=auth_header,
    )
    coffee_id = create_response.json()["id"]

    response = client.put(
        f"/coffees/{coffee_id}",
        json={"name": "Classico"},
        headers=auth_header,
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Classico"


def test_delete_coffee(client, auth_header):
    brand_id = _create_brand(client, auth_header)
    create_response = client.post(
        "/coffees",
        json={"name": "Classico", "price": "14.50", "coffee_brand_id": brand_id},
        headers=auth_header,
    )
    coffee_id = create_response.json()["id"]

    response = client.delete(f"/coffees/{coffee_id}", headers=auth_header)
    assert response.status_code == 204

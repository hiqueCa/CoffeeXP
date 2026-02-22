def test_create_coffee_brand(client, auth_header):
    response = client.post(
        "/coffee-brands",
        json={"name": "Illy", "country": "Italy"},
        headers=auth_header,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Illy"
    assert data["country"] == "Italy"
    assert "id" in data


def test_create_coffee_brand_requires_auth(client):
    response = client.post(
        "/coffee-brands",
        json={"name": "Illy", "country": "Italy"},
    )
    assert response.status_code in (401, 403)


def test_list_coffee_brands(client, auth_header):
    client.post(
        "/coffee-brands", json={"name": "Illy", "country": "Italy"}, headers=auth_header
    )
    client.post(
        "/coffee-brands",
        json={"name": "Lavazza", "country": "Italy"},
        headers=auth_header,
    )

    response = client.get("/coffee-brands", headers=auth_header)
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_get_coffee_brand(client, auth_header):
    create_response = client.post(
        "/coffee-brands", json={"name": "Illy", "country": "Italy"}, headers=auth_header
    )
    brand_id = create_response.json()["id"]

    response = client.get(f"/coffee-brands/{brand_id}", headers=auth_header)
    assert response.status_code == 200
    assert response.json()["name"] == "Illy"


def test_get_coffee_brand_not_found(client, auth_header):
    response = client.get("/coffee-brands/999", headers=auth_header)
    assert response.status_code == 404


def test_update_coffee_brand(client, auth_header):
    create_response = client.post(
        "/coffee-brands", json={"name": "Ily", "country": "Italy"}, headers=auth_header
    )
    brand_id = create_response.json()["id"]

    response = client.put(
        f"/coffee-brands/{brand_id}",
        json={"name": "Illy", "country": "Italy"},
        headers=auth_header,
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Illy"


def test_delete_coffee_brand(client, auth_header):
    create_response = client.post(
        "/coffee-brands", json={"name": "Illy", "country": "Italy"}, headers=auth_header
    )
    brand_id = create_response.json()["id"]

    response = client.delete(f"/coffee-brands/{brand_id}", headers=auth_header)
    assert response.status_code == 204

    response = client.get(f"/coffee-brands/{brand_id}", headers=auth_header)
    assert response.status_code == 404


from app.repositories.user_repository import UserRepository
from app.domain.user import User


def test_repository_connection(session):
    entry_entity = User(email="test@test.com", hashed_password="hashed_password")

    repo = UserRepository(session)
    repo.add(entry_entity)

    fetched_item = repo.get(1)
    assert fetched_item == entry_entity

    all_items = repo.list()
    assert all_items == [
        entry_entity,
    ]

    repo.delete(1)
    all_items_after_delete = repo.list()
    assert all_items_after_delete == []

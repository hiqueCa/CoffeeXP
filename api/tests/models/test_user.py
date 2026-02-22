from app.models.user import User


def test_user_creation():
    user = User(email="test@example.com", hashed_password="hashed123")
    assert user.email == "test@example.com"
    assert user.hashed_password == "hashed123"


def test_user_persists_to_database(session):
    user = User(email="test@example.com", hashed_password="hashed123")
    session.add(user)
    session.commit()
    session.refresh(user)
    assert user.id is not None

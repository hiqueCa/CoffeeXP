import pytest
from fastapi.testclient import TestClient
from app.database.schemas import metadata
from app.domain.brewing import Brewing

from app.config import settings
from app.main import app
from app.database import get_session
from sqlalchemy import create_engine
from sqlalchemy.orm import Session


from app.domain.user import User
from app.schemas.brewing import BrewingMethod, CoffeeNested, GrindSize, RoastLevel
from app.services.auth_service import AuthService

test_engine = create_engine(
    settings.test_database_url or "sqlite://",
    connect_args={"check_same_thread": False} if not settings.test_database_url else {},
)


@pytest.fixture(name="create_test_brewings")
def test_brewings_fixture(session: Session):
    for i in range(5):
        brewing = Brewing(
            coffee=CoffeeNested(
                name=f"Test Coffee {i}",
                country="Test Country",
                price=10.0 + i,
                roast_level=RoastLevel.medium,
            ),
            method=BrewingMethod.aeropress,
            grind_size=GrindSize.medium,
            water_volume=150 + i * 10,
            coffee_amount=15 + i,
            rating=4,
        )
        session.add(brewing)

    session.commit()


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    metadata.create_all(test_engine)
    yield
    metadata.drop_all(test_engine)


@pytest.fixture(name="session")
def session_fixture():
    connection = test_engine.connect()
    transaction = connection.begin()
    session = Session(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


@pytest.fixture(name="auth_header")
def auth_header_fixture(session: Session):
    user = User(
        email="test@test.com", hashed_password=AuthService.hash_password("test")
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    token = AuthService.create_access_token({"sub": user.email})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(name="auth_header_user_b")
def auth_header_user_b_fixture(session: Session):
    user = User(
        email="userb@test.com", hashed_password=AuthService.hash_password("test")
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    token = AuthService.create_access_token({"sub": user.email})
    return {"Authorization": f"Bearer {token}"}

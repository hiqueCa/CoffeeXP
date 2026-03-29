import factory
from app.domain import User


class UserFactory(factory.base.Factory):
    class Meta:
        model = User

    email = factory.Sequence(lambda n: f"user{n}@test.com")
    hashed_password = "hashed_password"

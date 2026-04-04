from typing import Generic, Type, TypeVar

from app.domain.user import User

TRepository = TypeVar("TRepository")


class BaseService(Generic[TRepository]):

    def __init__(self, repository: Type[TRepository], user: User = None):
        self.repository = repository
        self.user = user

from typing import Generic, TypeVar

from app.domain.user import User

TRepository = TypeVar("TRepository")


class BaseService(Generic[TRepository]):

    def __init__(self, repository: TRepository, user: User | None = None):
        self.repository = repository
        self.user = user

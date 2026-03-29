from app.domain.user import User


class BaseService:
    def __init__(self, repository, user: User | None = None):
        self.repository = repository
        self.user = user

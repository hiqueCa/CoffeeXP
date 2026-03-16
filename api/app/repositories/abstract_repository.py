from abc import ABC, abstractmethod


class AbstractRepository(ABC):
    @abstractmethod
    def add(self, entity):
        raise NotImplementedError

    @abstractmethod
    def get(self, entity_id):
        raise NotImplementedError

    @abstractmethod
    def list(self):
        raise NotImplementedError

    @abstractmethod
    def delete(self, entity_id):
        raise NotImplementedError

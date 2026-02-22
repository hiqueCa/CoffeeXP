from datetime import datetime, timezone

from app.models.base_model import BaseModel
from sqlmodel import Field


class FakeModel(BaseModel, table=True):
    __tablename__ = "fake_model"
    name: str = Field()


def test_base_model_has_id():
    model = FakeModel(name="test")
    assert model.id is None


def test_base_model_has_timestamps():
    model = FakeModel(name="test")
    assert isinstance(model.created_at, datetime)
    assert isinstance(model.updated_at, datetime)


def test_base_model_timestamps_are_utc():
    model = FakeModel(name="test")
    assert model.created_at.tzinfo == timezone.utc
    assert model.updated_at.tzinfo == timezone.utc

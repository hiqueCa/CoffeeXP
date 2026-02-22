import pytest

from app.models.rating import Rating


def test_rating_creation_with_valid_values():
    rating = Rating(flavor=4, acidic=3, aroma=5, appearance=4, bitter=2)
    assert rating.flavor == 4
    assert rating.overall == 4  # round((4+3+5+4+2)/5) = round(3.6) = 4


def test_rating_accepts_boundary_values():
    rating = Rating(flavor=1, acidic=1, aroma=1, appearance=1, bitter=1)
    assert rating.overall == 1
    rating = Rating(flavor=5, acidic=5, aroma=5, appearance=5, bitter=5)
    assert rating.overall == 5


def test_rating_rejects_value_below_minimum():
    with pytest.raises(ValueError):
        Rating(flavor=0, acidic=3, aroma=3, appearance=3, bitter=3)


def test_rating_rejects_value_above_maximum():
    with pytest.raises(ValueError):
        Rating(flavor=6, acidic=3, aroma=3, appearance=3, bitter=3)


def test_rating_persists_to_database(session):
    rating = Rating(flavor=4, acidic=3, aroma=5, appearance=4, bitter=2)
    session.add(rating)
    session.commit()
    session.refresh(rating)
    assert rating.id is not None
    assert rating.overall == 4

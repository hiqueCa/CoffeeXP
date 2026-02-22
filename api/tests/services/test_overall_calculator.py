from app.services.overall_calculator import OverallCalculator


def test_calculates_average():
    scores = {"flavor": 5, "acidic": 4, "aroma": 3, "appearance": 2, "bitter": 1}
    assert OverallCalculator.calculate(scores) == 3


def test_rounds_average():
    scores = {"flavor": 5, "acidic": 5, "aroma": 5, "appearance": 5, "bitter": 4}
    assert OverallCalculator.calculate(scores) == 5


def test_all_ones():
    scores = {"flavor": 1, "acidic": 1, "aroma": 1, "appearance": 1, "bitter": 1}
    assert OverallCalculator.calculate(scores) == 1

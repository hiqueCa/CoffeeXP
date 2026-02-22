class OverallCalculator:
    FIELDS = ["flavor", "acidic", "aroma", "appearance", "bitter"]

    @classmethod
    def calculate(cls, scores: dict) -> int:
        values = [scores[field] for field in cls.FIELDS]
        return round(sum(values) / len(values))

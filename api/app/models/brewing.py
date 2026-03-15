from typing import Set


class Brewing:
    def __init__(
        self,
        user_id: int = None,
        method: Set[str] = None,
        coffee: Set[str] = None,
    ):
        self.user_id = user_id
        self.method = method
        self.coffee = coffee

class User:
    def __init__(self, email: str, hashed_password: str):
        self.id = None
        self.email = email
        self.hashed_password = hashed_password

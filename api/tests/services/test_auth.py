from app.services.auth import AuthService


def test_hash_password_returns_different_string():
    password = "mysecretpassword"
    hashed = AuthService.hash_password(password)
    assert hashed != password


def test_verify_password_returns_true_for_correct():
    password = "mysecretpassword"
    hashed = AuthService.hash_password(password)
    assert AuthService.verify_password(password, hashed) is True


def test_verify_password_returns_false_for_incorrect():
    hashed = AuthService.hash_password("correct")
    assert AuthService.verify_password("wrong", hashed) is False


def test_create_access_token():
    token = AuthService.create_access_token({"sub": "test@example.com"})
    assert isinstance(token, str)
    assert len(token) > 0


def test_decode_access_token():
    token = AuthService.create_access_token({"sub": "test@example.com"})
    payload = AuthService.decode_access_token(token)
    assert payload["sub"] == "test@example.com"


def test_decode_invalid_token_returns_none():
    payload = AuthService.decode_access_token("invalid.token.here")
    assert payload is None

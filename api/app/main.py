from fastapi import FastAPI

from app.routes.auth import router as auth_router
from app.routes.coffee_brands import router as coffee_brands_router

app = FastAPI(title="Coffee Exp API", version="0.1.0")

app.include_router(auth_router)
app.include_router(coffee_brands_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}

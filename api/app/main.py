from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.auth import router as auth_router
from app.routes.brewings import router as brewings_router
from app.routes.coffee_brands import router as coffee_brands_router
from app.routes.coffees import router as coffees_router

app = FastAPI(title="Coffee Exp API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(coffee_brands_router)
app.include_router(coffees_router)
app.include_router(brewings_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}

from fastapi import FastAPI
from .database import Base, engine
from .models import Customer
from .routers import customers,payments
from fastapi.middleware.cors import CORSMiddleware



Base.metadata.create_all(bind=engine)

app=FastAPI(title="Billing Engine")

app.include_router(customers.router)
app.include_router(payments.router)

app.add_middleware(
    CORSMiddleware,
     allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=["*"],
)


@app.get("/")
def root():
    return {"message": "Billing Engine API is running"}


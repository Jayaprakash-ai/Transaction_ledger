from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import customers, payments

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Billing Engine")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],             
    allow_credentials=False,        
    allow_methods=["*"],            
    allow_headers=["*"],             
)


app.include_router(customers.router)
app.include_router(payments.router)

@app.get("/")
def root():
    return {"message": "Billing Engine API is running"}

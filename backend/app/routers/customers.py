from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from .. import crud,schemas,database,models

router=APIRouter(prefix="/customers",tags=["customers"])

@router.post("")   
@router.post("/")  
def create_customer(customer:schemas.CustomerCreate, db: Session = Depends(database.get_db)):
    new_customer=crud.create_customer(db=db,customer=customer)
    return{
        "message": "Customer Created successfully",
        "customer_id": new_customer.customer_id,
        "name": new_customer.name,
        "balance": new_customer.balance,
        "email": new_customer.email
    }


@router.get("/")
def list_customer(db: Session = Depends(database.get_db)):
    return db.query(models.Customer).all()


@router.post("/login")
@router.post("/login/")
def login_customer(payload: schemas.CustomerLogin, db: Session = Depends(database.get_db)):
    try:
        # Calls the dual verification checker we added to crud.py
        user = crud.authenticate_customer(
            db=db, 
            customer_id=payload.customer_id, 
            password_attempt=payload.password
        )
        return {
            "message": "Authentication successful",
            "customer_id": user.customer_id,
            "name": user.name,
            "email": user.email,
            "balance": user.balance
        }
    except ValueError as e:
        raise HTTPException(
            status_code=401, 
            detail=str(e)
        )

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas, database

router = APIRouter(prefix="/payments", tags=["payments"])

@router.post("/send", response_model=schemas.Transaction)
def send_payments(transaction: schemas.TransactionCreate, db: Session = Depends(database.get_db)):
    try:
        db_transaction = crud.create_transaction(db, transaction)
        return db_transaction
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/all", response_model=list[schemas.Transaction])
def list_transactions(db: Session = Depends(database.get_db)):
    return crud.get_transactions(db)

@router.get("/history/{customer_id}")
def customer_transactions(customer_id: str, db: Session = Depends(database.get_db)):
    try:
        return crud.get_customer_transactions(db, customer_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

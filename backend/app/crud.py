from sqlalchemy.orm import Session
from . import models, schemas
import uuid
import secrets
from .security import hash_password,verify_password

def create_customer(db: Session, customer: schemas.CustomerCreate):
    if customer.customer_id:
        generated_id = customer.customer_id
    else:
        generated_id = "CUST-" + str(uuid.uuid4().int)[:12]

    encrypted_password=hash_password(customer.password)

    db_customer = models.Customer(
        name=customer.name,
        email=customer.email,
        balance=customer.balance,
        customer_id=generated_id,
        password=encrypted_password
    )
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def authenticate_customer(db: Session, customer_id: str, password_attempt: str):
    user = db.query(models.Customer).filter_by(customer_id=customer_id).first()
    if not user:
        raise ValueError("No account profile matching that Customer ID exists.")
    if not verify_password(password_attempt,user.password):
        raise ValueError("Invalid credentials. The password you entered is incorrect.")
    return user

def get_customers(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Customer).offset(skip).limit(limit).all()


def create_transaction(db: Session, transaction: schemas.TransactionCreate):
    if transaction.sender_id == transaction.receiver_id:
        raise ValueError("Self-Transactions are not allowed. Please enter a valid receiver details")

    sender = db.query(models.Customer).filter_by(customer_id=transaction.sender_id).first()
    receiver = db.query(models.Customer).filter_by(customer_id=transaction.receiver_id).first()

    if not sender or not receiver:
        raise ValueError("Invalid sender or receiver ID")
    if sender.balance < transaction.amount:
        raise ValueError(f"Insufficient balance. Your current balance is ₹{sender.balance}.")
    try:
        with db.begin_nested():
            sender.balance -= transaction.amount
            receiver.balance += transaction.amount

            generated_tx_id = "TXN-"+secrets.token_hex(6).upper()

            db_transaction = models.Transaction(
                id=generated_tx_id,
                sender_id=sender.customer_id,
                receiver_id=receiver.customer_id,
                amount=transaction.amount
            )
            db.add(db_transaction)
        db.commit()
        db.refresh(db_transaction)
        return db_transaction

    except Exception as e:
        db.rollback() 
        raise ValueError("Database ledger transaction interrupted. Balance operations aborted securely.")


def get_customer_transactions(db: Session, customer_id: str):
    transactions = db.query(models.Transaction).filter(
        (models.Transaction.sender_id == customer_id) |
        (models.Transaction.receiver_id == customer_id)
    ).all()

    if not transactions:
        raise ValueError("No transactions found for this customer")

    return transactions

def get_transactions(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Transaction).offset(skip).limit(limit).all()

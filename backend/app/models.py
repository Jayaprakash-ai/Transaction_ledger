from sqlalchemy import Column,Float,Integer,String,Numeric,ForeignKey,DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime, timezone
from .database import Base
from sqlalchemy.orm import relationship,Session
import uuid
from fastapi import HTTPException




class Customer(Base):
    __tablename__="customers"
    id = Column(Integer,primary_key=True,index=True)
    customer_id=Column(String,unique=True,index=True)
    name=Column(String,nullable=False)
    email=Column(String,nullable=True)
    balance=Column(Float,default=0.0,nullable=False)
    password = Column(String, nullable=False)


    sent_transactions = relationship("Transaction",foreign_keys="Transaction.sender_id",back_populates="sender")
    received_transactions = relationship("Transaction",foreign_keys="Transaction.receiver_id",back_populates="receiver")


class Transaction(Base):
    __tablename__="transactions"
    id = Column(String,primary_key=True,index=True)
    sender_id = Column(String, ForeignKey("customers.customer_id"),nullable=False)
    receiver_id = Column(String,ForeignKey("customers.customer_id"),nullable=False)
    amount = Column(Float,nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    sender= relationship("Customer",foreign_keys=[sender_id],back_populates="sent_transactions")
    receiver = relationship("Customer",foreign_keys=[receiver_id],back_populates="received_transactions")


def create_customer(db: Session, name: str, balance: float, email: str = None):
    db_customer = Customer(
        customer_id = "CUST-" + str(uuid.uuid4().int)[:12], 
        name=name,
        balance=balance,
        email=email
    )
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def create_transaction(db:Session,sender_id: str, receiver_id:str,amount:float):
    sender=db.query(Customer).filter_by(customer_id=sender_id).first()
    receiver=db.query(Customer).filter_by(customer_id=receiver_id).first()



    if not sender or not receiver:
        raise HTTPException(status_code=404, detail="Invalid sender or receiver ID")
    if sender.balance < amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")


    sender.balance -= amount
    receiver.balance += amount

    transaction = Transaction(
        sender_id=sender.customer_id,
        receiver_id=receiver.customer_id,
        amount=amount
    )
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


def get_transactions(db:Session):
    """Return all transaction."""
    return db.query(Transaction).all()

def get_customer_transactions(db : Session, customer_id:str):
    "Returing transaction of single customer"
    customer = db.query(Customer).filter_by(customer_id=customer_id).first()
    if not customer:
        raise ValueError("Customer not found")
    combined = customer.sent_transactions + customer.received_transactions
    unique_transactions = list({tx.id: tx for tx in combined}.values())
    unique_transactions.sort(key=lambda t: t.timestamp, reverse=True)
    return {
        "sent": [tx for tx in unique_transactions if tx.sender_id == customer_id],
        "received": [tx for tx in unique_transactions if tx.receiver_id == customer_id]
    }

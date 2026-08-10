from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CustomerBase(BaseModel):
    name: str
    email: Optional[str] = None
    balance: float

class CustomerCreate(CustomerBase):
    customer_id: Optional[str] = None
    password:str

class Customer(CustomerBase):
    id: int
    customer_id: str   
    model_config = {"from_attributes": True}

class TransactionBase(BaseModel):
    sender_id: str
    receiver_id: str
    amount: float

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: str
    timestamp: datetime
    model_config = {"from_attributes": True}
class CustomerLogin(BaseModel):
    customer_id: str
    password: str

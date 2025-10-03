from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class InventoryItem(BaseModel):
    id: str
    name: str
    category: str
    price: float
    stock: int
    unit: str  # kg, liters, pieces, etc.
    supplier: str
    rating: float = 0.0
    description: Optional[str] = ""
    image_url: Optional[str] = ""
    min_order_quantity: int = 1
    delivery_time: str = "2-3 days"
    last_updated: datetime = Field(default_factory=datetime.now)

class OrderItem(BaseModel):
    item_id: str
    quantity: int

class OrderCreate(BaseModel):
    vendor_id: str
    items: List[OrderItem]
    delivery_address: str
    notes: Optional[str] = ""
    estimated_delivery: Optional[str] = None

class OrderResponse(BaseModel):
    order_id: str
    vendor_id: str
    total_amount: float
    status: str
    message: str
    estimated_delivery: str

class OrderStatus(BaseModel):
    status: str
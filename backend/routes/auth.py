from fastapi import APIRouter, HTTPException
from models.vendor import VendorLogin, VendorCreate
from database import vendor_collection
from bson.objectid import ObjectId
import hashlib

router = APIRouter()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@router.post("/vendor/register")
def register_vendor(data: VendorCreate):
    if vendor_collection.find_one({"phone": data.phone}):
        raise HTTPException(status_code=400, detail="Phone number already exists")

    vendor_collection.insert_one({
        "full_name": data.full_name,
        "phone": data.phone,
        "password": hash_password(data.password)
    })
    return {"msg": "Vendor registered successfully"}

@router.post("/vendor/login")
def login_vendor(data: VendorLogin):
    vendor = vendor_collection.find_one({"phone": data.phone})
    if not vendor or vendor["password"] != hash_password(data.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"msg": "Login successful", "vendor_id": str(vendor["_id"])}

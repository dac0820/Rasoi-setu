from pydantic import BaseModel

class VendorLogin(BaseModel):
    phone: str
    password: str

class VendorCreate(BaseModel):
    full_name: str
    phone: str
    password: str

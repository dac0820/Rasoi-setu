from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from database import client
from bson.objectid import ObjectId

router = APIRouter()

db = client["Rasoisetu"]
sellers_collection = db["seller"]

class Seller(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str
    products: list[str]

class SellerLogin(BaseModel):
    email: EmailStr
    password: str

class StatusCheckRequest(BaseModel):
    email: EmailStr

class StatusUpdateRequest(BaseModel):
    status: str

@router.post("/seller/register")
async def register_seller(seller: Seller):
    existing = sellers_collection.find_one({"phone": seller.phone})
    if existing:
        raise HTTPException(status_code=400, detail="Seller already exists")

    hashed_password = seller.password  # In real apps, hash it

    seller_data = {
        "name": seller.name,
        "email": seller.email,
        "phone": seller.phone,
        "password": hashed_password,
        "products": seller.products,
        "documents": {
            "aadhar": "aadhar_uploaded.pdf",
            "pan": "pan_uploaded.pdf",
            "bank": "bank_uploaded.pdf"
        },
        "status": "pending",
        "rating": 0
    }

    result = sellers_collection.insert_one(seller_data)
    return {"message": "Seller registered successfully", "seller_id": str(result.inserted_id)}

@router.post("/seller/login")
async def login_seller(login_data: SellerLogin):
    seller = sellers_collection.find_one({"email": login_data.email})
    if not seller:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if login_data.password != seller["password"]:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if seller.get("status") != "approved":
        raise HTTPException(status_code=403, detail="Account not approved yet")

    return {
        "message": "Login successful",
        "seller": {
            "id": str(seller["_id"]),
            "name": seller["name"],
            "email": seller["email"],
            "phone": seller["phone"]
        }
    }

@router.post("/seller/check-status")
async def check_seller_status(request: StatusCheckRequest):
    """
    Check seller application status by email ID
    """
    try:
        # Search for seller by email (case-insensitive)
        seller = sellers_collection.find_one({
            "email": {"$regex": f"^{request.email}$", "$options": "i"}
        })
        
        if not seller:
            return {
                "success": False,
                "message": f"No application found with email: {request.email}",
                "data": None
            }
        
        # Create appropriate message based on status
        status_messages = {
            "pending": "Your application is under review. You'll receive an email within 2-3 business days.",
            "approved": "Congratulations! Your application has been approved. You can now access your dashboard.",
            "rejected": "Your application has been rejected. Please contact support for more information."
        }
        
        message = status_messages.get(seller["status"], "Application status retrieved successfully.")
        
        seller_data = {
            "id": str(seller["_id"]),
            "name": seller["name"],
            "email": seller["email"],
            "phone": seller["phone"],
            "products": seller.get("products", []),
            "status": seller.get("status", "pending"),
            "rating": seller.get("rating", 0)
        }
        
        return {
            "success": True,
            "message": message,
            "data": seller_data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/seller/status/{email}")
async def get_seller_status_by_email(email: str):
    """
    Alternative GET endpoint to check seller status by email
    """
    try:
        # Basic email validation
        if "@" not in email or "." not in email:
            raise HTTPException(status_code=400, detail="Invalid email format")
        
        # Search for seller by email (case-insensitive)
        seller = sellers_collection.find_one({
            "email": {"$regex": f"^{email}$", "$options": "i"}
        })
        
        if not seller:
            raise HTTPException(
                status_code=404, 
                detail=f"No application found with email: {email}"
            )
        
        seller_data = {
            "id": str(seller["_id"]),
            "name": seller["name"],
            "email": seller["email"],
            "phone": seller["phone"],
            "products": seller.get("products", []),
            "status": seller.get("status", "pending"),
            "rating": seller.get("rating", 0)
        }
        
        return {
            "success": True,
            "message": "Seller status retrieved successfully",
            "data": seller_data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/seller/all")
async def get_all_sellers():
    """
    Get all sellers with their status (for admin panel)
    """
    try:
        sellers = list(sellers_collection.find({}))
        seller_list = []
        
        for seller in sellers:
            seller_data = {
                "id": str(seller["_id"]),
                "name": seller["name"],
                "email": seller["email"],
                "phone": seller["phone"],
                "products": seller.get("products", []),
                "status": seller.get("status", "pending"),
                "rating": seller.get("rating", 0),
                "documents": seller.get("documents", {})
            }
            seller_list.append(seller_data)
        
        return {
            "success": True,
            "message": f"Retrieved {len(seller_list)} sellers",
            "sellers": seller_list,
            "count": len(seller_list)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/seller/approved")
async def get_approved_sellers():
    """
    Get all approved sellers
    """
    try:
        sellers = list(sellers_collection.find({"status": "approved"}))
        seller_list = []
        
        for seller in sellers:
            seller_data = {
                "id": str(seller["_id"]),
                "name": seller["name"],
                "email": seller["email"],
                "phone": seller["phone"],
                "products": seller.get("products", []),
                "status": seller.get("status", "approved"),
                "rating": seller.get("rating", 0)
            }
            seller_list.append(seller_data)
        
        return {
            "success": True,
            "message": f"Retrieved {len(seller_list)} approved sellers",
            "data": seller_list,
            "count": len(seller_list)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/seller/rejected")
async def get_rejected_sellers():
    """
    Get all rejected sellers
    """
    try:
        sellers = list(sellers_collection.find({"status": "rejected"}))
        seller_list = []
        
        for seller in sellers:
            seller_data = {
                "id": str(seller["_id"]),
                "name": seller["name"],
                "email": seller["email"],
                "phone": seller["phone"],
                "products": seller.get("products", []),
                "status": seller.get("status", "rejected"),
                "rating": seller.get("rating", 0)
            }
            seller_list.append(seller_data)
        
        return {
            "success": True,
            "message": f"Retrieved {len(seller_list)} rejected sellers",
            "data": seller_list,
            "count": len(seller_list)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/seller/pending")
async def get_pending_sellers():
    """
    Get all pending seller applications
    """
    try:
        sellers = sellers_collection.find({"status": "pending"})
        result = []
        for seller in sellers:
            result.append({
                "id": str(seller["_id"]),
                "name": seller["name"],
                "email": seller["email"],
                "phone": seller["phone"],
                "products": seller.get("products", []),
                "status": seller.get("status", "pending"),
                "rating": seller.get("rating", 0)
            })
        return {"success": True, "data": result, "count": len(result)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/seller/stats")
async def get_seller_statistics():
    """
    Get seller statistics for admin dashboard
    """
    try:
        # Get counts by status
        total_sellers = sellers_collection.count_documents({})
        pending_count = sellers_collection.count_documents({"status": "pending"})
        approved_count = sellers_collection.count_documents({"status": "approved"})
        rejected_count = sellers_collection.count_documents({"status": "rejected"})
        
        # Calculate approval rate
        approval_rate = 0
        if (approved_count + rejected_count) > 0:
            approval_rate = round((approved_count / (approved_count + rejected_count)) * 100, 2)
        
        return {
            "success": True,
            "message": "Seller statistics retrieved successfully",
            "data": {
                "total_sellers": total_sellers,
                "pending_applications": pending_count,
                "approved_sellers": approved_count,
                "rejected_applications": rejected_count,
                "approval_rate": approval_rate,
                "status_breakdown": {
                    "pending": pending_count,
                    "approved": approved_count,
                    "rejected": rejected_count
                }
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# MAIN STATUS UPDATE ENDPOINT - This is what the frontend calls
@router.patch("/seller/{seller_id}/status")
async def update_seller_status(seller_id: str, request: StatusUpdateRequest):
    """
    Update seller application status (for admin use)
    This endpoint updates the seller status in the database
    """
    try:
        # Validate status
        valid_statuses = ["pending", "approved", "rejected"]
        if request.status not in valid_statuses:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            )
        
        # Validate seller ID format
        if not ObjectId.is_valid(seller_id):
            raise HTTPException(status_code=400, detail="Invalid seller ID format")
        
        # Check if seller exists
        existing_seller = sellers_collection.find_one({"_id": ObjectId(seller_id)})
        if not existing_seller:
            raise HTTPException(status_code=404, detail="Seller not found")
        
        # Update seller status in database
        result = sellers_collection.update_one(
            {"_id": ObjectId(seller_id)},
            {
                "$set": {
                    "status": request.status,
                    "updated_at": "2024-01-01T00:00:00Z"  # You can use datetime.utcnow() for real timestamp
                }
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=500, detail="Failed to update seller status")
        
        # Get updated seller data
        updated_seller = sellers_collection.find_one({"_id": ObjectId(seller_id)})
        
        return {
            "success": True,
            "message": f"Seller status updated to {request.status} successfully",
            "data": {
                "id": str(updated_seller["_id"]),
                "name": updated_seller["name"],
                "email": updated_seller["email"],
                "status": updated_seller["status"]
            }
        }
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid seller ID format")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/seller/details/{seller_id}")
async def get_seller_details(seller_id: str):
    """
    Get seller details by ID
    """
    try:
        seller = sellers_collection.find_one({"_id": ObjectId(seller_id)})
        
        if not seller:
            raise HTTPException(status_code=404, detail="Seller not found")
        
        seller_data = {
            "id": str(seller["_id"]),
            "name": seller["name"],
            "email": seller["email"],
            "phone": seller["phone"],
            "products": seller.get("products", []),
            "status": seller.get("status", "pending"),
            "rating": seller.get("rating", 0),
            "documents": seller.get("documents", {})
        }
        
        return {
            "success": True,
            "message": "Seller details retrieved successfully",
            "data": seller_data
        }
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid seller ID format")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
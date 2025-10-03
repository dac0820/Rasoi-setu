from fastapi import APIRouter, HTTPException, Path
from pydantic import BaseModel
from database import client
from bson.objectid import ObjectId

router = APIRouter()

db = client["Rasoisetu"]
sellers_collection = db["seller"]

class StatusUpdateRequest(BaseModel):
    status: str

@router.patch("/api/seller/{seller_id}/route")
async def update_seller_status(
    seller_id: str = Path(..., description="Seller ID"),
    request: StatusUpdateRequest = None
):
    """
    Update seller application status (approve/reject)
    """
    try:
        # Validate status
        valid_statuses = ["pending", "approved", "rejected"]
        if request.status not in valid_statuses:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            )
        
        # Validate ObjectId format
        try:
            object_id = ObjectId(seller_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid seller ID format")
        
        # Check if seller exists
        existing_seller = sellers_collection.find_one({"_id": object_id})
        if not existing_seller:
            raise HTTPException(status_code=404, detail="Seller not found")
        
        # Update seller status in database
        result = sellers_collection.update_one(
            {"_id": object_id},
            {"$set": {"status": request.status}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=500, detail="Failed to update seller status")
        
        # Get updated seller data
        updated_seller = sellers_collection.find_one({"_id": object_id})
        
        return {
            "success": True,
            "message": f"Seller status updated to {request.status}",
            "data": {
                "id": str(updated_seller["_id"]),
                "name": updated_seller["name"],
                "email": updated_seller["email"],
                "status": updated_seller["status"]
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Alternative route if you prefer a different URL pattern
@router.patch("/api/seller/status/{seller_id}")
async def update_seller_status_alt(
    seller_id: str = Path(..., description="Seller ID"),
    request: StatusUpdateRequest = None
):
    """
    Alternative endpoint for updating seller status
    """
    try:
        # Validate status
        valid_statuses = ["pending", "approved", "rejected"]
        if request.status not in valid_statuses:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            )
        
        # Validate ObjectId format
        try:
            object_id = ObjectId(seller_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid seller ID format")
        
        # Update seller status in database
        result = sellers_collection.update_one(
            {"_id": object_id},
            {"$set": {"status": request.status}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Seller not found")
        
        if result.modified_count == 0:
            raise HTTPException(status_code=500, detail="Failed to update seller status")
        
        return {
            "success": True,
            "message": f"Seller status updated to {request.status}",
            "seller_id": seller_id,
            "new_status": request.status
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
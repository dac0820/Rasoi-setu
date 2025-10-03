from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from models.inventory import InventoryItem, OrderCreate, OrderResponse
from database import inventory_collection, order_collection, vendor_collection
from bson.objectid import ObjectId
from datetime import datetime
import uuid

router = APIRouter()

@router.get("/inventory/items", response_model=List[InventoryItem])
def get_available_items(
    category: Optional[str] = Query(None, description="Filter by category"),
    min_stock: Optional[int] = Query(None, description="Minimum stock level"),
    max_price: Optional[float] = Query(None, description="Maximum price"),
    search: Optional[str] = Query(None, description="Search by name")
):
    """Get all available inventory items with optional filters"""
    try:
        # Build query
        query = {"stock": {"$gt": 0}}  # Only items with stock > 0
        
        if category:
            query["category"] = {"$regex": category, "$options": "i"}
        
        if min_stock:
            query["stock"]["$gte"] = min_stock
            
        if max_price:
            query["price"] = {"$lte": max_price}
            
        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}},
                {"supplier": {"$regex": search, "$options": "i"}}
            ]
        
        # Get items from database
        items = list(inventory_collection.find(query))
        
        # Convert MongoDB documents to InventoryItem format
        result = []
        for item in items:
            inventory_item = InventoryItem(
                id=str(item["_id"]),
                name=item["name"],
                category=item["category"],
                price=item["price"],
                stock=item["stock"],
                unit=item["unit"],
                supplier=item["supplier"],
                rating=item.get("rating", 0),
                description=item.get("description", ""),
                image_url=item.get("image_url", ""),
                min_order_quantity=item.get("min_order_quantity", 1),
                delivery_time=item.get("delivery_time", "2-3 days"),
                last_updated=item.get("last_updated", datetime.now())
            )
            result.append(inventory_item)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching inventory: {str(e)}")

@router.get("/inventory/categories")
def get_categories():
    """Get all available categories"""
    try:
        categories = inventory_collection.distinct("category")
        return {"categories": categories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching categories: {str(e)}")

@router.get("/inventory/item/{item_id}", response_model=InventoryItem)
def get_item_details(item_id: str):
    """Get detailed information about a specific item"""
    try:
        if not ObjectId.is_valid(item_id):
            raise HTTPException(status_code=400, detail="Invalid item ID")
            
        item = inventory_collection.find_one({"_id": ObjectId(item_id)})
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        
        return InventoryItem(
            id=str(item["_id"]),
            name=item["name"],
            category=item["category"],
            price=item["price"],
            stock=item["stock"],
            unit=item["unit"],
            supplier=item["supplier"],
            rating=item.get("rating", 0),
            description=item.get("description", ""),
            image_url=item.get("image_url", ""),
            min_order_quantity=item.get("min_order_quantity", 1),
            delivery_time=item.get("delivery_time", "2-3 days"),
            last_updated=item.get("last_updated", datetime.now())
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching item details: {str(e)}")

@router.post("/orders/place", response_model=OrderResponse)
def place_order(order_data: OrderCreate):
    """Place a new order"""
    try:
        # Verify vendor exists
        if not ObjectId.is_valid(order_data.vendor_id):
            raise HTTPException(status_code=400, detail="Invalid vendor ID")
            
        vendor = vendor_collection.find_one({"_id": ObjectId(order_data.vendor_id)})
        if not vendor:
            raise HTTPException(status_code=404, detail="Vendor not found")
        
        # Verify all items exist and have sufficient stock
        total_amount = 0
        order_items = []
        
        for item in order_data.items:
            if not ObjectId.is_valid(item.item_id):
                raise HTTPException(status_code=400, detail=f"Invalid item ID: {item.item_id}")
                
            inventory_item = inventory_collection.find_one({"_id": ObjectId(item.item_id)})
            if not inventory_item:
                raise HTTPException(status_code=404, detail=f"Item not found: {item.item_id}")
            
            if inventory_item["stock"] < item.quantity:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Insufficient stock for {inventory_item['name']}. Available: {inventory_item['stock']}, Requested: {item.quantity}"
                )
            
            if item.quantity < inventory_item.get("min_order_quantity", 1):
                raise HTTPException(
                    status_code=400,
                    detail=f"Minimum order quantity for {inventory_item['name']} is {inventory_item.get('min_order_quantity', 1)}"
                )
            
            item_total = inventory_item["price"] * item.quantity
            total_amount += item_total
            
            order_items.append({
                "item_id": item.item_id,
                "name": inventory_item["name"],
                "price": inventory_item["price"],
                "quantity": item.quantity,
                "unit": inventory_item["unit"],
                "total": item_total,
                "supplier": inventory_item["supplier"]
            })
        
        # Generate order ID
        order_id = str(uuid.uuid4())[:8].upper()
        
        # Create order document
        order_doc = {
            "order_id": order_id,
            "vendor_id": order_data.vendor_id,
            "vendor_name": vendor["full_name"],
            "vendor_phone": vendor["phone"],
            "items": order_items,
            "total_amount": total_amount,
            "status": "pending",
            "delivery_address": order_data.delivery_address,
            "notes": order_data.notes,
            "created_at": datetime.now(),
            "estimated_delivery": order_data.estimated_delivery or "2-3 days"
        }
        
        # Insert order
        result = order_collection.insert_one(order_doc)
        
        # Update inventory stocks
        for item in order_data.items:
            inventory_collection.update_one(
                {"_id": ObjectId(item.item_id)},
                {"$inc": {"stock": -item.quantity}}
            )
        
        return OrderResponse(
            order_id=order_id,
            vendor_id=order_data.vendor_id,
            total_amount=total_amount,
            status="pending",
            message="Order placed successfully",
            estimated_delivery=order_doc["estimated_delivery"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error placing order: {str(e)}")

@router.get("/orders/vendor/{vendor_id}")
def get_vendor_orders(vendor_id: str, status: Optional[str] = Query(None)):
    """Get all orders for a specific vendor"""
    try:
        if not ObjectId.is_valid(vendor_id):
            raise HTTPException(status_code=400, detail="Invalid vendor ID")
        
        query = {"vendor_id": vendor_id}
        if status:
            query["status"] = status
        
        orders = list(order_collection.find(query).sort("created_at", -1))
        
        # Convert ObjectId to string
        for order in orders:
            order["_id"] = str(order["_id"])
            order["created_at"] = order["created_at"].isoformat()
        
        return {"orders": orders}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching orders: {str(e)}")

@router.get("/orders/{order_id}")
def get_order_details(order_id: str):
    """Get detailed information about a specific order"""
    try:
        order = order_collection.find_one({"order_id": order_id})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        order["_id"] = str(order["_id"])
        order["created_at"] = order["created_at"].isoformat()
        
        return {"order": order}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching order details: {str(e)}")

@router.put("/orders/{order_id}/status")
def update_order_status(order_id: str, status: str):
    """Update order status"""
    try:
        valid_statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]
        if status not in valid_statuses:
            raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
        
        result = order_collection.update_one(
            {"order_id": order_id},
            {"$set": {"status": status, "updated_at": datetime.now()}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Order not found")
        
        return {"message": f"Order status updated to {status}"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating order status: {str(e)}")

@router.get("/inventory/low-stock")
def get_low_stock_items(threshold: int = Query(20, description="Stock threshold")):
    """Get items with stock below threshold"""
    try:
        items = list(inventory_collection.find({"stock": {"$lte": threshold}}))
        
        result = []
        for item in items:
            result.append({
                "id": str(item["_id"]),
                "name": item["name"],
                "stock": item["stock"],
                "category": item["category"],
                "supplier": item["supplier"]
            })
        
        return {"low_stock_items": result, "count": len(result)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching low stock items: {str(e)}")
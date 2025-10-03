from pymongo import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# MongoDB connection URI (you can also get it from .env)
MONGODB_URI = "mongodb+srv://bhavitachandariya:Dhruvilc0820@rasoisetu.tyrrv4c.mongodb.net/?retryWrites=true&w=majority&appName=Rasoisetu"

# Initialize MongoDB client
client = MongoClient(MONGODB_URI, server_api=ServerApi("1"), tls=True)

# Test connection
try:
    client.admin.command("ping")
    print("✅ Connected to MongoDB!")
except Exception as e:
    print("❌ Connection error:", e)

# Access DB and new collection
db = client["Rasoisetu"]
ingredients_collection = db["ingredients"]

# Dummy ingredient data
dummy_ingredients = [
    {
        "name": "Tomato",
        "category": "Vegetable",
        "unit": "kg",
        "price": 25,
        "available": True,
        "vendor_id": "vendor_001"
    },
    {
        "name": "Basmati Rice",
        "category": "Grain",
        "unit": "kg",
        "price": 60,
        "available": True,
        "vendor_id": "vendor_002"
    },
    {
        "name": "Sunflower Oil",
        "category": "Oil",
        "unit": "liter",
        "price": 110,
        "available": True,
        "vendor_id": "vendor_003"
    },
    {
        "name": "Green Chilli",
        "category": "Spice",
        "unit": "kg",
        "price": 40,
        "available": False,
        "vendor_id": "vendor_004"
    },
    {
        "name": "Wheat Flour",
        "category": "Grain",
        "unit": "kg",
        "price": 35,
        "available": True,
        "vendor_id": "vendor_005"
    }
]

# Insert dummy data into MongoDB
result = ingredients_collection.insert_many(dummy_ingredients)
print("✅ Inserted ingredient IDs:", result.inserted_ids)


# Ingredients to add
additional_ingredients = [
    {"name": "Rice", "category": "Grain", "unit": "kg", "price": 50, "available": True, "vendor_id": "vendor_006"},
    {"name": "Dal", "category": "Pulse", "unit": "kg", "price": 70, "available": True, "vendor_id": "vendor_006"},
    {"name": "Oil", "category": "Oil", "unit": "liter", "price": 120, "available": True, "vendor_id": "vendor_006"},
    {"name": "Flour", "category": "Grain", "unit": "kg", "price": 38, "available": True, "vendor_id": "vendor_006"},

    {"name": "Bread", "category": "Bakery", "unit": "pack", "price": 30, "available": True, "vendor_id": "vendor_007"},
    {"name": "Potato", "category": "Vegetable", "unit": "kg", "price": 20, "available": True, "vendor_id": "vendor_007"},
    {"name": "Onion", "category": "Vegetable", "unit": "kg", "price": 25, "available": True, "vendor_id": "vendor_007"},
    {"name": "Masala", "category": "Spice", "unit": "packet", "price": 15, "available": True, "vendor_id": "vendor_007"}
]

# Insert into collection
result = ingredients_collection.insert_many(additional_ingredients)
print("✅ Inserted ingredient IDs:", result.inserted_ids)

from pymongo import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os

# Load from .env file
load_dotenv()

MONGODB_URI="mongodb+srv://<your_email>:<your_pass>@rasoisetu.tyrrv4c.mongodb.net/?retryWrites=true&w=majority&appName=Rasoisetu"


# Connect safely
client = MongoClient(
    MONGODB_URI,
    server_api=ServerApi("1"),
    tls=True
)

try:
    client.admin.command("ping")
    print("✅ Connected to MongoDB!")
except Exception as e:
    client.admin.command("ping")
    print("❌ Connection error:", e)

# Example collection access
db = client["Rasoisetu"]
vendor_collection = db["vendor"]
seller_collection = db["seller"]

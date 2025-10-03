from fastapi import FastAPI
from routes import auth, seller
from fastapi.middleware.cors import CORSMiddleware
from seller_status_route import router as seller_status_router


app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "RasoiSetu Backend is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "Backend server is operational"}

app.include_router(auth.router)
app.include_router(seller.router)
app.include_router(seller_status_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend origin
    allow_methods=["*"],
    allow_headers=["*"],
)

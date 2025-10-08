from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware

# Import routers
from app.routers import auth, financial, dashboard, export, hotmart

# Create the main app without a prefix
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Include all routers
api_router.include_router(auth.router)
api_router.include_router(financial.router)
api_router.include_router(dashboard.router)
api_router.include_router(export.router)
api_router.include_router(hotmart.router)

# Include the API router in the main app
app.include_router(api_router)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Financial Control API is running"}
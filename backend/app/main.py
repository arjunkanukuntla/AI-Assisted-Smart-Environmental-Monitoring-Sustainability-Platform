from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.seed_data import seed_database
from app.routers import data_management, analytics, optimization, public_portal, integrations

# Auto-create tables & seed database on app launch
Base.metadata.create_all(bind=engine)
seed_database()

app = FastAPI(
    title="AI-Assisted Smart Environmental Monitoring Platform",
    description="Integrated API for environmental telemetry, AI forecasting, waste route optimization, public reporting, and IoT service integrations.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for React frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Module Routers
app.include_router(data_management.router)
app.include_router(analytics.router)
app.include_router(optimization.router)
app.include_router(public_portal.router)
app.include_router(integrations.router)

@app.get("/")
def root():
    return {
        "platform": "AI-Assisted Smart Environmental Monitoring & Sustainability Platform",
        "status": "Online & Operational",
        "team_members": ["P. Varshith", "Snehith", "Sai Vishal", "Arjun", "BV. Charan"],
        "version": "1.0.0",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

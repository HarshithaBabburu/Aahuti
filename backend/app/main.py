from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database.seed_data import seed_database
from app.routers import (
    donations, recipients, donors, decisions, impact, evaluation, reviews
)

app = FastAPI(
    title="Aahuti (आहुति) — AI-Powered Food Rescue",
    version=settings.VERSION,
    description="Aahuti: “An offering or a sacred contribution.” Aahuti — Every offering matters. AI-powered surplus food rescue platform powered by Strands Agents, Decider 2B, and Amazon Bedrock."
)

# Enable CORS — open to all origins so the Vercel frontend can reach the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # Must be False when allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup: Initialize DB and seed demo data
@app.on_event("startup")
def startup_event():
    seed_database()

# Register API Routers (both with /api prefix and without, ensuring 100% route compatibility across all proxy styles)
app.include_router(reviews.router, prefix=settings.API_V1_PREFIX)
app.include_router(donations.router, prefix=settings.API_V1_PREFIX)
app.include_router(recipients.router, prefix=settings.API_V1_PREFIX)
app.include_router(donors.router, prefix=settings.API_V1_PREFIX)
app.include_router(decisions.router, prefix=settings.API_V1_PREFIX)
app.include_router(impact.router, prefix=settings.API_V1_PREFIX)
app.include_router(evaluation.router, prefix=settings.API_V1_PREFIX)

app.include_router(reviews.router)
app.include_router(donations.router)
app.include_router(recipients.router)
app.include_router(donors.router)
app.include_router(decisions.router)
app.include_router(impact.router)
app.include_router(evaluation.router)

@app.get("/")
def root():
    return {
        "system": "Aahuti (आहुति) — AI-Powered Food Rescue",
        "meaning": "An offering or a sacred contribution.",
        "tagline": "Aahuti — Every offering matters.",
        "powered_by": "Strands Agents · Decider 2B · Amazon Bedrock",
        "version": settings.VERSION,
        "status": "online",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

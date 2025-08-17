from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_tables, SessionLocal
from schemas.intervention import router as intervention_router
from app.models.intervention import Intervention
from app.models.artisan import Artisan
from app.models.agency import Agency
from sqlalchemy import func

# Création de l'application FastAPI
app = FastAPI(
    title="GMBS Interventions API",
    description="API pour la gestion des interventions GMBS",
    version="1.0.0"
)

# Configuration CORS pour les ports frontend
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002", 
    "http://localhost:3003",
    "http://localhost:3004",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002",
    "http://127.0.0.1:3003", 
    "http://127.0.0.1:3004",
    "*"  # Pour le développement - à retirer en production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusion des routes
app.include_router(intervention_router)

# Création des tables au démarrage (seulement si elles n'existent pas)
@app.on_event("startup")
async def startup_event():
    try:
        create_tables()
        print("✅ Tables créées ou déjà existantes")
    except Exception as e:
        print(f"⚠️ Erreur lors de la création des tables: {e}")

# Route de santé
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "interventions-api",
        "version": "1.0.0"
    }

# Route racine
@app.get("/")
async def root():
    return {
        "message": "GMBS Interventions API",
        "version": "1.0.0",
        "docs": "/docs",
        "cors_origins": origins
    }

# Endpoint de test simple
@app.get("/test")
async def test_endpoint():
    return {
        "message": "Test endpoint fonctionnel",
        "cors_enabled": True,
        "frontend_ports": ["3000", "3001", "3002", "3003", "3004"]
    }

# Endpoint de statistiques simple
@app.get("/simple-stats")
async def simple_stats():
    db = SessionLocal()
    try:
        total_interventions = db.query(Intervention).count()
        total_artisans = db.query(Artisan).count()
        total_agencies = db.query(Agency).count()
        
        return {
            "total_interventions": total_interventions,
            "total_artisans": total_artisans,
            "total_agencies": total_agencies,
            "message": "Statistiques simples"
        }
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

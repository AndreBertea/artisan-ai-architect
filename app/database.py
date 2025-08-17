from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os

# Configuration de la base de données
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./interventions.db")

# Création du moteur de base de données
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

# Création de la session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base pour les modèles
Base = declarative_base()

# Fonction pour créer les tables
def create_tables():
    from .models.common import Base as CommonBase
    from .models.artisan import Artisan
    from .models.agency import Agency
    from .models.intervention import Intervention
    from .models.user import User
    
    # Import tous les modèles pour qu'ils soient enregistrés
    CommonBase.metadata.create_all(bind=engine)

# Fonction pour obtenir la session DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

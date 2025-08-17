from app.database import SessionLocal
from app.models.intervention import Intervention
from app.models.artisan import Artisan
from app.models.agency import Agency

def test_database():
    db = SessionLocal()
    try:
        # Test des interventions
        interventions_count = db.query(Intervention).count()
        print(f"Interventions: {interventions_count}")
        
        # Test des artisans
        artisans_count = db.query(Artisan).count()
        print(f"Artisans: {artisans_count}")
        
        # Test des agences
        agencies_count = db.query(Agency).count()
        print(f"Agences: {agencies_count}")
        
        # Afficher quelques interventions
        interventions = db.query(Intervention).limit(5).all()
        print(f"\nPremières 5 interventions:")
        for i, intervention in enumerate(interventions, 1):
            print(f"  {i}. {intervention.address[:50]}... - {intervention.tenant_name}")
            
    except Exception as e:
        print(f"Erreur: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_database()

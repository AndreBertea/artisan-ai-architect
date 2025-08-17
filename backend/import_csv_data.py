import csv
import os
from datetime import datetime
from sqlalchemy.orm import Session
from app.database import SessionLocal, create_tables
from app.models.intervention import Intervention
from app.models.artisan import Artisan
from app.models.agency import Agency
from app.models.common import Comment, Document, EntityTypeEnum, InterventionStatusEnum

class CSVImporter:
    def __init__(self):
        self.db = SessionLocal()
        self.artisan_cache = {}
        self.agency_cache = {}
        
    def __del__(self):
        self.db.close()
    
    def parse_date(self, date_str):
        """Parse une date avec gestion d'erreurs"""
        if not date_str or date_str.strip() == "":
            return None
        
        try:
            # Essayer différents formats de date
            formats = [
                "%d/%m/%Y",
                "%Y-%m-%d",
                "%d-%m-%Y",
                "%d/%m/%y",
                "%Y/%m/%d"
            ]
            
            for fmt in formats:
                try:
                    return datetime.strptime(date_str.strip(), fmt)
                except ValueError:
                    continue
            
            # Si aucun format ne fonctionne, retourner None
            return None
        except:
            return None
    
    def parse_float(self, value):
        """Parse un float avec gestion d'erreurs"""
        if not value or value.strip() == "":
            return 0.0
        
        try:
            # Remplacer les virgules par des points
            value = value.replace(",", ".")
            return float(value)
        except:
            return 0.0
    
    def get_or_create_artisan(self, artisan_name):
        """Récupère ou crée un artisan"""
        if not artisan_name or artisan_name.strip() == "":
            return None
        
        artisan_name = artisan_name.strip()
        
        # Vérifier le cache
        if artisan_name in self.artisan_cache:
            return self.artisan_cache[artisan_name]
        
        # Chercher dans la base
        artisan = self.db.query(Artisan).filter(Artisan.name == artisan_name).first()
        
        if not artisan:
            # Créer un nouvel artisan
            artisan = Artisan(
                name=artisan_name,
                status="actif",
                dossier_status="en_cours"
            )
            self.db.add(artisan)
            self.db.commit()
            self.db.refresh(artisan)
        
        # Mettre en cache
        self.artisan_cache[artisan_name] = artisan
        return artisan
    
    def get_or_create_agency(self, agency_name):
        """Récupère ou crée une agence"""
        if not agency_name or agency_name.strip() == "":
            return None
        
        agency_name = agency_name.strip()
        
        # Vérifier le cache
        if agency_name in self.agency_cache:
            return self.agency_cache[agency_name]
        
        # Chercher dans la base
        agency = self.db.query(Agency).filter(Agency.name == agency_name).first()
        
        if not agency:
            # Créer une nouvelle agence
            agency = Agency(
                name=agency_name,
                status="actif"
            )
            self.db.add(agency)
            self.db.commit()
            self.db.refresh(agency)
        
        # Mettre en cache
        self.agency_cache[agency_name] = agency
        return agency
    
    def import_csv_data(self):
        """Importe les données du CSV"""
        csv_file = "../sample/interventionGMBS_SUIVIINTERGMBS_2025.csv"
        
        if not os.path.exists(csv_file):
            print(f"❌ Fichier CSV non trouvé: {csv_file}")
            return
        
        print(f"📁 Import du fichier: {csv_file}")
        
        imported_count = 0
        error_count = 0
        
        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            for row_num, row in enumerate(reader, start=2):  # Commencer à 2 car ligne 1 = headers
                try:
                    # Récupérer ou créer l'artisan
                    artisan = self.get_or_create_artisan(row.get('Métier', ''))
                    
                    # Récupérer ou créer l'agence
                    agency = self.get_or_create_agency(row.get('Agence', ''))
                    
                    # Parser les dates
                    created_date = self.parse_date(row.get('Date', ''))
                    intervention_date = self.parse_date(row.get('Date d\'intervention', ''))
                    
                    # Parser les coûts
                    sst_cost = self.parse_float(row.get('COUT SST', '0'))
                    material_cost = self.parse_float(row.get('COÛT MATERIEL', '0'))
                    intervention_cost = self.parse_float(row.get('COUT INTER', '0'))
                    
                    # Créer l'intervention
                    intervention = Intervention(
                        address=row.get('Adresse d\'intervention', 'Adresse non spécifiée'),
                        context=row.get('Contexte d\'intervention', ''),
                        status=InterventionStatusEnum.DEMANDE,  # Par défaut
                        created_date=created_date,
                        intervention_date=intervention_date,
                        sst_cost=sst_cost,
                        material_cost=material_cost,
                        intervention_cost=intervention_cost,
                        tenant_name=row.get('Locataire', ''),
                        tenant_phone=row.get('TEL LOC', ''),
                        tenant_email=row.get('Em@il Locataire', ''),
                        manager=row.get('Gest.', ''),
                        notes=row.get('COMMENTAIRE', ''),
                        priority="normale",
                        artisan_id=artisan.id if artisan else None,
                        agency_id=agency.id if agency else None
                    )
                    
                    self.db.add(intervention)
                    self.db.commit()
                    self.db.refresh(intervention)
                    
                    imported_count += 1
                    
                    if imported_count % 100 == 0:
                        print(f"✅ {imported_count} interventions importées...")
                
                except Exception as e:
                    error_count += 1
                    print(f"❌ Erreur ligne {row_num}: {str(e)}")
                    self.db.rollback()
                    continue
        
        print(f"\n🎉 Import terminé!")
        print(f"✅ {imported_count} interventions importées avec succès")
        print(f"❌ {error_count} erreurs rencontrées")
        
        # Statistiques finales
        total_interventions = self.db.query(Intervention).count()
        total_artisans = self.db.query(Artisan).count()
        total_agencies = self.db.query(Agency).count()
        
        print(f"\n📊 Statistiques finales:")
        print(f"   - Interventions: {total_interventions}")
        print(f"   - Artisans: {total_artisans}")
        print(f"   - Agences: {total_agencies}")

def main():
    print("🚀 Démarrage de l'import des données CSV...")
    
    # Créer les tables
    create_tables()
    print("✅ Tables créées")
    
    # Importer les données
    importer = CSVImporter()
    importer.import_csv_data()
    
    print("🎉 Import terminé avec succès!")

if __name__ == "__main__":
    main()

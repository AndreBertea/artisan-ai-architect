#!/usr/bin/env python3
"""
Script pour réinitialiser la base de données avec les nouveaux enums
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, create_tables
from app.models.intervention import Intervention
from app.models.artisan import Artisan
from app.models.agency import Agency
from app.models.common import Comment, Document
import pandas as pd
from datetime import datetime
import random

def reset_database():
    """Réinitialiser complètement la base de données"""
    print("🔄 Réinitialisation de la base de données...")
    
    # Supprimer toutes les tables
    from sqlalchemy import text
    
    with engine.connect() as conn:
        # Désactiver les contraintes de clés étrangères
        conn.execute(text("PRAGMA foreign_keys=OFF"))
        
        # Supprimer toutes les tables
        tables = ['interventions', 'artisans', 'agencies', 'comments', 'documents']
        for table in tables:
            try:
                conn.execute(text(f"DROP TABLE IF EXISTS {table}"))
                print(f"  ✅ Table {table} supprimée")
            except Exception as e:
                print(f"  ⚠️  Erreur lors de la suppression de {table}: {e}")
        
        # Réactiver les contraintes
        conn.execute(text("PRAGMA foreign_keys=ON"))
        conn.commit()
    
    print("✅ Base de données réinitialisée")

def reimport_csv_data():
    """Réimporter les données CSV avec les nouveaux enums"""
    print("🔄 Réimport des données CSV...")
    
    # Chemin vers le fichier CSV
    csv_path = "../sample/interventionGMBS_SUIVIINTERGMBS_2025.csv"
    
    if not os.path.exists(csv_path):
        print(f"❌ Fichier CSV non trouvé: {csv_path}")
        return
    
    # Lire le CSV
    df = pd.read_csv(csv_path)
    print(f"📊 {len(df)} interventions trouvées dans le CSV")
    
    # Créer les tables
    create_tables()
    
    # Importer les données
    from app.database import SessionLocal
    db = SessionLocal()
    
    try:
        # Extraire les agences uniques de la colonne Agence
        unique_agencies = df['Agence'].dropna().unique()
        print(f"🏢 {len(unique_agencies)} agences uniques trouvées dans le CSV")
        
        # Créer les agences à partir des données CSV
        agencies = {}
        
        for agency_name in unique_agencies:
            if pd.isna(agency_name) or agency_name == '':
                continue
                
            agency = Agency(
                name=str(agency_name).strip(),
                address='Paris',
                phone='',
                email='',
                manager='',
                status='actif',
                notes=f'Agence extraite du CSV'
            )
            
            db.add(agency)
            db.flush()  # Pour obtenir l'ID
            
            agencies[agency_name] = agency
            print(f"  ✅ Agence créée: {agency.name}")
        
        db.commit()
        print(f"✅ {len(agencies)} agences créées à partir du CSV")
        
        # Extraire les artisans uniques de la colonne SST
        unique_artisans = df['SST'].dropna().unique()
        print(f"📋 {len(unique_artisans)} artisans uniques trouvés dans le CSV")
        
        # Créer les artisans à partir des données CSV
        artisans = {}
        artisan_id_map = {}  # Pour mapper les noms vers les IDs
        
        for i, artisan_name in enumerate(unique_artisans):
            if pd.isna(artisan_name) or artisan_name == '':
                continue
                
            # Déterminer la spécialité basée sur le métier
            metier_counts = df[df['SST'] == artisan_name]['Métier'].value_counts()
            if not metier_counts.empty:
                speciality = metier_counts.index[0]  # Métier le plus fréquent
            else:
                speciality = 'Bricolage'  # Par défaut
            
            # Créer l'artisan
            artisan = Artisan(
                name=str(artisan_name).strip(),
                speciality=str(speciality).strip(),
                status='actif',
                dossier_status='en_cours',
                phone='',
                email='',
                address='Paris',
                notes=f'Artisan extrait du CSV - Métier principal: {speciality}'
            )
            
            db.add(artisan)
            db.flush()  # Pour obtenir l'ID
            
            artisans[artisan.id] = artisan
            artisan_id_map[artisan_name] = artisan.id
            
            print(f"  ✅ Artisan créé: {artisan.name} ({artisan.speciality})")
        
        db.commit()
        print(f"✅ {len(artisans)} artisans créés à partir du CSV")
        
        for artisan in artisans.values():
            db.add(artisan)
        db.commit()
        
        # Importer les interventions
        interventions_created = 0
        
        for index, row in df.iterrows():
            try:
                # Déterminer le statut avec une distribution réaliste
                status_choice = random.random()
                if status_choice < 0.3:
                    status = "demande"
                elif status_choice < 0.5:
                    status = "devis_envoye"
                elif status_choice < 0.7:
                    status = "accepte"
                elif status_choice < 0.85:
                    status = "en_cours"
                elif status_choice < 0.95:
                    status = "terminee"
                else:
                    status = random.choice(["annulee", "visite_technique", "refuse", "stand_by", "sav", "bloque"])
                
                # Déterminer l'artisan basé sur la colonne SST
                artisan_name = row.get('SST', '')
                artisan_id = None
                
                if artisan_name and str(artisan_name).strip() in artisan_id_map:
                    artisan_id = artisan_id_map[str(artisan_name).strip()]
                elif artisans:  # Fallback si l'artisan n'existe pas
                    artisan_id = random.choice(list(artisans.keys()))
                
                # Déterminer l'agence basé sur la colonne Agence
                agency_name = row.get('Agence', 'ImoDirect')
                agency_id = None
                
                if agency_name in agencies:
                    agency_id = agencies[agency_name].id
                else:
                    agency_id = list(agencies.values())[0].id  # Fallback
                
                # Créer l'intervention
                intervention = Intervention(
                    address=str(row.get('Adresse d\'intervention', 'Adresse inconnue')),
                    context=str(row.get('Contexte d\'intervention', 'Intervention')),
                    status=status,
                    created_date=datetime.now(),
                    intervention_date=datetime.now(),
                    # Mapping exact des coûts du CSV vers l'interface
                    sst_cost=float(str(row.get('COUT SST', '0')).replace(',', '.')) if row.get('COUT SST') and str(row.get('COUT SST')).strip() != '' else 0.0,
                    material_cost=float(str(row.get('COÛT MATERIEL', '0')).replace(',', '.')) if row.get('COÛT MATERIEL') and str(row.get('COÛT MATERIEL')).strip() != '' else 0.0,
                    intervention_cost=float(str(row.get('COUT INTER', '0')).replace(',', '.')) if row.get('COUT INTER') and str(row.get('COUT INTER')).strip() != '' else 0.0,
                    tenant_name=str(row.get('Locataire', 'Client')),
                    tenant_phone=str(row.get('TEL LOC', '')),
                    tenant_email=str(row.get('Em@il Locataire', '')),
                    manager=str(row.get('Agence', 'ImoDirect')),
                    notes=str(row.get('COMMENTAIRE', '')),
                    priority="normale",
                    tags="",
                    artisan_id=artisan_id,
                    agency_id=agency_id
                )
                
                db.add(intervention)
                interventions_created += 1
                
                if interventions_created % 1000 == 0:
                    print(f"  📝 {interventions_created} interventions créées...")
                    db.commit()
                    
            except Exception as e:
                print(f"  ⚠️  Erreur ligne {index}: {e}")
                continue
        
        db.commit()
        print(f"✅ {interventions_created} interventions importées avec succès")
        
    except Exception as e:
        print(f"❌ Erreur lors de l'import: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    """Fonction principale"""
    print("🚀 Réinitialisation complète de la base de données")
    print("=" * 60)
    
    # Réinitialiser la base
    reset_database()
    
    # Réimporter les données
    reimport_csv_data()
    
    print("\n" + "=" * 60)
    print("🎉 Réinitialisation terminée avec succès !")
    
    # Afficher les statistiques
    from app.database import SessionLocal
    db = SessionLocal()
    try:
        # Vérifier si les tables existent
        from sqlalchemy import text
        try:
            intervention_count = db.query(Intervention).count()
            artisan_count = db.query(Artisan).count()
            agency_count = db.query(Agency).count()
            
            print(f"\n📊 Statistiques finales :")
            print(f"  - Interventions: {intervention_count}")
            print(f"  - Artisans: {artisan_count}")
            print(f"  - Agences: {agency_count}")
        except Exception as e:
            print(f"\n⚠️  Impossible de récupérer les statistiques: {e}")
        
    finally:
        db.close()

if __name__ == "__main__":
    main()

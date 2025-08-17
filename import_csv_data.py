import csv
import os
from datetime import datetime
from sqlalchemy.orm import Session
from app.database import SessionLocal, create_tables
from app.models.intervention import Intervention
from app.models.artisan import Artisan
from app.models.agency import Agency
from app.models.user import User
from app.models.common import Comment, Document, EntityTypeEnum, InterventionStatusEnum

class CSVImporter:
    def __init__(self):
        self.db = SessionLocal()
        self.artisan_cache = {}
        self.agency_cache = {}
        self.user_cache = {}
        
        # Mapping des codes utilisateurs
        self.user_mapping = {
            'A': 'admin',
            'B': 'Badr',
            'D': 'andré',
            'T': 'Tom',
            'K': 'Killian',
            'P': 'Paul',
            'L': 'Lucien',
            'S': 'Samuel',
            'J': 'Jordan',
            'O': 'Oceane'
        }
        
        # Mapping des statuts CSV vers statuts application
        self.status_mapping = {
            'Demandé': 'demande',
            'Devis Envoyé': 'devis_envoye',
            'Accepté': 'accepte',
            'Inter en cours': 'en_cours',
            'Annulé': 'annulee',
            'Inter terminée': 'terminee',
            'Visite Technique': 'visite_technique',
            'Refusé': 'refuse',
            'STAND BY': 'stand_by',
            'SAV': 'sav',
            'Att Acompte': 'att_acompte'
        }
        
    def __del__(self):
        self.db.close()
    
    def parse_date(self, date_str):
        """Parse une date avec gestion d'erreurs"""
        if not date_str or date_str.strip() == "":
            return None
        
        try:
            # Nettoyer la chaîne (supprimer espaces, retours à la ligne, etc.)
            date_str = date_str.strip().replace('\n', '').replace('\r', '')
            
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
                    return datetime.strptime(date_str, fmt)
                except ValueError:
                    continue
            
            # Si aucun format ne fonctionne, retourner None
            print(f"⚠️  Impossible de parser la date: '{date_str}'")
            return None
        except Exception as e:
            print(f"❌ Erreur lors du parsing de la date '{date_str}': {e}")
            return None
    
    def parse_float(self, value):
        """Parse un float avec gestion d'erreurs"""
        if not value or value.strip() == "":
            return 0.0
        
        try:
            # Nettoyer la valeur
            value = value.strip()
            
            # Supprimer les guillemets non fermés et les retours à la ligne
            value = value.replace('"', '').replace('\n', '').replace('\r', '')
            
            # Supprimer les espaces
            value = value.strip()
            
            # Si c'est vide après nettoyage, retourner 0
            if not value:
                return 0.0
            
            # Remplacer les virgules par des points
            value = value.replace(",", ".")
            
            # Essayer de parser
            result = float(value)
            
            # Vérifier que c'est un nombre valide
            if result < 0:
                print(f"⚠️  Valeur négative détectée: '{value}', mise à 0")
                return 0.0
                
            return result
            
        except (ValueError, TypeError) as e:
            print(f"❌ Erreur parsing float '{value}': {e}, mise à 0")
            return 0.0
    
    def map_status(self, csv_status):
        """Mappe le statut du CSV vers le statut de l'application"""
        if not csv_status or csv_status.strip() == "":
            return InterventionStatusEnum.DEMANDE  # Statut par défaut
        
        csv_status = csv_status.strip()
        
        # Vérifier si le statut existe dans le mapping
        if csv_status in self.status_mapping:
            mapped_status = self.status_mapping[csv_status]
            try:
                return InterventionStatusEnum(mapped_status)
            except ValueError:
                print(f"⚠️  Statut mappé '{mapped_status}' non trouvé dans l'enum, utilisation du statut par défaut")
                return InterventionStatusEnum.DEMANDE
        else:
            print(f"⚠️  Statut CSV '{csv_status}' non trouvé dans le mapping, utilisation du statut par défaut")
            return InterventionStatusEnum.DEMANDE
    
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
    
    def get_or_create_user(self, user_code):
        """Récupère ou crée un utilisateur basé sur le code"""
        if not user_code or user_code.strip() == "":
            return None
        
        user_code = user_code.strip().upper()
        
        # Vérifier le cache
        if user_code in self.user_cache:
            return self.user_cache[user_code]
        
        # Chercher dans la base
        user = self.db.query(User).filter(User.code == user_code).first()
        
        if not user:
            # Vérifier si le code existe dans le mapping
            if user_code in self.user_mapping:
                user_name = self.user_mapping[user_code]
                # Créer un nouvel utilisateur
                user = User(
                    code=user_code,
                    name=user_name,
                    email=f'{user_name.lower()}@gmbs.fr',
                    phone='',
                    role='gestionnaire',
                    status='actif',
                    notes=f'Utilisateur créé à partir du CSV - Code: {user_code}'
                )
                self.db.add(user)
                self.db.commit()
                self.db.refresh(user)
            else:
                # Créer un utilisateur par défaut pour les codes inconnus
                user = User(
                    code=user_code,
                    name=f'Gestionnaire {user_code}',
                    email=f'gestionnaire{user_code.lower()}@gmbs.fr',
                    phone='',
                    role='gestionnaire',
                    status='actif',
                    notes=f'Utilisateur créé automatiquement pour le code inconnu: {user_code}'
                )
                self.db.add(user)
                self.db.commit()
                self.db.refresh(user)
        
        # Mettre en cache
        self.user_cache[user_code] = user
        return user
    
    def import_csv_data(self):
        """Importe les données du CSV"""
        csv_file = "sample/interventionGMBS_SUIVIINTERGMBS_2025.csv"
        
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
                    
                    # Récupérer un utilisateur aléatoire (puisque les codes ne sont pas dans le CSV)
                    import random
                    users = list(self.user_cache.values()) if self.user_cache else []
                    if not users:
                        # Charger tous les utilisateurs depuis la base
                        users = self.db.query(User).all()
                        for user in users:
                            self.user_cache[user.code] = user
                    user = random.choice(users) if users else None
                    
                    # Parser les dates
                    created_date = self.parse_date(row.get('Date ', ''))  # Notez l'espace après 'Date'
                    intervention_date = self.parse_date(row.get('Date d\'intervention', ''))
                    
                    # Parser les coûts
                    sst_cost = self.parse_float(row.get('COUT SST', '0'))
                    material_cost = self.parse_float(row.get('COÛT MATERIEL ', '0'))  # Notez l'espace à la fin
                    intervention_cost = self.parse_float(row.get('COUT INTER', '0'))
                    
                    # Mapper le statut du CSV
                    mapped_status = self.map_status(row.get(' Statut', ''))  # Notez l'espace avant 'Statut'
                    
                    # Créer l'intervention
                    intervention = Intervention(
                        address=row.get('Adresse d\'intervention', 'Adresse non spécifiée'),
                        context=row.get('Contexte d\'intervention', ''),
                        status=mapped_status,
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
                        agency_id=agency.id if agency else None,
                        user_id=user.id if user else None
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
    
    def generate_sql_queries(self):
        """Génère les requêtes SQL pour le frontend"""
        queries = {
            "get_all_interventions": """
-- 1. Récupérer toutes les interventions avec pagination
SELECT
    i.id, i.address as adresse, i.context as description, i.status as statut,
    i.created_date as cree, i.intervention_date as echeance,
    i.sst_cost as cout_sst, i.material_cost as cout_materiaux, i.intervention_cost as cout_interventions,
    i.tenant_name as client, i.tenant_phone as client_telephone, i.tenant_email as client_email,
    i.manager as utilisateur_assigne, a.name as artisan, ag.name as agence,
    CONCAT('INT-', LPAD(i.id, 6, '0')) as reference,
    i.created_at, i.updated_at
FROM interventions i
LEFT JOIN artisans a ON i.artisan_id = a.id
LEFT JOIN agencies ag ON i.agency_id = ag.id
ORDER BY i.created_at DESC
LIMIT ? OFFSET ?;
""",
            "get_intervention_by_id": """
-- 2. Récupérer une intervention par ID
SELECT
    i.id, i.address as adresse, i.context as description, i.status as statut,
    i.created_date as cree, i.intervention_date as echeance,
    i.sst_cost as cout_sst, i.material_cost as cout_materiaux, i.intervention_cost as cout_interventions,
    i.tenant_name as client, i.tenant_phone as client_telephone, i.tenant_email as client_email,
    i.manager as utilisateur_assigne, a.name as artisan, ag.name as agence,
    CONCAT('INT-', LPAD(i.id, 6, '0')) as reference,
    i.created_at, i.updated_at
FROM interventions i
LEFT JOIN artisans a ON i.artisan_id = a.id
LEFT JOIN agencies ag ON i.agency_id = ag.id
WHERE i.id = ?;
""",
            "get_interventions_by_status": """
-- 3. Filtrer par statut
SELECT
    i.id, i.address as adresse, i.context as description, i.status as statut,
    i.created_date as cree, i.intervention_date as echeance,
    i.sst_cost as cout_sst, i.material_cost as cout_materiaux, i.intervention_cost as cout_interventions,
    i.tenant_name as client, i.tenant_phone as client_telephone, i.tenant_email as client_email,
    i.manager as utilisateur_assigne, a.name as artisan, ag.name as agence,
    CONCAT('INT-', LPAD(i.id, 6, '0')) as reference,
    i.created_at, i.updated_at
FROM interventions i
LEFT JOIN artisans a ON i.artisan_id = a.id
LEFT JOIN agencies ag ON i.agency_id = ag.id
WHERE i.status = ?
ORDER BY i.created_at DESC;
""",
            "get_interventions_by_agency": """
-- 4. Filtrer par agence
SELECT
    i.id, i.address as adresse, i.context as description, i.status as statut,
    i.created_date as cree, i.intervention_date as echeance,
    i.sst_cost as cout_sst, i.material_cost as cout_materiaux, i.intervention_cost as cout_interventions,
    i.tenant_name as client, i.tenant_phone as client_telephone, i.tenant_email as client_email,
    i.manager as utilisateur_assigne, a.name as artisan, ag.name as agence,
    CONCAT('INT-', LPAD(i.id, 6, '0')) as reference,
    i.created_at, i.updated_at
FROM interventions i
LEFT JOIN artisans a ON i.artisan_id = a.id
LEFT JOIN agencies ag ON i.agency_id = ag.id
WHERE ag.name = ?
ORDER BY i.created_at DESC;
""",
            "get_interventions_by_artisan": """
-- 5. Filtrer par artisan
SELECT
    i.id, i.address as adresse, i.context as description, i.status as statut,
    i.created_date as cree, i.intervention_date as echeance,
    i.sst_cost as cout_sst, i.material_cost as cout_materiaux, i.intervention_cost as cout_interventions,
    i.tenant_name as client, i.tenant_phone as client_telephone, i.tenant_email as client_email,
    i.manager as utilisateur_assigne, a.name as artisan, ag.name as agence,
    CONCAT('INT-', LPAD(i.id, 6, '0')) as reference,
    i.created_at, i.updated_at
FROM interventions i
LEFT JOIN artisans a ON i.artisan_id = a.id
LEFT JOIN agencies ag ON i.agency_id = ag.id
WHERE a.name = ?
ORDER BY i.created_at DESC;
""",
            "get_overdue_interventions": """
-- 6. Interventions en retard
SELECT
    i.id, i.address as adresse, i.context as description, i.status as statut,
    i.created_date as cree, i.intervention_date as echeance,
    i.sst_cost as cout_sst, i.material_cost as cout_materiaux, i.intervention_cost as cout_interventions,
    i.tenant_name as client, i.tenant_phone as client_telephone, i.tenant_email as client_email,
    i.manager as utilisateur_assigne, a.name as artisan, ag.name as agence,
    CONCAT('INT-', LPAD(i.id, 6, '0')) as reference,
    i.created_at, i.updated_at
FROM interventions i
LEFT JOIN artisans a ON i.artisan_id = a.id
LEFT JOIN agencies ag ON i.agency_id = ag.id
WHERE i.intervention_date < DATE('now') AND i.status IN ('demande', 'en_cours')
ORDER BY i.intervention_date ASC;
""",
            "get_intervention_stats": """
-- 7. Statistiques globales
SELECT
    COUNT(*) as total_interventions,
    COUNT(CASE WHEN status = 'demande' THEN 1 END) as demandes,
    COUNT(CASE WHEN status = 'en_cours' THEN 1 END) as en_cours,
    COUNT(CASE WHEN status = 'terminee' THEN 1 END) as terminees,
    COUNT(CASE WHEN status = 'annulee' THEN 1 END) as annulees,
    SUM(sst_cost + material_cost + intervention_cost) as montant_total,
    AVG(sst_cost + material_cost + intervention_cost) as montant_moyen
FROM interventions;
""",
            "get_agency_stats": """
-- 8. Statistiques par agence
SELECT
    ag.name as agence,
    COUNT(i.id) as nombre_interventions,
    SUM(i.sst_cost + i.material_cost + i.intervention_cost) as montant_total
FROM agencies ag
LEFT JOIN interventions i ON ag.id = i.agency_id
GROUP BY ag.id, ag.name
ORDER BY nombre_interventions DESC;
""",
            "get_artisan_stats": """
-- 9. Statistiques par artisan
SELECT
    a.name as artisan,
    COUNT(i.id) as nombre_interventions,
    SUM(i.sst_cost + i.material_cost + i.intervention_cost) as montant_total
FROM artisans a
LEFT JOIN interventions i ON a.id = i.artisan_id
GROUP BY a.id, a.name
ORDER BY nombre_interventions DESC;
""",
            "search_interventions": """
-- 10. Recherche textuelle
SELECT
    i.id, i.address as adresse, i.context as description, i.status as statut,
    i.created_date as cree, i.intervention_date as echeance,
    i.sst_cost as cout_sst, i.material_cost as cout_materiaux, i.intervention_cost as cout_interventions,
    i.tenant_name as client, i.tenant_phone as client_telephone, i.tenant_email as client_email,
    i.manager as utilisateur_assigne, a.name as artisan, ag.name as agence,
    CONCAT('INT-', LPAD(i.id, 6, '0')) as reference,
    i.created_at, i.updated_at
FROM interventions i
LEFT JOIN artisans a ON i.artisan_id = a.id
LEFT JOIN agencies ag ON i.agency_id = ag.id
WHERE 
    i.address LIKE ? OR 
    i.context LIKE ? OR 
    i.tenant_name LIKE ? OR
    a.name LIKE ? OR
    ag.name LIKE ?
ORDER BY i.created_at DESC;
""",
            "get_recent_interventions": """
-- 11. Interventions récentes (7 derniers jours)
SELECT
    i.id, i.address as adresse, i.context as description, i.status as statut,
    i.created_date as cree, i.intervention_date as echeance,
    i.sst_cost as cout_sst, i.material_cost as cout_materiaux, i.intervention_cost as cout_interventions,
    i.tenant_name as client, i.tenant_phone as client_telephone, i.tenant_email as client_email,
    i.manager as utilisateur_assigne, a.name as artisan, ag.name as agence,
    CONCAT('INT-', LPAD(i.id, 6, '0')) as reference,
    i.created_at, i.updated_at
FROM interventions i
LEFT JOIN artisans a ON i.artisan_id = a.id
LEFT JOIN agencies ag ON i.agency_id = ag.id
WHERE i.created_at >= DATE('now', '-7 days')
ORDER BY i.created_at DESC;
""",
            "get_high_priority_interventions": """
-- 12. Interventions prioritaires
SELECT
    i.id, i.address as adresse, i.context as description, i.status as statut,
    i.created_date as cree, i.intervention_date as echeance,
    i.sst_cost as cout_sst, i.material_cost as cout_materiaux, i.intervention_cost as cout_interventions,
    i.tenant_name as client, i.tenant_phone as client_telephone, i.tenant_email as client_email,
    i.manager as utilisateur_assigne, a.name as artisan, ag.name as agence,
    CONCAT('INT-', LPAD(i.id, 6, '0')) as reference,
    i.created_at, i.updated_at
FROM interventions i
LEFT JOIN artisans a ON i.artisan_id = a.id
LEFT JOIN agencies ag ON i.agency_id = ag.id
WHERE i.priority IN ('haute', 'urgente')
ORDER BY i.created_at DESC;
"""
        }
        
        return queries

def main():
    print("🚀 Démarrage de l'import des données CSV...")
    
    # Créer les tables
    create_tables()
    print("✅ Tables créées")
    
    # Importer les données
    importer = CSVImporter()
    importer.import_csv_data()
    
    # Générer les requêtes SQL
    queries = importer.generate_sql_queries()
    
    # Sauvegarder les requêtes dans un fichier
    with open("frontend_queries.sql", "w", encoding="utf-8") as f:
        f.write("-- Requêtes SQL générées pour le frontend\n")
        f.write("-- Générées automatiquement après import CSV\n\n")
        
        for name, query in queries.items():
            f.write(f"-- {name}\n")
            f.write(query)
            f.write("\n")
    
    print("✅ Requêtes SQL générées dans frontend_queries.sql")
    print("🎉 Import terminé avec succès!")

if __name__ == "__main__":
    main()

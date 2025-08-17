# migration_intervention_sync.py
"""
Script de migration pour synchroniser les données existantes 
avec le nouveau système d'API unifié
"""

from sqlalchemy.orm import Session
from app.models.intervention import Intervention
from app.models.common import Comment, Document, EntityTypeEnum, InterventionStatusEnum
from app.database import SessionLocal
from datetime import datetime
import json
import logging

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class InterventionMigrationService:
    """Service de migration pour synchroniser les données existantes"""
    
    def __init__(self):
        self.db = SessionLocal()
    
    def __del__(self):
        self.db.close()
    
    def migrate_status_values(self):
        """Migrer les anciens statuts vers les nouveaux"""
        logger.info("Début de la migration des statuts...")
        
        # Mapping des anciens statuts vers les nouveaux
        status_migration_map = {
            # Si vous aviez d'anciens statuts différents
            "pending": InterventionStatusEnum.DEMANDE,
            "quote_sent": InterventionStatusEnum.DEVIS_ENVOYE,
            "accepted": InterventionStatusEnum.ACCEPTE,
            "in_progress": InterventionStatusEnum.EN_COURS,
            "cancelled": InterventionStatusEnum.ANNULE,
            "completed": InterventionStatusEnum.TERMINE,
            "technical_visit": InterventionStatusEnum.VISITE_TECHNIQUE,
            "rejected": InterventionStatusEnum.REFUSE,
            "on_hold": InterventionStatusEnum.STAND_BY,
            "after_sales": InterventionStatusEnum.SAV,
            "blocked": InterventionStatusEnum.BLOQUE,
        }
        
        try:
            interventions = self.db.query(Intervention).all()
            migrated_count = 0
            
            for intervention in interventions:
                # Vérifier si le statut actuel est dans l'ancien format
                if hasattr(intervention, 'old_status_field'):  # Adapter selon votre structure
                    old_status = getattr(intervention, 'old_status_field')
                    if old_status in status_migration_map:
                        intervention.status = status_migration_map[old_status]
                        migrated_count += 1
            
            self.db.commit()
            logger.info(f"Migration des statuts terminée. {migrated_count} interventions migrées.")
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Erreur lors de la migration des statuts: {e}")
            raise
    
    def create_missing_references(self):
        """Créer les références manquantes pour les interventions"""
        logger.info("Création des références manquantes...")
        
        try:
            interventions = self.db.query(Intervention).filter(
                Intervention.id.isnot(None)
            ).all()
            
            created_count = 0
            
            for intervention in interventions:
                # Si pas de référence existante, en créer une
                reference = f"INT-{intervention.id:06d}"
                
                # Ajouter un commentaire avec la référence si nécessaire
                existing_comment = self.db.query(Comment).filter(
                    Comment.entity_type == EntityTypeEnum.INTERVENTION,
                    Comment.entity_id == intervention.id,
                    Comment.content.contains("Référence générée")
                ).first()
                
                if not existing_comment:
                    comment = Comment(
                        entity_type=EntityTypeEnum.INTERVENTION,
                        entity_id=intervention.id,
                        content=f"Référence générée automatiquement: {reference}",
                        author="migration_system"
                    )
                    self.db.add(comment)
                    created_count += 1
            
            self.db.commit()
            logger.info(f"Références créées. {created_count} références ajoutées.")
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Erreur lors de la création des références: {e}")
            raise
    
    def sync_financial_data(self):
        """Synchroniser les données financières"""
        logger.info("Synchronisation des données financières...")
        
        try:
            interventions = self.db.query(Intervention).all()
            updated_count = 0
            
            for intervention in interventions:
                # Vérifier et corriger les valeurs nulles
                if intervention.sst_cost is None:
                    intervention.sst_cost = 0.0
                    updated_count += 1
                
                if intervention.material_cost is None:
                    intervention.material_cost = 0.0
                    updated_count += 1
                
                if intervention.intervention_cost is None:
                    intervention.intervention_cost = 0.0
                    updated_count += 1
                
                # Calculer le pourcentage SST si manquant
                if intervention.sst_percentage is None and intervention.sst_cost > 0:
                    total_cost = (intervention.sst_cost + 
                                intervention.material_cost + 
                                intervention.intervention_cost)
                    if total_cost > 0:
                        intervention.sst_percentage = (intervention.sst_cost / total_cost) * 100
                        updated_count += 1
            
            self.db.commit()
            logger.info(f"Données financières synchronisées. {updated_count} champs mis à jour.")
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Erreur lors de la synchronisation financière: {e}")
            raise
    
    def validate_data_integrity(self):
        """Valider l'intégrité des données après migration"""
        logger.info("Validation de l'intégrité des données...")
        
        try:
            # Vérifier les interventions sans artisan
            no_artisan = self.db.query(Intervention).filter(
                Intervention.artisan_id.is_(None)
            ).count()
            
            # Vérifier les interventions sans agence
            no_agency = self.db.query(Intervention).filter(
                Intervention.agency_id.is_(None)
            ).count()
            
            # Vérifier les statuts invalides
            total_interventions = self.db.query(Intervention).count()
            
            # Vérifier les dates incohérentes
            invalid_dates = self.db.query(Intervention).filter(
                Intervention.intervention_date < Intervention.created_date
            ).count()
            
            logger.info("=== RAPPORT DE VALIDATION ===")
            logger.info(f"Total interventions: {total_interventions}")
            logger.info(f"Sans artisan assigné: {no_artisan}")
            logger.info(f"Sans agence assignée: {no_agency}")
            logger.info(f"Dates incohérentes: {invalid_dates}")
            
            if invalid_dates > 0:
                logger.warning("⚠️  Des interventions ont des dates d'échéance antérieures à leur création!")
            
            return {
                "total": total_interventions,
                "no_artisan": no_artisan,
                "no_agency": no_agency,
                "invalid_dates": invalid_dates,
                "validation_passed": invalid_dates == 0
            }
            
        except Exception as e:
            logger.error(f"Erreur lors de la validation: {e}")
            raise
    
    def run_full_migration(self):
        """Exécuter la migration complète"""
        logger.info("🚀 Début de la migration complète...")
        
        try:
            # Étape 1: Migration des statuts
            self.migrate_status_values()
            
            # Étape 2: Création des références
            self.create_missing_references()
            
            # Étape 3: Synchronisation financière
            self.sync_financial_data()
            
            # Étape 4: Validation
            validation_result = self.validate_data_integrity()
            
            logger.info("✅ Migration terminée avec succès!")
            return validation_result
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de la migration: {e}")
            raise

# ============================================================================
# CONFIGURATION DE SYNCHRONISATION
# ============================================================================

# config/intervention_sync.py
"""Configuration pour la synchronisation des interventions"""

import os
from typing import Dict, Any
from dataclasses import dataclass

@dataclass
class SyncConfig:
    """Configuration pour la synchronisation"""
    
    # URLs de base
    api_base_url: str = "/api/interventions"
    frontend_base_url: str = "http://localhost:3000"
    
    # Cache
    enable_cache: bool = True
    cache_duration_minutes: int = 5
    
    # Pagination
    default_page_size: int = 10
    max_page_size: int = 100
    
    # Validation
    strict_validation: bool = True
    allow_past_dates: bool = False
    
    # Logging
    log_api_requests: bool = True
    log_level: str = "INFO"
    
    # Synchronisation
    auto_sync_interval_minutes: int = 30
    batch_size: int = 50
    
    # Mapping des champs
    field_mapping: Dict[str, str] = None
    
    def __post_init__(self):
        if self.field_mapping is None:
            self.field_mapping = {
                # Mapping entre les champs Python et TypeScript
                "tenant_name": "client",
                "tenant_phone": "client_telephone",
                "tenant_email": "client_email",
                "context": "description",
                "address": "adresse",
                "intervention_date": "echeance",
                "sst_cost": "cout_sst",
                "material_cost": "cout_materiaux",
                "intervention_cost": "cout_interventions",
                "manager": "utilisateur_assigne",
                "created_at": "created_at",
                "updated_at": "updated_at"
            }

# Configuration par environnement
def get_sync_config(environment: str = None) -> SyncConfig:
    """Obtenir la configuration selon l'environnement"""
    
    if environment is None:
        environment = os.getenv("ENVIRONMENT", "development")
    
    base_config = SyncConfig()
    
    if environment == "production":
        base_config.api_base_url = "https://api.monapp.com/api/interventions"
        base_config.frontend_base_url = "https://app.monapp.com"
        base_config.cache_duration_minutes = 10
        base_config.log_level = "WARNING"
        base_config.strict_validation = True
        
    elif environment == "staging":
        base_config.api_base_url = "https://staging-api.monapp.com/api/interventions"
        base_config.frontend_base_url = "https://staging.monapp.com"
        base_config.cache_duration_minutes = 3
        base_config.log_level = "INFO"
        
    elif environment == "development":
        base_config.api_base_url = "http://localhost:8000/api/interventions"
        base_config.frontend_base_url = "http://localhost:3000"
        base_config.cache_duration_minutes = 1
        base_config.log_level = "DEBUG"
        base_config.allow_past_dates = True
        base_config.strict_validation = False
    
    return base_config

# ============================================================================
# UTILITAIRES DE SYNCHRONISATION
# ============================================================================

class SyncUtilities:
    """Utilitaires pour la synchronisation"""
    
    @staticmethod
    def convert_python_to_typescript(data: Dict[str, Any], config: SyncConfig) -> Dict[str, Any]:
        """Convertir les données Python vers le format TypeScript"""
        
        converted = {}
        
        for python_field, value in data.items():
            # Utiliser le mapping ou garder le nom original
            ts_field = config.field_mapping.get(python_field, python_field)
            
            # Conversions spéciales
            if isinstance(value, datetime):
                converted[ts_field] = value.isoformat()
            elif value is None:
                # Ne pas inclure les valeurs nulles sauf exceptions
                if ts_field in ['notes', 'tags', 'documents', 'historique']:
                    converted[ts_field] = [] if ts_field in ['tags', 'documents', 'historique'] else ""
            else:
                converted[ts_field] = value
        
        return converted
    
    @staticmethod
    def convert_typescript_to_python(data: Dict[str, Any], config: SyncConfig) -> Dict[str, Any]:
        """Convertir les données TypeScript vers le format Python"""
        
        converted = {}
        reverse_mapping = {v: k for k, v in config.field_mapping.items()}
        
        for ts_field, value in data.items():
            # Utiliser le mapping inverse ou garder le nom original
            python_field = reverse_mapping.get(ts_field, ts_field)
            
            # Conversions spéciales
            if ts_field == 'echeance' and isinstance(value, str):
                try:
                    converted[python_field] = datetime.strptime(value, "%Y-%m-%d")
                except ValueError:
                    converted[python_field] = None
            elif ts_field in ['created_at', 'updated_at'] and isinstance(value, str):
                try:
                    converted[python_field] = datetime.fromisoformat(value.replace('Z', '+00:00'))
                except ValueError:
                    converted[python_field] = datetime.now()
            elif value == "":
                converted[python_field] = None
            elif isinstance(value, list) and len(value) == 0:
                # Les listes vides restent vides
                continue
            else:
                converted[python_field] = value
        
        return converted
    
    @staticmethod
    def validate_sync_data(data: Dict[str, Any], required_fields: list) -> Dict[str, list]:
        """Valider les données pour la synchronisation"""
        
        errors = {}
        
        # Vérifier les champs requis
        for field in required_fields:
            if field not in data or data[field] is None or data[field] == "":
                if field not in errors:
                    errors[field] = []
                errors[field].append("Ce champ est requis")
        
        # Validations spécifiques
        if 'echeance' in data and data['echeance']:
            try:
                echeance_date = datetime.strptime(data['echeance'], "%Y-%m-%d")
                if echeance_date < datetime.now().replace(hour=0, minute=0, second=0, microsecond=0):
                    if 'echeance' not in errors:
                        errors['echeance'] = []
                    errors['echeance'].append("L'échéance ne peut pas être dans le passé")
            except ValueError:
                if 'echeance' not in errors:
                    errors['echeance'] = []
                errors['echeance'].append("Format de date invalide")
        
        # Validation des montants
        for field in ['montant', 'cout_sst', 'cout_materiaux', 'cout_interventions']:
            if field in data and data[field] is not None:
                try:
                    amount = float(data[field])
                    if amount < 0:
                        if field not in errors:
                            errors[field] = []
                        errors[field].append("Le montant ne peut pas être négatif")
                except (ValueError, TypeError):
                    if field not in errors:
                        errors[field] = []
                    errors[field].append("Montant invalide")
        
        return errors

# ============================================================================
# MIDDLEWARE DE SYNCHRONISATION
# ============================================================================

from fastapi import Request, Response
from fastapi.middleware.base import BaseHTTPMiddleware
import time
import uuid

class SyncMiddleware(BaseHTTPMiddleware):
    """Middleware pour la synchronisation et le logging des requêtes"""
    
    def __init__(self, app, config: SyncConfig):
        super().__init__(app)
        self.config = config
    
    async def dispatch(self, request: Request, call_next):
        # Générer un ID unique pour la requête
        request_id = str(uuid.uuid4())[:8]
        
        # Ajouter des headers de synchronisation
        start_time = time.time()
        
        if self.config.log_api_requests:
            logger.info(f"[{request_id}] {request.method} {request.url}")
        
        # Ajouter des headers personnalisés
        response = await call_next(request)
        
        # Calculer le temps de traitement
        process_time = time.time() - start_time
        
        # Ajouter des headers de réponse
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Process-Time"] = str(process_time)
        response.headers["X-Sync-Version"] = "1.0"
        
        if self.config.log_api_requests:
            logger.info(f"[{request_id}] Completed in {process_time:.3f}s - Status: {response.status_code}")
        
        return response

# ============================================================================
# TÂCHES DE SYNCHRONISATION PÉRIODIQUE
# ============================================================================

from celery import Celery
from typing import List
import asyncio

# Configuration Celery (optionnel pour les tâches périodiques)
celery_app = Celery('intervention_sync')

class SyncTaskManager:
    """Gestionnaire des tâches de synchronisation périodique"""
    
    def __init__(self, config: SyncConfig):
        self.config = config
        self.db = SessionLocal()
    
    def __del__(self):
        self.db.close()
    
    def sync_intervention_references(self) -> Dict[str, int]:
        """Synchroniser les références d'interventions"""
        logger.info("Synchronisation des références d'interventions...")
        
        try:
            # Récupérer les interventions sans référence ou avec référence invalide
            interventions = self.db.query(Intervention).all()
            
            updated = 0
            created = 0
            
            for intervention in interventions:
                expected_ref = f"INT-{intervention.id:06d}"
                
                # Vérifier si un commentaire avec référence existe
                ref_comment = self.db.query(Comment).filter(
                    Comment.entity_type == EntityTypeEnum.INTERVENTION,
                    Comment.entity_id == intervention.id,
                    Comment.content.contains("INT-")
                ).first()
                
                if not ref_comment:
                    # Créer un commentaire avec la référence
                    comment = Comment(
                        entity_type=EntityTypeEnum.INTERVENTION,
                        entity_id=intervention.id,
                        content=f"Référence: {expected_ref}",
                        author="sync_system"
                    )
                    self.db.add(comment)
                    created += 1
                elif expected_ref not in ref_comment.content:
                    # Mettre à jour le commentaire existant
                    ref_comment.content = f"Référence: {expected_ref}"
                    updated += 1
            
            self.db.commit()
            logger.info(f"Références synchronisées: {created} créées, {updated} mises à jour")
            
            return {"created": created, "updated": updated}
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Erreur lors de la synchronisation des références: {e}")
            raise
    
    def cleanup_orphaned_data(self) -> Dict[str, int]:
        """Nettoyer les données orphelines"""
        logger.info("Nettoyage des données orphelines...")
        
        try:
            # Supprimer les commentaires sans intervention
            orphaned_comments = self.db.query(Comment).filter(
                Comment.entity_type == EntityTypeEnum.INTERVENTION,
                ~Comment.entity_id.in_(
                    self.db.query(Intervention.id).subquery()
                )
            ).count()
            
            if orphaned_comments > 0:
                self.db.query(Comment).filter(
                    Comment.entity_type == EntityTypeEnum.INTERVENTION,
                    ~Comment.entity_id.in_(
                        self.db.query(Intervention.id).subquery()
                    )
                ).delete(synchronize_session=False)
            
            # Supprimer les documents sans intervention
            orphaned_documents = self.db.query(Document).filter(
                Document.entity_type == EntityTypeEnum.INTERVENTION,
                ~Document.entity_id.in_(
                    self.db.query(Intervention.id).subquery()
                )
            ).count()
            
            if orphaned_documents > 0:
                self.db.query(Document).filter(
                    Document.entity_type == EntityTypeEnum.INTERVENTION,
                    ~Document.entity_id.in_(
                        self.db.query(Intervention.id).subquery()
                    )
                ).delete(synchronize_session=False)
            
            self.db.commit()
            logger.info(f"Données orphelines supprimées: {orphaned_comments} commentaires, {orphaned_documents} documents")
            
            return {"comments": orphaned_comments, "documents": orphaned_documents}
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Erreur lors du nettoyage: {e}")
            raise
    
    def validate_data_consistency(self) -> Dict[str, Any]:
        """Valider la consistance des données"""
        logger.info("Validation de la consistance des données...")
        
        try:
            issues = {}
            
            # Vérifier les interventions avec des dates incohérentes
            invalid_dates = self.db.query(Intervention).filter(
                Intervention.intervention_date < Intervention.created_date
            ).all()
            
            if invalid_dates:
                issues["invalid_dates"] = [
                    {
                        "id": intervention.id,
                        "created": intervention.created_date.isoformat(),
                        "intervention": intervention.intervention_date.isoformat()
                    }
                    for intervention in invalid_dates
                ]
            
            # Vérifier les montants négatifs
            negative_costs = self.db.query(Intervention).filter(
                (Intervention.sst_cost < 0) | 
                (Intervention.material_cost < 0) | 
                (Intervention.intervention_cost < 0)
            ).all()
            
            if negative_costs:
                issues["negative_costs"] = [
                    {
                        "id": intervention.id,
                        "sst_cost": intervention.sst_cost,
                        "material_cost": intervention.material_cost,
                        "intervention_cost": intervention.intervention_cost
                    }
                    for intervention in negative_costs
                ]
            
            # Vérifier les interventions sans artisan depuis trop longtemps
            from datetime import timedelta
            old_threshold = datetime.now() - timedelta(days=7)
            
            no_artisan_old = self.db.query(Intervention).filter(
                Intervention.artisan_id.is_(None),
                Intervention.created_date < old_threshold,
                Intervention.status != InterventionStatusEnum.ANNULE
            ).all()
            
            if no_artisan_old:
                issues["no_artisan_old"] = [
                    {
                        "id": intervention.id,
                        "created": intervention.created_date.isoformat(),
                        "status": intervention.status.value if intervention.status else None
                    }
                    for intervention in no_artisan_old
                ]
            
            logger.info(f"Validation terminée. {len(issues)} types d'inconsistances détectés.")
            
            return {
                "issues_count": len(issues),
                "issues": issues,
                "validation_passed": len(issues) == 0
            }
            
        except Exception as e:
            logger.error(f"Erreur lors de la validation: {e}")
            raise

# Tâche Celery périodique (si Celery est utilisé)
@celery_app.task
def run_periodic_sync():
    """Tâche périodique de synchronisation"""
    config = get_sync_config()
    sync_manager = SyncTaskManager(config)
    
    try:
        # Synchronisation des références
        ref_result = sync_manager.sync_intervention_references()
        
        # Nettoyage des données orphelines
        cleanup_result = sync_manager.cleanup_orphaned_data()
        
        # Validation
        validation_result = sync_manager.validate_data_consistency()
        
        return {
            "timestamp": datetime.now().isoformat(),
            "references": ref_result,
            "cleanup": cleanup_result,
            "validation": validation_result,
            "success": True
        }
        
    except Exception as e:
        logger.error(f"Erreur dans la tâche périodique: {e}")
        return {
            "timestamp": datetime.now().isoformat(),
            "error": str(e),
            "success": False
        }

# ============================================================================
# SCRIPT D'INITIALISATION
# ============================================================================

def initialize_sync_system():
    """Initialiser le système de synchronisation"""
    print("🚀 Initialisation du système de synchronisation...")
    
    # 1. Vérifier la configuration
    config = get_sync_config()
    print(f"✓ Configuration chargée pour l'environnement: {os.getenv('ENVIRONMENT', 'development')}")
    
    # 2. Exécuter la migration
    migration_service = InterventionMigrationService()
    validation_result = migration_service.run_full_migration()
    
    if validation_result["validation_passed"]:
        print("✅ Migration terminée avec succès!")
    else:
        print("⚠️  Migration terminée avec des avertissements.")
    
    # 3. Afficher le résumé
    print("\n" + "="*50)
    print("RÉSUMÉ DE L'INITIALISATION")
    print("="*50)
    print(f"Total interventions: {validation_result['total']}")
    print(f"Sans artisan: {validation_result['no_artisan']}")
    print(f"Sans agence: {validation_result['no_agency']}")
    print(f"Dates incohérentes: {validation_result['invalid_dates']}")
    print("="*50)
    
    # 4. Instructions pour la suite
    print("\n📋 PROCHAINES ÉTAPES:")
    print("1. Vérifiez les logs ci-dessus")
    print("2. Testez les endpoints API: " + config.api_base_url)
    print("3. Lancez le frontend sur: " + config.frontend_base_url)
    print("4. Configurez les tâches périodiques si nécessaire")
    
    return validation_result

if __name__ == "__main__":
    initialize_sync_system()
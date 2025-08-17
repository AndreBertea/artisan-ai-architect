from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import APIRouter, Depends, HTTPException, Query
from app.database import get_db, create_tables
from app.models.intervention import Intervention
from app.models.artisan import Artisan
from app.models.agency import Agency
from app.models.common import Comment, Document, InterventionStatusEnum

# Enums
class InterventionStatus(str, Enum):
    DEMANDE = "demande"
    EN_COURS = "en_cours"
    TERMINEE = "terminee"
    ANNULEE = "annulee"
    EN_ATTENTE = "en_attente"

# Modèles Pydantic
class InterventionBase(BaseModel):
    address: str
    context: Optional[str] = None
    status: InterventionStatus = InterventionStatus.DEMANDE
    created_date: Optional[datetime] = None
    intervention_date: Optional[datetime] = None
    sst_cost: float = 0.0
    material_cost: float = 0.0
    intervention_cost: float = 0.0
    tenant_name: Optional[str] = None
    tenant_phone: Optional[str] = None
    tenant_email: Optional[str] = None
    manager: Optional[str] = None
    notes: Optional[str] = None
    priority: str = "normale"
    tags: List[str] = []

class InterventionCreateRequest(InterventionBase):
    artisan_id: Optional[int] = None
    agency_id: Optional[int] = None
    cout_sst: Optional[float] = None
    cout_materiaux: Optional[float] = None
    cout_interventions: Optional[float] = None

class InterventionUpdateRequest(BaseModel):
    address: Optional[str] = None
    context: Optional[str] = None
    status: Optional[InterventionStatus] = None
    created_date: Optional[datetime] = None
    intervention_date: Optional[datetime] = None
    sst_cost: Optional[float] = None
    material_cost: Optional[float] = None
    intervention_cost: Optional[float] = None
    tenant_name: Optional[str] = None
    tenant_phone: Optional[str] = None
    tenant_email: Optional[str] = None
    manager: Optional[str] = None
    notes: Optional[str] = None
    priority: Optional[str] = None
    tags: Optional[List[str]] = None
    artisan_id: Optional[int] = None
    agency_id: Optional[int] = None
    cout_sst: Optional[float] = None
    cout_materiaux: Optional[float] = None
    cout_interventions: Optional[float] = None

class InterventionDocumentResponse(BaseModel):
    id: int
    filename: str
    file_type: str
    file_size: int
    uploaded_by: str
    created_at: datetime

class InterventionHistoryResponse(BaseModel):
    id: int
    action: str
    description: str
    user_id: str
    user_name: str
    timestamp: datetime
    changes: Optional[Dict[str, Any]] = None

class InterventionResponse(BaseModel):
    id: str
    client: str
    client_id: str
    artisan: str
    artisan_id: str
    artisan_metier: Optional[str] = None
    artisan_status: Optional[str] = None
    artisan_dossier_status: Optional[str] = None
    agence: Optional[str] = None
    utilisateur_assigne: str
    reference: str
    statut: str
    cree: str
    echeance: str
    description: str
    montant: float
    adresse: str
    notes: str
    cout_sst: float
    cout_materiaux: float
    cout_interventions: float
    priorite: str
    tags: List[str]
    documents: List[InterventionDocumentResponse]
    historique: List[InterventionHistoryResponse]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class InterventionFilters(BaseModel):
    status: Optional[InterventionStatus] = None
    artisan_id: Optional[int] = None
    agency_id: Optional[int] = None
    priority: Optional[str] = None
    search: Optional[str] = None

class InterventionSort(BaseModel):
    field: str = "created_at"
    direction: str = "desc"

class InterventionPagination(BaseModel):
    page: int = 1
    limit: int = 20

class InterventionListResponse(BaseModel):
    data: List[InterventionResponse]
    pagination: Dict[str, Any]
    filters: Dict[str, Any]
    sort: Dict[str, Any]

class InterventionStats(BaseModel):
    total: int
    par_statut: Dict[str, int]
    par_agence: Dict[str, int]
    par_artisan: Dict[str, int]
    montant_total: float

# Service de synchronisation
class InterventionSyncService:
    @staticmethod
    def intervention_to_response(intervention: Intervention, db: Session) -> InterventionResponse:
        # Récupérer l'artisan
        artisan_name = "Non assigné"
        artisan_id = ""
        artisan_status = None
        artisan_dossier_status = None
        if intervention.artisan:
            artisan_name = intervention.artisan.name
            artisan_id = str(intervention.artisan.id)
            artisan_status = intervention.artisan.status
            artisan_dossier_status = intervention.artisan.dossier_status

        # Récupérer l'agence
        agence_name = None
        if intervention.agency:
            agence_name = intervention.agency.name

        # Récupérer les documents
        documents = db.query(Document).filter(
            Document.entity_type == "intervention",
            Document.entity_id == intervention.id
        ).all()
        
        documents_response = [
            InterventionDocumentResponse(
                id=doc.id,
                filename=doc.filename,
                file_type=doc.file_type,
                file_size=doc.file_size,
                uploaded_by=doc.uploaded_by,
                created_at=doc.created_at
            ) for doc in documents
        ]

        # Récupérer l'historique
        comments = db.query(Comment).filter(
            Comment.entity_type == "intervention",
            Comment.entity_id == intervention.id
        ).order_by(Comment.created_at.desc()).all()
        
        historique_response = [
            InterventionHistoryResponse(
                id=comment.id,
                action="Commentaire ajouté",
                description=comment.content,
                user_id=comment.user_id,
                user_name=comment.user_name,
                timestamp=comment.created_at,
                changes=None
            ) for comment in comments
        ]

        # Calculer le montant total
        montant = intervention.sst_cost + intervention.material_cost + intervention.intervention_cost

        return InterventionResponse(
            id=str(intervention.id),
            client=intervention.tenant_name or "Client inconnu",
            client_id=str(intervention.id),
            artisan=artisan_name,
            artisan_id=artisan_id,
            artisan_metier=None,  # Supprimé car le modèle Profession n'existe pas
            artisan_status=artisan_status,
            artisan_dossier_status=artisan_dossier_status,
            agence=agence_name,
            utilisateur_assigne=intervention.manager or "",
            reference=f"INT-{intervention.id:06d}",
            statut=intervention.status.value,
            cree=intervention.created_date.strftime("%Y-%m-%d") if intervention.created_date else "",
            echeance=intervention.intervention_date.strftime("%Y-%m-%d") if intervention.intervention_date else "",
            description=intervention.context or "",
            montant=montant,
            adresse=intervention.address,
            notes=intervention.notes or "",
            cout_sst=intervention.sst_cost,
            cout_materiaux=intervention.material_cost,
            cout_interventions=intervention.intervention_cost,
            priorite=intervention.priority,
            tags=intervention.tags.split(",") if intervention.tags else [],
            documents=documents_response,
            historique=historique_response,
            created_at=intervention.created_at,
            updated_at=intervention.updated_at
        )

# Router FastAPI
router = APIRouter(prefix="/api/interventions", tags=["interventions"])

@router.get("/", response_model=InterventionListResponse)
async def get_interventions(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[InterventionStatus] = None,
    artisan_id: Optional[int] = None,
    agency_id: Optional[int] = None,
    search: Optional[str] = None,
    sort_field: str = Query("created_at"),
    sort_direction: str = Query("desc"),
    db: Session = Depends(get_db)
):
    query = db.query(Intervention)
    
    # Filtres
    if status:
        query = query.filter(Intervention.status == status)
    if artisan_id:
        query = query.filter(Intervention.artisan_id == artisan_id)
    if agency_id:
        query = query.filter(Intervention.agency_id == agency_id)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Intervention.address.contains(search_filter)) |
            (Intervention.context.contains(search_filter)) |
            (Intervention.tenant_name.contains(search_filter))
        )
    
    # Tri
    if sort_direction == "desc":
        query = query.order_by(getattr(Intervention, sort_field).desc())
    else:
        query = query.order_by(getattr(Intervention, sort_field).asc())
    
    # Pagination
    total = query.count()
    interventions = query.offset((page - 1) * limit).limit(limit).all()
    
    # Conversion en réponse
    data = [InterventionSyncService.intervention_to_response(intervention, db) for intervention in interventions]
    
    return InterventionListResponse(
        data=data,
        pagination={
            "page": page,
            "limit": limit,
            "total": total,
            "total_pages": (total + limit - 1) // limit
        },
        filters={
            "status": status.value if status else None,
            "artisan_id": artisan_id,
            "agency_id": agency_id,
            "search": search
        },
        sort={
            "field": sort_field,
            "direction": sort_direction
        }
    )

@router.get("/stats", response_model=InterventionStats)
async def get_intervention_stats(db: Session = Depends(get_db)):
    # Statistiques par statut
    status_stats = db.query(Intervention.status, func.count(Intervention.id)).group_by(Intervention.status).all()
    par_statut = {status.value: count for status, count in status_stats}
    
    # Statistiques par agence
    agency_stats = db.query(Agency.name, func.count(Intervention.id)).join(Intervention).group_by(Agency.name).all()
    par_agence = {name: count for name, count in agency_stats}
    
    # Statistiques par artisan
    artisan_stats = db.query(Artisan.name, func.count(Intervention.id)).join(Intervention).group_by(Artisan.name).all()
    par_artisan = {name: count for name, count in artisan_stats}
    
    # Montant total
    total_amount = db.query(func.sum(
        Intervention.sst_cost + Intervention.material_cost + Intervention.intervention_cost
    )).scalar() or 0.0
    
    return InterventionStats(
        total=db.query(Intervention).count(),
        par_statut=par_statut,
        par_agence=par_agence,
        par_artisan=par_artisan,
        montant_total=total_amount
    )

@router.get("/{intervention_id}", response_model=InterventionResponse)
async def get_intervention(intervention_id: int, db: Session = Depends(get_db)):
    intervention = db.query(Intervention).filter(Intervention.id == intervention_id).first()
    if not intervention:
        raise HTTPException(status_code=404, detail="Intervention non trouvée")
    
    return InterventionSyncService.intervention_to_response(intervention, db)

@router.post("/", response_model=InterventionResponse)
async def create_intervention(intervention: InterventionCreateRequest, db: Session = Depends(get_db)):
    db_intervention = Intervention(
        address=intervention.address,
        context=intervention.context,
        status=intervention.status,
        created_date=intervention.created_date,
        intervention_date=intervention.intervention_date,
        sst_cost=intervention.sst_cost,
        material_cost=intervention.material_cost,
        intervention_cost=intervention.intervention_cost,
        tenant_name=intervention.tenant_name,
        tenant_phone=intervention.tenant_phone,
        tenant_email=intervention.tenant_email,
        manager=intervention.manager,
        notes=intervention.notes,
        priority=intervention.priority,
        tags=",".join(intervention.tags) if intervention.tags else None,
        artisan_id=intervention.artisan_id,
        agency_id=intervention.agency_id
    )
    
    db.add(db_intervention)
    db.commit()
    db.refresh(db_intervention)
    
    # Ajouter un commentaire d'historique
    comment = Comment(
        entity_type="intervention",
        entity_id=db_intervention.id,
        content=f"Intervention créée: {intervention.context or 'Nouvelle intervention'}",
        user_id="system",
        user_name="system"
    )
    db.add(comment)
    db.commit()
    
    return InterventionSyncService.intervention_to_response(db_intervention, db)

@router.put("/{intervention_id}", response_model=InterventionResponse)
async def update_intervention(
    intervention_id: int,
    intervention: InterventionUpdateRequest,
    db: Session = Depends(get_db)
):
    db_intervention = db.query(Intervention).filter(Intervention.id == intervention_id).first()
    if not db_intervention:
        raise HTTPException(status_code=404, detail="Intervention non trouvée")
    
    # Sauvegarder les anciennes valeurs pour l'historique
    old_status = db_intervention.status
    old_context = db_intervention.context
    
    # Mettre à jour les champs
    update_data = intervention.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field in ["cout_sst", "cout_materiaux", "cout_interventions"]:
            # Ignorer ces champs car ils sont déjà mappés
            continue
        if field == "tags" and value is not None:
            setattr(db_intervention, field, ",".join(value))
        else:
            setattr(db_intervention, field, value)
    
    db.commit()
    db.refresh(db_intervention)
    
    # Ajouter un commentaire d'historique si des changements importants
    changes = []
    if old_status != db_intervention.status:
        changes.append(f"status: '{old_status.value}' → '{db_intervention.status.value}'")
    if old_context != db_intervention.context:
        changes.append(f"contexte modifié")
    
    if changes:
        comment = Comment(
            entity_type="intervention",
            entity_id=db_intervention.id,
            content=f"Intervention modifiée: {', '.join(changes)}",
            user_id="system",
            user_name="system"
        )
        db.add(comment)
        db.commit()
    
    return InterventionSyncService.intervention_to_response(db_intervention, db)

@router.delete("/{intervention_id}")
async def delete_intervention(intervention_id: int, db: Session = Depends(get_db)):
    intervention = db.query(Intervention).filter(Intervention.id == intervention_id).first()
    if not intervention:
        raise HTTPException(status_code=404, detail="Intervention non trouvée")
    
    db.delete(intervention)
    db.commit()
    
    return {"message": "Intervention supprimée avec succès"}

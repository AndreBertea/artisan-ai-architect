from sqlalchemy import Column, Integer, String, DateTime, Text, Float, ForeignKey, Enum as SQLEnum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()

class EntityTypeEnum(str, enum.Enum):
    INTERVENTION = "intervention"
    ARTISAN = "artisan"
    CLIENT = "client"
    AGENCY = "agency"

class InterventionStatusEnum(str, enum.Enum):
    DEMANDE = "demande"
    DEVIS_ENVOYE = "devis_envoye"
    ACCEPTE = "accepte"
    EN_COURS = "en_cours"
    ANNULEE = "annulee"
    TERMINEE = "terminee"
    VISITE_TECHNIQUE = "visite_technique"
    REFUSE = "refuse"
    STAND_BY = "stand_by"
    SAV = "sav"
    ATT_ACOMPTE = "att_acompte"

class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(SQLEnum(EntityTypeEnum), nullable=False)
    entity_id = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    user_id = Column(String(255), nullable=False)
    user_name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(SQLEnum(EntityTypeEnum), nullable=False)
    entity_id = Column(Integer, nullable=False)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(100), nullable=False)
    file_size = Column(Integer, nullable=False)
    uploaded_by = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

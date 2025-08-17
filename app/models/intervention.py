from sqlalchemy import Column, Integer, String, DateTime, Text, Float, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
from .common import Base, InterventionStatusEnum

class Intervention(Base):
    __tablename__ = "interventions"
    
    id = Column(Integer, primary_key=True, index=True)
    address = Column(Text, nullable=False)
    context = Column(Text, nullable=True)
    status = Column(SQLEnum(InterventionStatusEnum), default=InterventionStatusEnum.DEMANDE)
    created_date = Column(DateTime, nullable=True)
    intervention_date = Column(DateTime, nullable=True)
    sst_cost = Column(Float, default=0.0)
    material_cost = Column(Float, default=0.0)
    intervention_cost = Column(Float, default=0.0)
    tenant_name = Column(String(255), nullable=True)
    tenant_phone = Column(String(50), nullable=True)
    tenant_email = Column(String(255), nullable=True)
    manager = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    priority = Column(String(50), default="normale")
    tags = Column(Text, nullable=True)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign Keys
    artisan_id = Column(Integer, ForeignKey("artisans.id"), nullable=True)
    agency_id = Column(Integer, ForeignKey("agencies.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Gestionnaire
    
    # Relations - temporairement désactivées pour éviter les erreurs de référence circulaire
    # artisan = relationship("Artisan", lazy="joined")
    # agency = relationship("Agency", lazy="joined")

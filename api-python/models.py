from sqlalchemy import Column, Integer, String, DateTime
from database import Base
import datetime

class AtivoModel(Base):
    __tablename__ = "ativos"

    id = Column(Integer, primary_key=True, index=True)
    nome_ativo = Column(String)
    status = Column(String)
    carga_cpu = Column(Integer)
    ultima_atualizacao = Column(DateTime, default=datetime.timezone.utc)
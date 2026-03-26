from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AtivoSchema(BaseModel):
    id: Optional[int] = None
    nome_ativo: str
    status: str
    carga_cpu: int
    ultima_atualizacao: datetime

    class Config:
        from_attributes = True

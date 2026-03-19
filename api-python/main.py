from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import engine, get_db
import models
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configurar CORS para permitir que o Angular acesse a API sem problemas de bloqueio de origem cruzada (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],  
    allow_headers=["*"],  
)
class AtivoSchema(BaseModel):
    id: Optional[int] = None
    nome_ativo: str
    status: str
    carga_cpu: int
    ultima_atualizacao: datetime

    class Config:
        from_attributes = True

# --- ROTAS (ENDPOINTS) ---

@app.get("/")
def home():
    return {"message": "API de Monitoramento Online!"}

# Rota que o Angular vai consumir para obter a lista de ativos
@app.get("/ativos", response_model=List[AtivoSchema])
def listar_ativos(db: Session = Depends(get_db)):
    return db.query(models.AtivoModel).all()

# Rota que o Delphi vai alimentar os dados dos ativos
@app.post("/ativos", response_model=AtivoSchema)    
def criar_ativo(ativo: AtivoSchema, db: Session = Depends(get_db)):
    dados = ativo.model_dump(exclude={"id"})
    db_ativo = models.AtivoModel(**dados)
    db.add(db_ativo)
    db.commit()
    db.refresh(db_ativo)
    return db_ativo

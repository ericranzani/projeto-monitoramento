from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from typing import List

app = FastAPI()

# Configurar CORS para permitir que o Angular acesse a API sem problemas de bloqueio de origem cruzada (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Modelo de dados que Delphi e Angular devem seguir
class Ativo(BaseModel):
    id: int
    nome_ativo: str
    status: str
    carga_cpu: int
    ultima_atualizacao: datetime

# DB mocado para armazenar os ativos
db_ativos = [
    {
        "id": 1,
        "nome_ativo": "Servidor A",
        "status": "Online",
        "carga_cpu": 45,
        "ultima_atualizacao": datetime.now()
    }
]

# --- ROTAS (ENDPOINTS) ---

@app.get("/")
def home():
    return {"message": "API de Monitoramento Online!"}

# Rota que o Angular vai consumir para obter a lista de ativos
@app.get("/ativos", response_model=List[Ativo])
def listar_ativos():
    return db_ativos

# Rota que o Delphi vai alimentar os dados dos ativos
@app.post("/ativos")    
def atualizar_ativo(ativo: Ativo):
    # Simular a atualização ou inserção no DB
    db_ativos.append(ativo.model_dump())
    return {"status": "sucesso", "item_recebido": ativo.nome_ativo}

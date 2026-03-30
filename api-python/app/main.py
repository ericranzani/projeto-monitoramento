from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app import models
from app.routes import ativos


models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Monitoramento de Ativos API")

# Configurar CORS para permitir que o Angular acesse a API sem problemas de bloqueio de origem cruzada (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Inclui as rotas modularizadas
app.include_router(ativos.router)

@app.get("/")
def home():
    return {"status": "Online", "version": "1.0.0"}

from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
from app.database import get_db
from app import models, schemas
from app.websocket import manager

router = APIRouter(prefix="/ativos", tags=["Ativos"])

# --- ROTA DO WEBSOCKET ---
# Importante: Mantemos sem o Depends(get_db) para evitar conflitos de Runtime
@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Mantém a conexão viva escutando mensagens (ping/pong)
            await websocket.receive_text() 
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# --- ROTAS HTTP ---

@router.get("/", response_model=List[schemas.AtivoSchema])
def listar_ativos(db: Session = Depends(get_db)):
    return db.query(models.AtivoModel).all()

@router.post("/", response_model=schemas.AtivoSchema)    
async def criar_ativo(ativo: schemas.AtivoSchema, db: Session = Depends(get_db)):
    db_ativo = db.query(models.AtivoModel).filter(models.AtivoModel.nome_ativo == ativo.nome_ativo).first()
    if db_ativo:
        raise HTTPException(status_code=400, detail="Já existe um ativo com este nome.")
    
    # Lógica de Alerta
    status_final = "Alerta" if ativo.status == "Online" and (ativo.carga_cpu or 0) >= 90 else ativo.status

    novo_ativo = models.AtivoModel(
        nome_ativo=ativo.nome_ativo,
        status=status_final,
        carga_cpu=ativo.carga_cpu,
        ultima_atualizacao=datetime.now()
    )
    db.add(novo_ativo)
    db.commit()
    db.refresh(novo_ativo)
    
    # Notifica o Angular via WebSocket
    await manager.broadcast("atualizar")
    return novo_ativo

@router.put("/{ativo_id}", response_model=schemas.AtivoSchema)
async def atualizar_ativo(ativo_id: int, ativo_update: schemas.AtivoSchema, db: Session = Depends(get_db)):
    db_ativo = db.query(models.AtivoModel).filter(models.AtivoModel.id == ativo_id).first()
    if not db_ativo:
        raise HTTPException(status_code=404, detail="Ativo não encontrado")

    status_final = "Alerta" if ativo_update.status == "Online" and (ativo_update.carga_cpu or 0) >= 90 else ativo_update.status

    db_ativo.nome_ativo = ativo_update.nome_ativo
    db_ativo.status = status_final
    db_ativo.carga_cpu = ativo_update.carga_cpu
    db_ativo.ultima_atualizacao = datetime.now()
    
    db.commit()
    db.refresh(db_ativo)
    
    # Notifica o Angular via WebSocket
    await manager.broadcast("atualizar")
    return db_ativo

@router.delete("/{ativo_id}")
async def deletar_ativo(ativo_id: int, db: Session = Depends(get_db)):
    db_ativo = db.query(models.AtivoModel).filter(models.AtivoModel.id == ativo_id).first()
    if not db_ativo:
        raise HTTPException(status_code=404, detail="Ativo não encontrado")
    
    db.delete(db_ativo)
    db.commit()
    
    # Notifica o Angular via WebSocket
    await manager.broadcast("atualizar")
    return {"message": "Ativo removido"}
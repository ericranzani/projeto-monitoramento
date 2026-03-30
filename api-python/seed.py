from sqlalchemy.orm import sessionmaker
from app.database import SessionLocal, engine 
from app import models
from datetime import datetime
import random

# Garante que as tabelas existam antes de inserir dados
models.Base.metadata.create_all(bind=engine)    

def seed_db():
    db = SessionLocal()
    
    # Limpa o banco antes de inserir para não duplicar dados toda vez que rodar
    print("Limpando dados antigos...")
    db.query(models.AtivoModel).delete()
    db.commit()

    nomes = [
        "Srv-DB-Prod", "Srv-Web-01", "Srv-Web-02", "Srv-API-Gateway",
        "Srv-Redis-Cache", "Srv-Auth-Identity", "Srv-Logs-ELK", "Srv-Backup-S3",
        "Srv-Mail-SMTP", "Srv-Worker-01", "Srv-Worker-02", "Srv-Legacy-Delphi"
    ]

    status_opcoes = ["Online", "Offline"]

    print("Iniciando o processo de seed do banco de dados...")

    for nome in nomes:
        # Define uma carga de CPU aleatória
        carga = random.randint(1, 99)
        
        # Lógica de status baseada na carga (opcional, para ficar realista)
        status = random.choice(status_opcoes)
        if status == "Online" and carga >= 90: status = "Alerta"

        novo_ativo = models.AtivoModel(
            nome_ativo = nome,
            status = status,
            carga_cpu = carga,
            ultima_atualizacao = datetime.now()
        )
        db.add(novo_ativo)
    
    db.commit()
    print("Seed do banco de dados concluído com sucesso!")
    db.close()

if __name__ == "__main__":
    seed_db()
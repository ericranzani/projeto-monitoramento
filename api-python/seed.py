from sqlalchemy.orm import sessionmaker
from database import SessionLocal, engine
import models
from datetime import datetime
import random

# Create the database tables
models.Base.metadata.create_all(bind=engine)    

def seed_db():
    db = SessionLocal()
    
    nomes = [
        "Srv-DB-Prod", "Srv-Web-01", "Srv-Web-02", "Srv-API-Gateway",
        "Srv-Redis-Cache", "Srv-Auth-Identity", "Srv-Logs-ELK", "Srv-Backup-S3",
        "Srv-Mail-SMTP", "Srv-Worker-01", "Srv-Worker-02", "Srv-Legacy-Delphi"
    ]

    status_opcoes = ["Online", "Offline", "Alerta"]

    print("Iniciando o processo de seed do banco de dados...")

    for nome in nomes:
        novo_ativo = models.AtivoModel(
            nome_ativo = nome,
            status = random.choice(status_opcoes),
            carga_cpu = random.randint(1, 99),
            ultima_atualizacao = datetime.now()
        )
        db.add(novo_ativo)
    
    db.query(models.AtivoModel).delete()
    db.commit()
    print("Seed do banco de dados concluído com sucesso!")
    db.close()

if __name__ == "__main__":
    seed_db()   

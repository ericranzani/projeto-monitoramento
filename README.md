
## 🚀 Monitoramento de Ativos: Delphi + Python + Angular

Projeto "build to learn" Full-Stack focado em demonstrar a integração de tecnologias de diferentes ecossistemas (Desktop, Web e API) através de uma arquitetura baseada em micro-serviços.

## 🏗️ Arquitetura do Projeto

O fluxo de dados foi desenhado para simular um ambiente industrial ou corporativo:

📡 Ingestão (Delphi): Envio de dados de telemetria via REST/JSON.

🧠 Core (Python/FastAPI): API de alta performance com validação rigorosa de dados (Pydantic).

💻 Dashboard (Angular 18): Interface reativa utilizando Signals para monitoramento em tempo real.



## 🛠️ Tecnologias

| Camada | Tecnologia     | Status                |
| :-------- | :------- | :------------------------- |
| `Backend` | `Python 3.14/ FastAPI` | ✅ Funcional |
| `Frontend` | `Angular 18/ Signals` | ✅ Funcional |
| `Desktop` | `Delphi CE` | ✅ Funcional |



## 🎯 Roadmap de Melhorias (Build to Learn)
Como este é um projeto em desenvolvimento contínuo, as próximas etapas são:

- Persistência: Substituir a lista em memória por um banco SQLite ou PostgreSQL.

- CRUD Completo: Finalizar as funções de Delete e Update no Angular.

- UX/UI: Implementar Chart.js para visualização gráfica de uso de CPU.

- DevOps: Dockerizar a API e o Dashboard para facilitar o deploy.


## 🚀 Como rodar


```bash
API: uvicorn main:app --reload na pasta /venv.

Web: ng serve na pasta /dashboard-ativos.

Delphi: Abrir o projeto no Delphi CE e compilar (F9).
```
    
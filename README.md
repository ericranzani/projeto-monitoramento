
## 🚀 Monitoramento de Ativos: Delphi + Python + Angular

Projeto "build to learn" Full-Stack focado em demonstrar a integração de tecnologias de diferentes ecossistemas (Desktop, Web e API) através de uma arquitetura robusta e escalável.

## 🏗️ Arquitetura do Projeto

O fluxo de dados simula um ambiente industrial/corporativo de missão crítica:

* 📡 **Ingestão (Delphi):** Envio de telemetria via REST/JSON com tratamento de tipos.
* 🧠 **Core (Python/FastAPI):** API de alta performance, validação rigorosa (Pydantic) e persistência de dados.
* 🗄️ **Database (SQLite/SQLAlchemy):** Persistência relacional para histórico de ativos.
* 💻 **Dashboard (Angular 18):** Interface reativa utilizando **Signals** e **Computed State** para monitoramento em tempo real sem refresh manual.



## 🛠️ Tecnologias e Funcionalidades

| Camada | Tecnologia | Destaques Técnicos |
| :--- | :--- | :--- |
| **Backend** | `Python / FastAPI` | SQLAlchemy ORM, CORS Middleware, Pydantic Schemas. |
| **Frontend** | `Angular 18` | Signals, Computed Signals, Effects, Modern Control Flow (@for/@if). |
| **Desktop** | `Delphi CE` | TJSONObject, REST Client, ISO8601 Date Formatting. |
| **Banco** | `SQLite` | Persistência local eficiente para prototipagem rápida. |

## 🌟 Funcionalidades Implementadas

* ✅ **Real-time Polling:** O Dashboard Angular sincroniza automaticamente com a API a cada 5 segundos.
* ✅ **Sistema de Alertas Inteligente:** Notificações flutuantes (Toasts) que identificam automaticamente cargas de CPU críticas (>90%).
* ✅ **Smart UX:** Alertas que permitem fechamento manual e só reaparecem se novos incidentes forem detectados, evitando poluição visual.
* ✅ **Estilização Dinâmica:** Cards e Badges que reagem visualmente ao status (Online/Offline) e nível de carga.

## 🎯 Roadmap de Melhorias (Build to Learn)

- [ ] **Clean Architecture:** Refatoração das camadas para separação total de regras de negócio e infraestrutura.
- [ ] **Gráficos:** Implementar Chart.js para visualização histórica de uso de CPU.
- [ ] **CRUD:** Finalizar funções de edição e exclusão de ativos pela interface Web.
- [ ] **Docker:** Containerização completa do ecossistema.


## 🚀 Como rodar

1. **API:** `uvicorn main:app --reload` na pasta `/api-python`.
2. **Web:** `ng serve` na pasta `/dashboard-ativos`.
3. **Delphi:** Abrir o projeto no Delphi CE e compilar (F9).

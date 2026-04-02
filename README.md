
## 🚀 Monitoramento de Ativos: Delphi + Python + Angular (Real-Time & Dockerized)

Projeto "build to learn" Full-Stack focado em demonstrar a integração de tecnologias de diferentes ecossistemas (Desktop, Web e API) através de uma arquitetura robusta e escalável.

## 🏗️ Arquitetura do Projeto

O sistema simula um ambiente de monitoramento de missão crítica (como um Data Center ou Planta Industrial) onde a baixa latência é fundamental:

* 📡 **Ingestão (Delphi CE):** Envio de telemetria via REST/JSON com tratamento de tipos e formatação de data ISO8601.
* 🧠 **Core (Python/FastAPI):** API Assíncrona de alta performance com validação rigorosa de dados via Pydantic.
* ⚡ **Real-Time (WebSockets):** Implementação de um `ConnectionManager` no Backend para realizar o "push" de notificações instantâneas para os clientes conectados.
* 💻 **Dashboard (Angular 18+):** Interface reativa de última geração utilizando **Signals**, **Computed State** e **Chart.js** para visualização de dados sem necessidade de refresh manual.
* 🐳 **Containerização (Docker):** Todo o ecossistema Web/API isolado em containers para garantir que o projeto rode em qualquer ambiente sem conflitos de dependências.
* 🗄️ **Database (SQLite/SQLAlchemy):** Persistência relacional robusta utilizando mapeamento objeto-relacional (ORM).

## 🛠️ Tecnologias e Diferenciais Técnicos

| Camada | Tecnologia | Destaques Técnicos |
| :--- | :--- | :--- |
| **Backend** | `Python / FastAPI` | **WebSockets**, Programação Assíncrona, SQLAlchemy ORM, Pydantic Schemas. |
| **Frontend** | `Angular 18` | **Signals**, **WebSockets Nativo**, **Chart.js**, Modern Control Flow (`@if`/`@for`). |
| **Desktop** | `Delphi CE` | TJSONObject, REST Client, Ingestão de telemetria Desktop. |
| **Testes** | `Python Requests` | Scripts de automação para validação de fluxo CRUD e Regras de Negócio. |

## 🌟 Funcionalidades Implementadas

* ✅ **Real-Time Engine:** Comunicação bidirecional via **WebSockets**, eliminando o Polling e garantindo que o Dashboard reflita o banco de dados instantaneamente.
* ✅ **CRUD Web Completo:** Interface administrativa para criar, editar e excluir ativos diretamente pelo navegador.
* ✅ **Data Viz:** Gráfico de barras dinâmico que atualiza cores e valores em tempo real conforme a carga de CPU dos ativos muda.
* ✅ **Sistema de Alertas Inteligente:** Notificações reativas que identificam cargas críticas (>90%) e permitem gestão manual do alerta pelo usuário.
* ✅ **DevTools:** Inclui scripts de `seed.py` para população rápida do banco e `test_api.py` para validação de estresse e lógica da API.

## 📈 Evolução do Projeto (Roadmap Concluído)

- [x] **WebSockets:** Implementação de mensageria para atualizações em tempo real.
- [x] **Gráficos:** Integração com Chart.js para monitoramento visual de performance.
- [x] **CRUD Completo:** Gestão total de ativos via Dashboard Web.
- [x] **Estilização Reativa:** UI adaptativa que altera estados visuais baseada na telemetria.
- [x] **Docker:** Containerização completa do ecossistema para deploy facilitado.

## 🚀 Como Executar

### 1. Backend (Python)
```bash
# Entre na pasta da API
cd api-python

# Instale as dependências (requer uvicorn[standard] para WebSockets)
pip install -r requirements.txt

# Popule o banco de dados inicial
python seed.py

# Inicie o servidor
uvicorn app.main:app --reload
```

### 2. Frontend (Angular)
```bash
# Entre na pasta do Dashboard
cd dashboard-ativos

# Instale as dependências do Node
npm install

# Inicie o servidor de desenvolvimento
ng serve
```

### 3. Desktop (Delphi)
```bash
Abra o projeto .dproj no Delphi Community Edition.

Certifique-se de que a URL da API aponta para http://127.0.0.1:8000.

Compile e execute (F9).
```

### 4. Teste automatizados 
```bash
# Execute o script de teste para validar o fluxo e ver o WebSocket em ação
python test_api.py
```

### 5. Via Docker
```bash
### 1. Pré-requisitos
* Docker Desktop instalado e rodando.

### 2. Rodando o Ecossistema Web (API + Dashboard)
### Na raiz do projeto, execute:
docker-compose up --build
```
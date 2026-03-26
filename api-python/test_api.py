import requests
import json

BASE_URL = "http://127.0.0.1:8000/ativos"

def testar_fluxo_api():
    print("🚀 Iniciando Testes da API de Monitoramento...\n")

    # 1. Teste de Criação (POST)
    payload_novo = {
        "nome_ativo": "Servidor_Teste_01",
        "status": "Online",
        "carga_cpu": 45
    }
    
    print(f"--- Testando POST (Criar): {payload_novo['nome_ativo']} ---")
    response = requests.post(BASE_URL, json=payload_novo)
    
    if response.status_code == 200:
        print("✅ Sucesso: Ativo criado!")
        ativo_id = response.json()['id']
    else:
        print(f"❌ Erro ao criar: {response.text}")
        return

    # 2. Teste de Regra de Negócio (Status Alerta)
    payload_alerta = {
        "nome_ativo": "Servidor_Critico",
        "status": "Online",
        "carga_cpu": 95 # Deve virar 'Alerta' automaticamente
    }
    print(f"\n--- Testando Regra de Alerta (CPU 95%) ---")
    res_alerta = requests.post(BASE_URL, json=payload_alerta)
    if res_alerta.json()['status'] == "Alerta":
        print("✅ Sucesso: API aplicou regra de Alerta corretamente!")
    else:
        print("❌ Falha: API não mudou status para Alerta.")

    # 3. Teste de Listagem (GET)
    print("\n--- Testando GET (Listar Ativos) ---")
    res_get = requests.get(BASE_URL)
    print(f"✅ Sucesso: {len(res_get.json())} ativos encontrados no banco.")

    print("\n🏁 Testes concluídos!")

if __name__ == "__main__":
    testar_fluxo_api()
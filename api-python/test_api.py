import requests
import json

# URL base da sua API (ajuste se a porta for diferente)
BASE_URL = "http://127.0.0.1:8000/ativos"

def testar_fluxo_api():
    print("🚀 Iniciando Testes da API de Monitoramento...\n")

    # 1. Teste de Criação (POST)
    # Importante: Certifique-se que os nomes dos campos batem com o schemas.py
    payload_novo = {
        "nome_ativo": "Servidor_Teste_4",
        "status": "Online",
        "carga_cpu": 45
    }
    
    print(f"--- Testando POST (Criar): {payload_novo['nome_ativo']} ---")
    response = requests.post(f"{BASE_URL}/", json=payload_novo) # Adicionada a barra final /
    
    if response.status_code == 200:
        print("✅ Sucesso: Ativo criado!")
        # O ID vem do banco de dados agora
        ativo_id = response.json().get('id')
    elif response.status_code == 400:
        print(f"⚠️ Aviso: {response.json().get('detail')} (Pulando criação...)")
    else:
        print(f"❌ Erro ao criar: {response.status_code} - {response.text}")
        return

    # 2. Teste de Regra de Negócio (Status Alerta)
    payload_alerta = {
        "nome_ativo": f"Servidor_Critico_{json.dumps(400)}", # Nome dinâmico para evitar erro de duplicata
        "status": "Online",
        "carga_cpu": 95 
    }
    
    print(f"\n--- Testando Regra de Alerta (CPU 95%) ---")
    res_alerta = requests.post(f"{BASE_URL}/", json=payload_alerta)
    
    if res_alerta.status_code == 200:
        status_recebido = res_alerta.json()['status']
        if status_recebido == "Alerta":
            print(f"✅ Sucesso: API aplicou regra de Alerta corretamente! (Status: {status_recebido})")
        else:
            print(f"❌ Falha: API retornou status '{status_recebido}', mas esperava 'Alerta'.")
    else:
         print(f"❌ Erro na regra de negócio: {res_alerta.text}")

    # 3. Teste de Listagem (GET)
    print("\n--- Testando GET (Listar Ativos) ---")
    res_get = requests.get(f"{BASE_URL}/")
    if res_get.status_code == 200:
        print(f"✅ Sucesso: {len(res_get.json())} ativos encontrados no banco.")
    else:
        print(f"❌ Erro na listagem: {res_get.status_code}")

    print("\n🏁 Testes concluídos!")

if __name__ == "__main__":
    testar_fluxo_api()
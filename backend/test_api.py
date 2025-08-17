import requests
import json

BASE_URL = "http://localhost:8001"

def test_health():
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Health check: {response.status_code}")
        print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"Erreur health check: {e}")

def test_stats():
    try:
        response = requests.get(f"{BASE_URL}/api/interventions/stats")
        print(f"Stats: {response.status_code}")
        if response.status_code == 200:
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"Erreur: {response.text}")
    except Exception as e:
        print(f"Erreur stats: {e}")

def test_interventions():
    try:
        response = requests.get(f"{BASE_URL}/api/interventions/")
        print(f"Interventions: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Total: {data['pagination']['total']}")
        else:
            print(f"Erreur: {response.text}")
    except Exception as e:
        print(f"Erreur interventions: {e}")

if __name__ == "__main__":
    print("🧪 Test de l'API GMBS")
    print("=" * 40)
    test_health()
    print()
    test_stats()
    print()
    test_interventions()

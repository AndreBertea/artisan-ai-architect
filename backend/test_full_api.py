import requests
import json

BASE_URL = "http://localhost:8001"

def test_all_endpoints():
    print("🧪 Test complet de l'API GMBS")
    print("=" * 50)
    
    # Test 1: Health check
    print("1. Test health check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"   ✅ Status: {response.status_code}")
        print(f"   📄 Response: {response.json()}")
    except Exception as e:
        print(f"   ❌ Erreur: {e}")
    
    print()
    
    # Test 2: API interventions
    print("2. Test API interventions...")
    try:
        response = requests.get(f"{BASE_URL}/api/interventions/")
        print(f"   ✅ Status: {response.status_code}")
        data = response.json()
        print(f"   📊 Total: {data['pagination']['total']}")
        print(f"   📄 Première intervention: {data['data'][0] if data['data'] else 'Aucune'}")
    except Exception as e:
        print(f"   ❌ Erreur: {e}")
    
    print()
    
    # Test 3: API stats
    print("3. Test API stats...")
    try:
        response = requests.get(f"{BASE_URL}/api/interventions/stats")
        print(f"   ✅ Status: {response.status_code}")
        if response.status_code == 200:
            stats = response.json()
            print(f"   📊 Stats: {json.dumps(stats, indent=2)}")
        else:
            print(f"   ❌ Erreur: {response.text}")
    except Exception as e:
        print(f"   ❌ Erreur: {e}")
    
    print()
    
    # Test 4: Test CORS
    print("4. Test CORS...")
    try:
        headers = {
            'Origin': 'http://localhost:3001',
            'Content-Type': 'application/json'
        }
        response = requests.get(f"{BASE_URL}/health", headers=headers)
        print(f"   ✅ Status: {response.status_code}")
        print(f"   🌐 CORS Headers: {dict(response.headers)}")
    except Exception as e:
        print(f"   ❌ Erreur: {e}")

if __name__ == "__main__":
    test_all_endpoints()

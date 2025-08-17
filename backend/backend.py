#!/usr/bin/env python3
"""
Script de lancement du backend GMBS
Gère l'import automatique des données CSV et le démarrage du serveur
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def check_python_version():
    """Vérifie la version de Python"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ requis")
        sys.exit(1)
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} détecté")

def check_dependencies():
    """Vérifie et installe les dépendances"""
    print("🔍 Vérification des dépendances...")
    
    try:
        import fastapi
        import uvicorn
        import sqlalchemy
        import pydantic
        print("✅ Toutes les dépendances sont installées")
    except ImportError as e:
        print(f"❌ Dépendance manquante: {e}")
        print("📦 Installation des dépendances...")
        subprocess.run([sys.executable, "-m", "pip", "install", 
                       "fastapi", "uvicorn[standard]", "sqlalchemy", "pydantic", 
                       "python-multipart", "python-jose[cryptography]", 
                       "passlib[bcrypt]", "python-dotenv", "alembic"], check=True)
        print("✅ Dépendances installées")

def start_server():
    """Démarre le serveur FastAPI"""
    print("🚀 Démarrage du serveur backend...")
    print("📡 Serveur accessible sur: http://localhost:8001")
    print("📚 Documentation: http://localhost:8001/docs")
    print("🔍 Santé: http://localhost:8001/health")
    print("\n⏹️  Pour arrêter le serveur: Ctrl+C")
    print("=" * 60)
    
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "main:app", 
            "--host", "0.0.0.0", 
            "--port", "8001", 
            "--reload"
        ], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Serveur arrêté par l'utilisateur")
    except subprocess.CalledProcessError as e:
        print(f"❌ Erreur lors du démarrage du serveur: {e}")
        return False
    
    return True

def main():
    """Fonction principale"""
    print("🎯 GMBS Backend Launcher")
    print("=" * 40)
    
    # Vérifications préliminaires
    check_python_version()
    check_dependencies()
    
    # Démarrer le serveur
    start_server()

if __name__ == "__main__":
    main()

#!/bin/bash
# Script de inicialização para Railway

# Instalar dependências
pip install --no-cache-dir -r requirements.txt

# Iniciar o servidor FastAPI com Uvicorn
uvicorn server:app --host 0.0.0.0 --port ${PORT:-8000}

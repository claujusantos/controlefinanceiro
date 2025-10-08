import pytest
import asyncio
from httpx import AsyncClient
from fastapi.testclient import TestClient
from motor.motor_asyncio import AsyncIOMotorClient
import os
from app.main import app
from app.database.connection import get_database
from app.core.security import hash_senha
import uuid

# Test database configuration
TEST_MONGO_URL = os.environ.get('TEST_MONGO_URL', 'mongodb://localhost:27017')
TEST_DB_NAME = "financial_control_test"


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
async def test_db():
    """Create a test database connection"""
    client = AsyncIOMotorClient(TEST_MONGO_URL)
    db = client[TEST_DB_NAME]
    yield db
    # Clean up after test
    await client.drop_database(TEST_DB_NAME)
    client.close()


@pytest.fixture
def client():
    """Create a test client"""
    return TestClient(app)


@pytest.fixture
async def async_client():
    """Create an async test client"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac


@pytest.fixture
async def test_user(test_db):
    """Create a test user"""
    user_data = {
        "id": str(uuid.uuid4()),
        "nome": "Test User",
        "email": "test@example.com",
        "senha_hash": hash_senha("testpassword"),
        "plano": "trial",
        "status_assinatura": "active"
    }
    
    await test_db.usuarios.insert_one(user_data)
    return user_data


@pytest.fixture
async def auth_headers(test_user):
    """Create authentication headers for test user"""
    from app.core.security import criar_token
    
    token = criar_token(test_user["id"], test_user["email"])
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
async def test_categoria(test_db, test_user):
    """Create a test category"""
    categoria_data = {
        "id": str(uuid.uuid4()),
        "user_id": test_user["id"],
        "nome": "Test Category",
        "tipo": "despesa",
        "cor": "#FF0000"
    }
    
    await test_db.categorias.insert_one(categoria_data)
    return categoria_data


@pytest.fixture
async def test_receita(test_db, test_user):
    """Create a test receita"""
    receita_data = {
        "id": str(uuid.uuid4()),
        "user_id": test_user["id"],
        "data": "2024-01-15",
        "descricao": "Test Income",
        "categoria": "Salário",
        "forma_recebimento": "PIX",
        "valor": 1000.00,
        "mes": 1,
        "ano": 2024
    }
    
    await test_db.receitas.insert_one(receita_data)
    return receita_data


@pytest.fixture
async def test_despesa(test_db, test_user):
    """Create a test despesa"""
    despesa_data = {
        "id": str(uuid.uuid4()),
        "user_id": test_user["id"],
        "data": "2024-01-15",
        "descricao": "Test Expense",
        "categoria": "Alimentação",
        "forma_pagamento": "Cartão",
        "valor": 250.00,
        "mes": 1,
        "ano": 2024
    }
    
    await test_db.despesas.insert_one(despesa_data)
    return despesa_data
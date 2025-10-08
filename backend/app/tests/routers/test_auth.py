import pytest
from httpx import AsyncClient
from app.core.security import verificar_senha


class TestAuthRouter:
    """Test cases for authentication endpoints"""
    
    async def test_register_user(self, async_client: AsyncClient, test_db):
        """Test user registration"""
        user_data = {
            "nome": "New User",
            "email": "newuser@example.com",
            "senha": "password123"
        }
        
        response = await async_client.post("/api/auth/registro", json=user_data)
        assert response.status_code == 201
        
        data = response.json()
        assert "access_token" in data
        assert "token_type" in data
        assert data["token_type"] == "bearer"
        assert "usuario" in data
        assert data["usuario"]["nome"] == user_data["nome"]
        assert data["usuario"]["email"] == user_data["email"]
        
        # Verify user was created in database
        user_in_db = await test_db.usuarios.find_one({"email": user_data["email"]})
        assert user_in_db is not None
        assert user_in_db["nome"] == user_data["nome"]
        assert verificar_senha(user_data["senha"], user_in_db["senha_hash"])
    
    async def test_register_duplicate_email(self, async_client: AsyncClient, test_user):
        """Test registration with duplicate email"""
        user_data = {
            "nome": "Another User",
            "email": test_user["email"],  # Same email as test_user
            "senha": "password123"
        }
        
        response = await async_client.post("/api/auth/registro", json=user_data)
        assert response.status_code == 400
        assert "Email já cadastrado" in response.json()["detail"]
    
    async def test_login_success(self, async_client: AsyncClient, test_user):
        """Test successful login"""
        login_data = {
            "email": test_user["email"],
            "senha": "testpassword"
        }
        
        response = await async_client.post("/api/auth/login", json=login_data)
        assert response.status_code == 200
        
        data = response.json()
        assert "access_token" in data
        assert "token_type" in data
        assert data["token_type"] == "bearer"
        assert "usuario" in data
        assert data["usuario"]["email"] == test_user["email"]
    
    async def test_login_wrong_password(self, async_client: AsyncClient, test_user):
        """Test login with wrong password"""
        login_data = {
            "email": test_user["email"],
            "senha": "wrongpassword"
        }
        
        response = await async_client.post("/api/auth/login", json=login_data)
        assert response.status_code == 401
        assert "Email ou senha incorretos" in response.json()["detail"]
    
    async def test_login_nonexistent_user(self, async_client: AsyncClient):
        """Test login with non-existent user"""
        login_data = {
            "email": "nonexistent@example.com",
            "senha": "password123"
        }
        
        response = await async_client.post("/api/auth/login", json=login_data)
        assert response.status_code == 401
        assert "Email ou senha incorretos" in response.json()["detail"]
    
    async def test_get_current_user(self, async_client: AsyncClient, auth_headers, test_user):
        """Test getting current user info"""
        response = await async_client.get("/api/auth/me", headers=auth_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == test_user["id"]
        assert data["nome"] == test_user["nome"]
        assert data["email"] == test_user["email"]
        assert data["plano"] == test_user["plano"]
    
    async def test_get_current_user_unauthorized(self, async_client: AsyncClient):
        """Test getting current user without authorization"""
        response = await async_client.get("/api/auth/me")
        assert response.status_code == 403  # FastAPI returns 403 for missing auth header
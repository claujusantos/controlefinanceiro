import pytest
from httpx import AsyncClient


class TestFinancialRouter:
    """Test cases for financial endpoints"""
    
    # ========== CATEGORIAS TESTS ==========
    
    async def test_list_categorias(self, async_client: AsyncClient, auth_headers, test_categoria):
        """Test listing categorias"""
        response = await async_client.get("/api/categorias", headers=auth_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        
        # Check if test category is in the list
        categoria_names = [cat["nome"] for cat in data]
        assert test_categoria["nome"] in categoria_names
    
    async def test_create_categoria(self, async_client: AsyncClient, auth_headers, test_user):
        """Test creating a new categoria"""
        categoria_data = {
            "nome": "New Category",
            "tipo": "receita",
            "cor": "#00FF00"
        }
        
        response = await async_client.post("/api/categorias", json=categoria_data, headers=auth_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert data["nome"] == categoria_data["nome"]
        assert data["tipo"] == categoria_data["tipo"]
        assert data["cor"] == categoria_data["cor"]
        assert data["user_id"] == test_user["id"]
        assert "id" in data
    
    async def test_update_categoria(self, async_client: AsyncClient, auth_headers, test_categoria):
        """Test updating a categoria"""
        update_data = {
            "nome": "Updated Category",
            "tipo": "receita",
            "cor": "#0000FF"
        }
        
        response = await async_client.put(
            f"/api/categorias/{test_categoria['id']}", 
            json=update_data, 
            headers=auth_headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["nome"] == update_data["nome"]
        assert data["tipo"] == update_data["tipo"]
        assert data["cor"] == update_data["cor"]
        assert data["id"] == test_categoria["id"]
    
    async def test_delete_categoria(self, async_client: AsyncClient, auth_headers, test_categoria):
        """Test deleting a categoria"""
        response = await async_client.delete(
            f"/api/categorias/{test_categoria['id']}", 
            headers=auth_headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "message" in data
        assert "deletada com sucesso" in data["message"]
    
    # ========== RECEITAS TESTS ==========
    
    async def test_list_receitas(self, async_client: AsyncClient, auth_headers, test_receita):
        """Test listing receitas"""
        response = await async_client.get("/api/receitas", headers=auth_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        
        # Check if test receita is in the list
        receita_descriptions = [rec["descricao"] for rec in data]
        assert test_receita["descricao"] in receita_descriptions
    
    async def test_create_receita(self, async_client: AsyncClient, auth_headers, test_user):
        """Test creating a new receita"""
        receita_data = {
            "data": "2024-02-15",
            "descricao": "New Income",
            "categoria": "Freelance",
            "forma_recebimento": "Transferência",
            "valor": 1500.00
        }
        
        response = await async_client.post("/api/receitas", json=receita_data, headers=auth_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert data["descricao"] == receita_data["descricao"]
        assert data["valor"] == receita_data["valor"]
        assert data["user_id"] == test_user["id"]
        assert data["mes"] == 2  # February
        assert data["ano"] == 2024
        assert "id" in data
    
    async def test_update_receita(self, async_client: AsyncClient, auth_headers, test_receita):
        """Test updating a receita"""
        update_data = {
            "data": "2024-01-20",
            "descricao": "Updated Income",
            "categoria": "Investimentos",
            "forma_recebimento": "PIX",
            "valor": 2000.00
        }
        
        response = await async_client.put(
            f"/api/receitas/{test_receita['id']}", 
            json=update_data, 
            headers=auth_headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["descricao"] == update_data["descricao"]
        assert data["valor"] == update_data["valor"]
        assert data["id"] == test_receita["id"]
    
    async def test_delete_receita(self, async_client: AsyncClient, auth_headers, test_receita):
        """Test deleting a receita"""
        response = await async_client.delete(
            f"/api/receitas/{test_receita['id']}", 
            headers=auth_headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "message" in data
        assert "deletada com sucesso" in data["message"]
    
    # ========== DESPESAS TESTS ==========
    
    async def test_list_despesas(self, async_client: AsyncClient, auth_headers, test_despesa):
        """Test listing despesas"""
        response = await async_client.get("/api/despesas", headers=auth_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        
        # Check if test despesa is in the list
        despesa_descriptions = [desp["descricao"] for desp in data]
        assert test_despesa["descricao"] in despesa_descriptions
    
    async def test_create_despesa(self, async_client: AsyncClient, auth_headers, test_user):
        """Test creating a new despesa"""
        despesa_data = {
            "data": "2024-02-15",
            "descricao": "New Expense",
            "categoria": "Transporte",
            "forma_pagamento": "Débito",
            "valor": 150.00
        }
        
        response = await async_client.post("/api/despesas", json=despesa_data, headers=auth_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert data["descricao"] == despesa_data["descricao"]
        assert data["valor"] == despesa_data["valor"]
        assert data["user_id"] == test_user["id"]
        assert data["mes"] == 2  # February
        assert data["ano"] == 2024
        assert "id" in data
    
    async def test_unauthorized_access(self, async_client: AsyncClient):
        """Test that endpoints require authentication"""
        # Test categorias endpoint without auth
        response = await async_client.get("/api/categorias")
        assert response.status_code == 403
        
        # Test receitas endpoint without auth
        response = await async_client.get("/api/receitas")
        assert response.status_code == 403
        
        # Test despesas endpoint without auth
        response = await async_client.get("/api/despesas")
        assert response.status_code == 403
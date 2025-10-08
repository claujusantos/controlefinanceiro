import pytest
from app.services.dashboard_service import DashboardService
from app.models.financial import ResumoMensal


class TestDashboardService:
    """Test cases for DashboardService"""
    
    @pytest.fixture
    async def dashboard_service(self, test_db):
        """Create a dashboard service instance with test database"""
        service = DashboardService()
        # Override the database connection for testing
        service.db = test_db
        return service
    
    @pytest.fixture
    async def sample_data(self, test_db, test_user):
        """Create sample financial data for testing"""
        # Create sample receitas
        receitas = [
            {
                "id": "rec1", "user_id": test_user["id"], "data": "2024-01-15",
                "valor": 1000.0, "mes": 1, "ano": 2024, "categoria": "Salário"
            },
            {
                "id": "rec2", "user_id": test_user["id"], "data": "2024-02-15",
                "valor": 1200.0, "mes": 2, "ano": 2024, "categoria": "Freelance"
            }
        ]
        
        # Create sample despesas
        despesas = [
            {
                "id": "desp1", "user_id": test_user["id"], "data": "2024-01-10",
                "valor": 300.0, "mes": 1, "ano": 2024, "categoria": "Alimentação", "descricao": "supermercado"
            },
            {
                "id": "desp2", "user_id": test_user["id"], "data": "2024-01-20",
                "valor": 200.0, "mes": 1, "ano": 2024, "categoria": "Transporte", "descricao": "combustível"
            },
            {
                "id": "desp3", "user_id": test_user["id"], "data": "2024-02-10",
                "valor": 250.0, "mes": 2, "ano": 2024, "categoria": "Alimentação", "descricao": "supermercado"
            }
        ]
        
        await test_db.receitas.insert_many(receitas)
        await test_db.despesas.insert_many(despesas)
        
        return {"receitas": receitas, "despesas": despesas}
    
    async def test_get_dashboard_data_all_time(self, dashboard_service, test_user, sample_data):
        """Test getting dashboard data for all time"""
        result = await dashboard_service.get_dashboard_data(test_user["id"])
        
        assert result["total_receitas"] == 2200.0  # 1000 + 1200
        assert result["total_despesas"] == 750.0   # 300 + 200 + 250
        assert result["saldo"] == 1450.0           # 2200 - 750
        assert result["percentual_economia"] == 65.91  # (1450/2200)*100, rounded
        assert result["lucro_prejuizo"] == "lucro"
        
        # Check categories distribution
        categorias_dist = result["categorias_distribuicao"]
        assert len(categorias_dist) == 2
        
        # Find Alimentação and Transporte categories
        alimentacao = next((cat for cat in categorias_dist if cat["categoria"] == "Alimentação"), None)
        transporte = next((cat for cat in categorias_dist if cat["categoria"] == "Transporte"), None)
        
        assert alimentacao is not None
        assert alimentacao["valor"] == 550.0  # 300 + 250
        assert transporte is not None
        assert transporte["valor"] == 200.0
        
        # Check monthly evolution
        evolucao = result["evolucao_mensal"]
        assert len(evolucao) == 2
        
        # January data
        jan_data = next((month for month in evolucao if month["mes"] == 1), None)
        assert jan_data is not None
        assert jan_data["receitas"] == 1000.0
        assert jan_data["despesas"] == 500.0  # 300 + 200
        assert jan_data["saldo"] == 500.0
        
        # February data
        fev_data = next((month for month in evolucao if month["mes"] == 2), None)
        assert fev_data is not None
        assert fev_data["receitas"] == 1200.0
        assert fev_data["despesas"] == 250.0
        assert fev_data["saldo"] == 950.0
    
    async def test_get_dashboard_data_ultimo_mes(self, dashboard_service, test_user, sample_data):
        """Test getting dashboard data for last month (filtering)"""
        # This test would need to mock datetime.now() to return a specific date
        # For now, we'll test the basic functionality without date filtering
        result = await dashboard_service.get_dashboard_data(test_user["id"], "total")
        assert result["total_receitas"] > 0
        assert result["total_despesas"] > 0
    
    async def test_get_gastos_recorrentes(self, dashboard_service, test_user, sample_data):
        """Test getting recurring expenses analysis"""
        result = await dashboard_service.get_gastos_recorrentes(test_user["id"])
        
        # Check categories frequency
        categorias_freq = result["categorias_mais_frequentes"]
        assert len(categorias_freq) >= 1
        
        # Alimentação should be the most frequent (2 occurrences)
        alimentacao_freq = next((cat for cat in categorias_freq if cat["categoria"] == "Alimentação"), None)
        assert alimentacao_freq is not None
        assert alimentacao_freq["ocorrencias"] == 2
        assert alimentacao_freq["valor_total"] == 550.0
        assert alimentacao_freq["valor_medio"] == 275.0
        
        # Check recurring descriptions
        desc_recorrentes = result["descricoes_recorrentes"]
        supermercado = next((desc for desc in desc_recorrentes if "supermercado" in desc["descricao"].lower()), None)
        assert supermercado is not None
        assert supermercado["ocorrencias"] == 2
        assert supermercado["valor_total"] == 550.0
        
        # Check average spending per category
        media_por_cat = result["media_por_categoria"]
        assert len(media_por_cat) >= 1
    
    async def test_get_resumo_mensal(self, dashboard_service, test_user, sample_data):
        """Test getting monthly summary"""
        result = await dashboard_service.get_resumo_mensal(test_user["id"])
        
        assert isinstance(result, list)
        assert len(result) == 2  # January and February
        
        # Check January summary
        jan_resumo = next((resumo for resumo in result if resumo.mes == 1), None)
        assert jan_resumo is not None
        assert isinstance(jan_resumo, ResumoMensal)
        assert jan_resumo.total_receitas == 1000.0
        assert jan_resumo.total_despesas == 500.0
        assert jan_resumo.saldo == 500.0
        assert jan_resumo.lucro_prejuizo == "lucro"
        
        # Check February summary
        fev_resumo = next((resumo for resumo in result if resumo.mes == 2), None)
        assert fev_resumo is not None
        assert fev_resumo.total_receitas == 1200.0
        assert fev_resumo.total_despesas == 250.0
        assert fev_resumo.saldo == 950.0
        assert fev_resumo.lucro_prejuizo == "lucro"
    
    async def test_get_projecoes(self, dashboard_service, test_user, sample_data):
        """Test getting financial projections"""
        result = await dashboard_service.get_projecoes(test_user["id"])
        
        # Should have calculated averages from the last months
        assert result["media_receitas"] > 0
        assert result["media_despesas"] > 0
        assert "saldo_projetado" in result
        assert "tendencia" in result
        assert result["tendencia"] in ["crescimento", "declinio", "neutro"]
        
        # Should have 6-month projection
        projecao_6_meses = result["projecao_6_meses"]
        assert len(projecao_6_meses) == 6
        
        for i, mes_proj in enumerate(projecao_6_meses):
            assert mes_proj["mes"] == i + 1
            assert "receita_estimada" in mes_proj
            assert "despesa_estimada" in mes_proj
            assert "saldo_estimado" in mes_proj
    
    async def test_empty_data_scenarios(self, dashboard_service, test_user):
        """Test service behavior with no financial data"""
        # Test dashboard with no data
        dashboard_result = await dashboard_service.get_dashboard_data(test_user["id"])
        assert dashboard_result["total_receitas"] == 0
        assert dashboard_result["total_despesas"] == 0
        assert dashboard_result["saldo"] == 0
        
        # Test gastos recorrentes with no data
        gastos_result = await dashboard_service.get_gastos_recorrentes(test_user["id"])
        assert gastos_result["categorias_mais_frequentes"] == []
        assert gastos_result["descricoes_recorrentes"] == []
        assert gastos_result["media_por_categoria"] == []
        
        # Test projecoes with no data
        proj_result = await dashboard_service.get_projecoes(test_user["id"])
        assert proj_result["media_receitas"] == 0
        assert proj_result["media_despesas"] == 0
        assert proj_result["saldo_projetado"] == 0
        assert proj_result["tendencia"] == "neutro"
        assert len(proj_result["projecao_6_meses"]) == 6
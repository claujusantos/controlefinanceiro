from fastapi import APIRouter, Depends
from typing import Optional, List

# MUDANÇA 1: Importar a CLASSE AuthService e o MODELO Usuario
from app.core.security import AuthService
from app.models.user import Usuario
from app.services.dashboard_service import DashboardService
from app.models.financial import ResumoMensal

router = APIRouter(tags=["dashboard"])

auth_service = AuthService()


@router.get("/dashboard")
async def obter_dashboard(
    usuario: Usuario = Depends(auth_service.get_current_user),
    periodo: Optional[str] = None,
    data_inicio: Optional[str] = None,
    data_fim: Optional[str] = None,
):
    """Retorna dados agregados para o dashboard com filtros de data"""
    dashboard_service = DashboardService()
    return await dashboard_service.get_dashboard_data(
        usuario.id, periodo, data_inicio, data_fim
    )


@router.get("/gastos-recorrentes")
async def obter_gastos_recorrentes(
    usuario: Usuario = Depends(auth_service.get_current_user),
):
    """Retorna análise de gastos recorrentes e frequentes"""
    dashboard_service = DashboardService()
    return await dashboard_service.get_gastos_recorrentes(usuario.id)


@router.get("/resumo-mensal", response_model=List[ResumoMensal])
async def obter_resumo_mensal(
    usuario: Usuario = Depends(auth_service.get_current_user),
):
    """Retorna resumo de todos os meses"""
    dashboard_service = DashboardService()
    return await dashboard_service.get_resumo_mensal(usuario.id)


@router.get("/projecoes")
async def obter_projecoes(usuario: Usuario = Depends(auth_service.get_current_user)):
    """Calcula projeções financeiras baseadas nas médias"""
    dashboard_service = DashboardService()
    return await dashboard_service.get_projecoes(usuario.id)
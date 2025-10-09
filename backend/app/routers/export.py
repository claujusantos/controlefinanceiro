from fastapi import APIRouter, Depends

from app.core.security import AuthService
from app.models.user import Usuario  
from app.services.excel_service import ExcelService

router = APIRouter(prefix="/export", tags=["export"])

auth_service = AuthService()

@router.get("/export-excel")
async def exportar_excel(
    usuario: Usuario = Depends(auth_service.get_current_user)
):
    """Gera arquivo Excel com todas as abas e fórmulas"""
    excel_service = ExcelService()
    return await excel_service.export_excel(usuario.id)
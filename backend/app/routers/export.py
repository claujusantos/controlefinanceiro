from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.services.excel_service import ExcelService

router = APIRouter(tags=["export"])


@router.get("/export-excel")
async def exportar_excel(usuario: dict = Depends(get_current_user)):
    """Gera arquivo Excel com todas as abas e fórmulas"""
    excel_service = ExcelService()
    return await excel_service.export_excel(usuario["id"])
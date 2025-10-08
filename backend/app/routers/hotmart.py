from fastapi import APIRouter
from app.services.hotmart_service import HotmartService

router = APIRouter(prefix="/webhook", tags=["webhooks"])


@router.post("/hotmart")
async def webhook_hotmart(request: dict):
    """Recebe notificações da Hotmart"""
    hotmart_service = HotmartService()
    return await hotmart_service.process_webhook(request)
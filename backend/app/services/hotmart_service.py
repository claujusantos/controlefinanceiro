from datetime import datetime, timedelta
from typing import Dict
import uuid
import logging
from app.database.connection import get_database


class HotmartService:
    """Service for Hotmart webhook processing"""
    
    def __init__(self):
        self.db = get_database()
    
    async def process_webhook(self, request: dict) -> Dict:
        """
        Processa webhooks da Hotmart
        
        Eventos importantes:
        - PURCHASE_COMPLETE: Compra aprovada
        - PURCHASE_CANCELED: Compra cancelada
        - PURCHASE_REFUNDED: Compra reembolsada
        - SUBSCRIPTION_CANCELLATION: Assinatura cancelada
        """
        try:
            event = request.get("event")
            data = request.get("data", {})
            
            buyer_email = data.get("buyer", {}).get("email")
            transaction_code = data.get("purchase", {}).get("transaction")
            subscriber_code = data.get("subscription", {}).get("subscriber_code")
            product_id = data.get("product", {}).get("id")
            
            # Identificar o plano baseado no product_id da Hotmart
            plano_map = {
                # Você vai preencher com os IDs reais dos seus produtos na Hotmart
                "PRODUCT_ID_MENSAL": "mensal",
                "PRODUCT_ID_SEMESTRAL": "semestral",
                "PRODUCT_ID_ANUAL": "anual"
            }
            
            plano = plano_map.get(str(product_id), "mensal")
            
            # Buscar usuário pelo email
            usuario = await self.db.usuarios.find_one({"email": buyer_email})
            
            if event == "PURCHASE_COMPLETE":
                await self._process_purchase_complete(
                    usuario, buyer_email, plano, subscriber_code, 
                    transaction_code, data
                )
            
            elif event in ["PURCHASE_CANCELED", "PURCHASE_REFUNDED", "SUBSCRIPTION_CANCELLATION"]:
                await self._process_cancellation(usuario, buyer_email)
            
            return {"status": "success", "message": "Webhook processed"}
        
        except Exception as e:
            logging.error(f"Erro no webhook Hotmart: {e}")
            return {"status": "error", "message": str(e)}
    
    async def _process_purchase_complete(
        self, usuario, buyer_email, plano, subscriber_code, 
        transaction_code, data
    ):
        """Processa compra aprovada"""
        if usuario:
            # Calcular data de expiração
            if plano == "anual":
                data_expiracao = datetime.utcnow() + timedelta(days=365)
            else:
                data_expiracao = datetime.utcnow() + timedelta(days=30)
            
            # Atualizar usuário
            await self.db.usuarios.update_one(
                {"email": buyer_email},
                {"$set": {
                    "plano": plano,
                    "status_assinatura": "active",
                    "data_expiracao": data_expiracao,
                    "hotmart_subscriber_code": subscriber_code
                }}
            )
            
            # Criar registro de assinatura
            assinatura = {
                "id": str(uuid.uuid4()),
                "user_id": usuario["id"],
                "plano": plano,
                "status": "active",
                "data_inicio": datetime.utcnow(),
                "data_fim": data_expiracao,
                "valor": data.get("purchase", {}).get("price", {}).get("value", 0),
                "hotmart_transaction": transaction_code,
                "hotmart_subscriber_code": subscriber_code
            }
            await self.db.assinaturas.insert_one(assinatura)
    
    async def _process_cancellation(self, usuario, buyer_email):
        """Processa cancelamento de assinatura"""
        if usuario:
            await self.db.usuarios.update_one(
                {"email": buyer_email},
                {"$set": {
                    "status_assinatura": "canceled",
                    "plano": "trial"
                }}
            )
            
            await self.db.assinaturas.update_many(
                {"user_id": usuario["id"], "status": "active"},
                {"$set": {"status": "canceled"}}
            )
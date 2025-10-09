from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional
from datetime import datetime, timezone
import uuid
from enum import Enum

# Importando os validadores que você definiu no seu core
from app.core.validators import PasswordValidator, validate_name

# --- Enumerações ---

class TipoPlano(str, Enum):
    MENSAL = "mensal"
    SEMESTRAL = "semestral"
    ANUAL = "anual"

class StatusAssinatura(str, Enum):
    ACTIVE = "active"
    CANCELED = "canceled"
    EXPIRED = "expired"

# --- Modelos ---

class Usuario(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nome: str
    email: EmailStr  # CORREÇÃO: Usando EmailStr para consistência
    senha_hash: str
    data_criacao: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    # CORREÇÃO: O plano é opcional, default=None, para se adequar à sua Enum.
    plano: Optional[TipoPlano] = None
    status_assinatura: StatusAssinatura = Field(default=StatusAssinatura.ACTIVE)
    data_expiracao: Optional[datetime] = None
    hotmart_subscriber_code: Optional[str] = None

class UsuarioCreate(BaseModel):
    nome: str
    email: EmailStr
    senha: str
    
    # Validador para o campo 'nome' agora está ativo
    @field_validator('nome')
    @classmethod
    def validar_nome_de_usuario(cls, v: str) -> str:
        is_valid, error_message = validate_name(v)
        if not is_valid:
            raise ValueError(error_message)
        return v.strip()
    
    # Validador para o campo 'senha' agora está ativo
    @field_validator('senha')
    @classmethod
    def validar_senha_de_usuario(cls, v: str) -> str:
        is_valid, errors = PasswordValidator.validate_password(v)
        if not is_valid:
            # Junta todos os erros em uma única mensagem para o usuário final
            raise ValueError(f"Senha inválida: {'; '.join(errors)}")
        return v

class UsuarioLogin(BaseModel):
    email: EmailStr
    senha: str

class Token(BaseModel):
    access_token: str
    token_type: str
    usuario: dict

class Assinatura(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    plano: TipoPlano 
    status: StatusAssinatura
    data_inicio: datetime
    data_fim: Optional[datetime] = None
    valor: float
    hotmart_transaction: Optional[str] = None
    hotmart_subscriber_code: Optional[str] = None
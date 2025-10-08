from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional
from datetime import datetime
import uuid
from app.core.validators import PasswordValidator, validate_name


class Usuario(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nome: str
    email: EmailStr
    senha_hash: str
    data_criacao: datetime = Field(default_factory=datetime.utcnow)
    plano: str = "trial"  # trial, basico, pro, anual
    status_assinatura: str = "active"  # active, canceled, expired
    data_expiracao: Optional[datetime] = None
    hotmart_subscriber_code: Optional[str] = None


class UsuarioCreate(BaseModel):
    nome: str
    email: EmailStr
    senha: str
    
    @validator('nome')
    def validate_nome(cls, v):
        is_valid, error_message = validate_name(v)
        if not is_valid:
            raise ValueError(error_message)
        return v.strip()
    
    @validator('senha')
    def validate_senha(cls, v):
        is_valid, errors = PasswordValidator.validate_password(v)
        if not is_valid:
            raise ValueError(f"Senha não atende aos critérios de segurança: {'; '.join(errors)}")
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
    plano: str  # basico, pro, anual
    status: str  # active, canceled, expired
    data_inicio: datetime
    data_fim: Optional[datetime] = None
    valor: float
    hotmart_transaction: Optional[str] = None
    hotmart_subscriber_code: Optional[str] = None
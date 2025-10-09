from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import List
import uuid

from app.models.user import Usuario, UsuarioCreate, UsuarioLogin, Token
from app.models.financial import Categoria, TipoCategoria 

from app.core.security import AuthService 
from app.core.validators import PasswordValidator
from app.database.connection import get_database

router = APIRouter(prefix="/auth", tags=["auth"])

auth_service = AuthService()

class SenhaPayload(BaseModel):
    senha: str

@router.post("/registro", response_model=Token, status_code=status.HTTP_201_CREATED)
async def registrar_usuario(input_data: UsuarioCreate):
    """Registra novo usuário"""
    db = get_database()
    
    usuario_existente = await db.usuarios.find_one({"email": input_data.email})
    if usuario_existente:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    usuario_para_salvar = input_data.model_dump()
    usuario_para_salvar["senha_hash"] = auth_service.hash_senha(usuario_para_salvar.pop("senha"))
    
    usuario_obj = Usuario(**usuario_para_salvar)
    
    await db.usuarios.insert_one(usuario_obj.model_dump())
    
    categorias_padrao = [
        {"id": str(uuid.uuid4()), "user_id": usuario_obj.id, "nome": "Salário", "tipo": TipoCategoria.RECEITA.value, "cor": "#10B981"},
        {"id": str(uuid.uuid4()), "user_id": usuario_obj.id, "nome": "Alimentação", "tipo": TipoCategoria.DESPESA.value, "cor": "#EF4444"},
    ]

    if categorias_padrao:
        await db.categorias.insert_many(categorias_padrao)
    
    token = auth_service.criar_token(usuario_obj.id, usuario_obj.email)
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario": {
            "id": usuario_obj.id,
            "nome": usuario_obj.nome,
            "email": usuario_obj.email
        }
    }


@router.post("/login", response_model=Token)
async def login_usuario(input_data: UsuarioLogin):
    """Faz login do usuário"""
    db = get_database()
    
    usuario = await db.usuarios.find_one({"email": input_data.email})
    if not usuario or not auth_service.verificar_senha(input_data.senha, usuario["senha_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos"
        )
    
    token = auth_service.criar_token(usuario["id"], usuario["email"])
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario": {
            "id": usuario["id"],
            "nome": usuario["nome"],
            "email": usuario["email"]
        }
    }


@router.get("/me", response_model=Usuario) 
async def obter_usuario_atual(usuario: Usuario = Depends(auth_service.get_current_user)):
    """Retorna dados do usuário logado"""
    return usuario


@router.post("/validar-senha")
async def validar_senha(payload: SenhaPayload): 
    """Valida força da senha"""
    senha = payload.senha
    
    is_valid, errors = PasswordValidator.validate_password(senha)
    strength = PasswordValidator.get_password_strength(senha)
    
    return {
        "is_valid": is_valid, "errors": errors, "strength": strength,
        "criteria": {
            "min_length": len(senha) >= 6,
            "has_uppercase": any(c.isupper() for c in senha),
            "has_lowercase": any(c.islower() for c in senha),
            "has_special": any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in senha),
            "no_spaces": " " not in senha
        }
    }
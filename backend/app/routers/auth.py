from fastapi import APIRouter, HTTPException, Depends, status
from app.models.user import Usuario, UsuarioCreate, UsuarioLogin, Token
from app.core.security import hash_senha, verificar_senha, criar_token, get_current_user
from app.core.validators import PasswordValidator
from app.database.connection import get_database
import uuid

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/registro", response_model=Token, status_code=status.HTTP_201_CREATED)
async def registrar_usuario(input: UsuarioCreate):
    """Registra novo usuário"""
    db = get_database()
    
    # Verificar se email já existe
    usuario_existente = await db.usuarios.find_one({"email": input.email})
    if usuario_existente:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    # Criar usuário
    usuario_dict = input.dict()
    usuario_dict["senha_hash"] = hash_senha(usuario_dict.pop("senha"))
    usuario_obj = Usuario(**usuario_dict)
    
    await db.usuarios.insert_one(usuario_obj.dict())
    
    # Criar categorias padrão para o novo usuário
    categorias_padrao = [
        {"id": str(uuid.uuid4()), "user_id": usuario_obj.id, "nome": "Salário", "tipo": "receita", "cor": "#10B981"},
        {"id": str(uuid.uuid4()), "user_id": usuario_obj.id, "nome": "Freelance", "tipo": "receita", "cor": "#34D399"},
        {"id": str(uuid.uuid4()), "user_id": usuario_obj.id, "nome": "Investimentos", "tipo": "receita", "cor": "#6EE7B7"},
        {"id": str(uuid.uuid4()), "user_id": usuario_obj.id, "nome": "Alimentação", "tipo": "despesa", "cor": "#EF4444"},
        {"id": str(uuid.uuid4()), "user_id": usuario_obj.id, "nome": "Transporte", "tipo": "despesa", "cor": "#F87171"},
        {"id": str(uuid.uuid4()), "user_id": usuario_obj.id, "nome": "Moradia", "tipo": "despesa", "cor": "#FCA5A5"},
        {"id": str(uuid.uuid4()), "user_id": usuario_obj.id, "nome": "Lazer", "tipo": "despesa", "cor": "#FCD34D"},
        {"id": str(uuid.uuid4()), "user_id": usuario_obj.id, "nome": "Saúde", "tipo": "despesa", "cor": "#FB923C"},
        {"id": str(uuid.uuid4()), "user_id": usuario_obj.id, "nome": "Educação", "tipo": "despesa", "cor": "#A78BFA"},
    ]
    await db.categorias.insert_many(categorias_padrao)
    
    # Criar token
    token = criar_token(usuario_obj.id, usuario_obj.email)
    
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
async def login_usuario(input: UsuarioLogin):
    """Faz login do usuário"""
    db = get_database()
    
    # Buscar usuário
    usuario = await db.usuarios.find_one({"email": input.email})
    if not usuario:
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
    
    # Verificar senha
    if not verificar_senha(input.senha, usuario["senha_hash"]):
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
    
    # Criar token
    token = criar_token(usuario["id"], usuario["email"])
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario": {
            "id": usuario["id"],
            "nome": usuario["nome"],
            "email": usuario["email"]
        }
    }


@router.get("/me")
async def obter_usuario_atual(usuario: dict = Depends(get_current_user)):
    """Retorna dados do usuário logado"""
    return {
        "id": usuario["id"],
        "nome": usuario["nome"],
        "email": usuario["email"],
        "plano": usuario.get("plano", "trial"),
        "status_assinatura": usuario.get("status_assinatura", "active"),
        "data_expiracao": usuario.get("data_expiracao")
    }
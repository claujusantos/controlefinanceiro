from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from app.models.financial import (
    Categoria, CategoriaCreate,
    Receita, ReceitaCreate,
    Despesa, DespesaCreate
)
from app.core.security import get_current_user
from app.core.utils import extrair_mes_ano
from app.database.connection import get_database

router = APIRouter(tags=["financial"])


# ========== CATEGORIAS ENDPOINTS ==========

@router.get("/categorias", response_model=List[Categoria])
async def listar_categorias(usuario: dict = Depends(get_current_user)):
    """Lista todas as categorias do usuário"""
    db = get_database()
    categorias = await db.categorias.find({"user_id": usuario["id"]}).to_list(1000)
    return [Categoria(**cat) for cat in categorias]


@router.post("/categorias", response_model=Categoria)
async def criar_categoria(input: CategoriaCreate, usuario: dict = Depends(get_current_user)):
    """Cria uma nova categoria"""
    db = get_database()
    cat_dict = input.dict()
    cat_dict["user_id"] = usuario["id"]
    cat_obj = Categoria(**cat_dict)
    await db.categorias.insert_one(cat_obj.dict())
    return cat_obj


@router.put("/categorias/{cat_id}", response_model=Categoria)
async def atualizar_categoria(cat_id: str, input: CategoriaCreate, usuario: dict = Depends(get_current_user)):
    """Atualiza uma categoria existente"""
    db = get_database()
    cat_dict = input.dict()
    cat_dict["id"] = cat_id
    cat_dict["user_id"] = usuario["id"]
    cat_obj = Categoria(**cat_dict)
    result = await db.categorias.update_one(
        {"id": cat_id, "user_id": usuario["id"]}, 
        {"$set": cat_obj.dict()}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    return cat_obj


@router.delete("/categorias/{cat_id}")
async def deletar_categoria(cat_id: str, usuario: dict = Depends(get_current_user)):
    """Deleta uma categoria"""
    db = get_database()
    result = await db.categorias.delete_one({"id": cat_id, "user_id": usuario["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    return {"message": "Categoria deletada com sucesso"}


# ========== RECEITAS ENDPOINTS ==========

@router.get("/receitas", response_model=List[Receita])
async def listar_receitas(mes: Optional[int] = None, ano: Optional[int] = None, usuario: dict = Depends(get_current_user)):
    """Lista receitas do usuário, opcionalmente filtradas por mês e ano"""
    db = get_database()
    filtro = {"user_id": usuario["id"]}
    if mes:
        filtro["mes"] = mes
    if ano:
        filtro["ano"] = ano
    receitas = await db.receitas.find(filtro).to_list(1000)
    return [Receita(**rec) for rec in receitas]


@router.post("/receitas", response_model=Receita)
async def criar_receita(input: ReceitaCreate, usuario: dict = Depends(get_current_user)):
    """Cria uma nova receita"""
    db = get_database()
    rec_dict = input.dict()
    mes, ano = extrair_mes_ano(rec_dict["data"])
    rec_dict["mes"] = mes
    rec_dict["ano"] = ano
    rec_dict["user_id"] = usuario["id"]
    rec_obj = Receita(**rec_dict)
    await db.receitas.insert_one(rec_obj.dict())
    return rec_obj


@router.put("/receitas/{rec_id}", response_model=Receita)
async def atualizar_receita(rec_id: str, input: ReceitaCreate, usuario: dict = Depends(get_current_user)):
    """Atualiza uma receita existente"""
    db = get_database()
    rec_dict = input.dict()
    mes, ano = extrair_mes_ano(rec_dict["data"])
    rec_dict["mes"] = mes
    rec_dict["ano"] = ano
    rec_dict["id"] = rec_id
    rec_dict["user_id"] = usuario["id"]
    rec_obj = Receita(**rec_dict)
    result = await db.receitas.update_one({"id": rec_id, "user_id": usuario["id"]}, {"$set": rec_obj.dict()})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Receita não encontrada")
    return rec_obj


@router.delete("/receitas/{rec_id}")
async def deletar_receita(rec_id: str, usuario: dict = Depends(get_current_user)):
    """Deleta uma receita"""
    db = get_database()
    result = await db.receitas.delete_one({"id": rec_id, "user_id": usuario["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Receita não encontrada")
    return {"message": "Receita deletada com sucesso"}


# ========== DESPESAS ENDPOINTS ==========

@router.get("/despesas", response_model=List[Despesa])
async def listar_despesas(mes: Optional[int] = None, ano: Optional[int] = None, usuario: dict = Depends(get_current_user)):
    """Lista despesas do usuário, opcionalmente filtradas por mês e ano"""
    db = get_database()
    filtro = {"user_id": usuario["id"]}
    if mes:
        filtro["mes"] = mes
    if ano:
        filtro["ano"] = ano
    despesas = await db.despesas.find(filtro).to_list(1000)
    return [Despesa(**desp) for desp in despesas]


@router.post("/despesas", response_model=Despesa)
async def criar_despesa(input: DespesaCreate, usuario: dict = Depends(get_current_user)):
    """Cria uma nova despesa"""
    db = get_database()
    desp_dict = input.dict()
    mes, ano = extrair_mes_ano(desp_dict["data"])
    desp_dict["mes"] = mes
    desp_dict["ano"] = ano
    desp_dict["user_id"] = usuario["id"]
    desp_obj = Despesa(**desp_dict)
    await db.despesas.insert_one(desp_obj.dict())
    return desp_obj


@router.put("/despesas/{desp_id}", response_model=Despesa)
async def atualizar_despesa(desp_id: str, input: DespesaCreate, usuario: dict = Depends(get_current_user)):
    """Atualiza uma despesa existente"""
    db = get_database()
    desp_dict = input.dict()
    mes, ano = extrair_mes_ano(desp_dict["data"])
    desp_dict["mes"] = mes
    desp_dict["ano"] = ano
    desp_dict["id"] = desp_id
    desp_dict["user_id"] = usuario["id"]
    desp_obj = Despesa(**desp_dict)
    result = await db.despesas.update_one({"id": desp_id, "user_id": usuario["id"]}, {"$set": desp_obj.dict()})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Despesa não encontrada")
    return desp_obj


@router.delete("/despesas/{desp_id}")
async def deletar_despesa(desp_id: str, usuario: dict = Depends(get_current_user)):
    """Deleta uma despesa"""
    db = get_database()
    result = await db.despesas.delete_one({"id": desp_id, "user_id": usuario["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Despesa não encontrada")
    return {"message": "Despesa deletada com sucesso"}
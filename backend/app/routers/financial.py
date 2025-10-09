from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional

from app.core.security import AuthService
from app.models.user import Usuario

from app.models.financial import (
    Categoria, CategoriaCreate,
    Receita, ReceitaCreate,
    Despesa, DespesaCreate
)
from app.database.connection import get_database

router = APIRouter(tags=["financial"])

auth_service = AuthService()

# ========== CATEGORIAS ENDPOINTS ==========

@router.get("/categorias", response_model=List[Categoria])
async def listar_categorias(usuario: Usuario = Depends(auth_service.get_current_user)):
    """Lista todas as categorias do usuário"""
    db = get_database()
    categorias = await db.categorias.find({"user_id": usuario.id}).to_list(1000)
    return categorias

@router.post("/categorias", response_model=Categoria, status_code=status.HTTP_201_CREATED)
async def criar_categoria(input_data: CategoriaCreate, usuario: Usuario = Depends(auth_service.get_current_user)):
    """Cria uma nova categoria"""
    db = get_database()
    cat_dict = input_data.model_dump()
    cat_dict["user_id"] = usuario.id
    
    cat_obj = Categoria(**cat_dict)
    await db.categorias.insert_one(cat_obj.model_dump())
    return cat_obj

@router.put("/categorias/{cat_id}", response_model=Categoria)
async def atualizar_categoria(cat_id: str, input_data: CategoriaCreate, usuario: Usuario = Depends(auth_service.get_current_user)):
    """Atualiza uma categoria existente"""
    db = get_database()
    update_data = input_data.model_dump(exclude_unset=True)
    
    result = await db.categorias.update_one(
        {"id": cat_id, "user_id": usuario.id}, 
        {"$set": update_data}
    )
    if result.modified_count == 0:
        if await db.categorias.count_documents({"id": cat_id, "user_id": usuario.id}) == 0:
            raise HTTPException(status_code=404, detail="Categoria não encontrada")
        
    updated_cat = await db.categorias.find_one({"id": cat_id, "user_id": usuario.id})
    if not updated_cat:
        raise HTTPException(status_code=404, detail="Categoria não encontrada após atualização")
    return updated_cat

@router.delete("/categorias/{cat_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deletar_categoria(cat_id: str, usuario: Usuario = Depends(auth_service.get_current_user)):
    """Deleta uma categoria"""
    db = get_database()
    result = await db.categorias.delete_one({"id": cat_id, "user_id": usuario.id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    return

# ========== RECEITAS ENDPOINTS ==========

@router.get("/receitas", response_model=List[Receita])
async def listar_receitas(mes: Optional[int] = None, ano: Optional[int] = None, usuario: Usuario = Depends(auth_service.get_current_user)):
    """Lista receitas do usuário, opcionalmente filtradas por mês e ano"""
    db = get_database()
    filtro = {"user_id": usuario.id}
    if mes: filtro["mes"] = mes
    if ano: filtro["ano"] = ano
    receitas = await db.receitas.find(filtro).to_list(1000)
    return receitas

@router.post("/receitas", response_model=Receita, status_code=status.HTTP_201_CREATED)
async def criar_receita(input_data: ReceitaCreate, usuario: Usuario = Depends(auth_service.get_current_user)):
    """Cria uma nova receita"""
    db = get_database()
    rec_dict = input_data.model_dump()
    rec_dict["user_id"] = usuario.id
    rec_dict["mes"] = input_data.data.month
    rec_dict["ano"] = input_data.data.year
    
    rec_obj = Receita(**rec_dict)
    await db.receitas.insert_one(rec_obj.model_dump())
    return rec_obj

@router.put("/receitas/{rec_id}", response_model=Receita)
async def atualizar_receita(rec_id: str, input_data: ReceitaCreate, usuario: Usuario = Depends(auth_service.get_current_user)):
    """Atualiza uma receita existente"""
    db = get_database()
    update_data = input_data.model_dump(exclude_unset=True)
    
    result = await db.receitas.update_one(
        {"id": rec_id, "user_id": usuario.id}, 
        {"$set": update_data}
    )
    if result.modified_count == 0:
        if await db.receitas.count_documents({"id": rec_id, "user_id": usuario.id}) == 0:
            raise HTTPException(status_code=404, detail="Receita não encontrada")
    
    updated_rec = await db.receitas.find_one({"id": rec_id, "user_id": usuario.id})
    if not updated_rec:
        raise HTTPException(status_code=404, detail="Receita não encontrada após atualização")
    return updated_rec

@router.delete("/receitas/{rec_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deletar_receita(rec_id: str, usuario: Usuario = Depends(auth_service.get_current_user)):
    """Deleta uma receita"""
    db = get_database()
    result = await db.receitas.delete_one({"id": rec_id, "user_id": usuario.id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Receita não encontrada")
    return

# ========== DESPESAS ENDPOINTS ==========

@router.get("/despesas", response_model=List[Despesa])
async def listar_despesas(mes: Optional[int] = None, ano: Optional[int] = None, usuario: Usuario = Depends(auth_service.get_current_user)):
    """Lista despesas do usuário, opcionalmente filtradas por mês e ano"""
    db = get_database()
    filtro = {"user_id": usuario.id}
    if mes: filtro["mes"] = mes
    if ano: filtro["ano"] = ano
    despesas = await db.despesas.find(filtro).to_list(1000)
    return despesas

@router.post("/despesas", response_model=Despesa, status_code=status.HTTP_201_CREATED)
async def criar_despesa(input_data: DespesaCreate, usuario: Usuario = Depends(auth_service.get_current_user)):
    """Cria uma nova despesa"""
    db = get_database()
    desp_dict = input_data.model_dump()
    desp_dict["user_id"] = usuario.id
    
    desp_obj = Despesa(**desp_dict)
    await db.despesas.insert_one(desp_obj.model_dump())
    return desp_obj

@router.put("/despesas/{desp_id}", response_model=Despesa)
async def atualizar_despesa(desp_id: str, input_data: DespesaCreate, usuario: Usuario = Depends(auth_service.get_current_user)):
    """Atualiza uma despesa existente"""
    db = get_database()
    update_data = input_data.model_dump(exclude_unset=True)
    
    result = await db.despesas.update_one(
        {"id": desp_id, "user_id": usuario.id},
        {"$set": update_data}
    )
    if result.modified_count == 0:
        if await db.despesas.count_documents({"id": desp_id, "user_id": usuario.id}) == 0:
            raise HTTPException(status_code=404, detail="Despesa não encontrada")
    
    updated_desp = await db.despesas.find_one({"id": desp_id, "user_id": usuario.id})
    if not updated_desp:
        raise HTTPException(status_code=404, detail="Despesa não encontrada após atualização")
    return updated_desp

@router.delete("/despesas/{desp_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deletar_despesa(desp_id: str, usuario: Usuario = Depends(auth_service.get_current_user)):
    """Deleta uma despesa"""
    db = get_database()
    result = await db.despesas.delete_one({"id": desp_id, "user_id": usuario.id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Despesa não encontrada")
    return
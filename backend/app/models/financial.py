from pydantic import BaseModel, Field
import uuid


class Categoria(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    nome: str
    tipo: str  # "receita" ou "despesa"
    cor: str = "#3B82F6"


class CategoriaCreate(BaseModel):
    nome: str
    tipo: str
    cor: str = "#3B82F6"


class Receita(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    data: str  # formato: YYYY-MM-DD
    descricao: str
    categoria: str
    forma_recebimento: str
    valor: float
    mes: int
    ano: int


class ReceitaCreate(BaseModel):
    data: str
    descricao: str
    categoria: str
    forma_recebimento: str
    valor: float


class Despesa(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    data: str
    descricao: str
    categoria: str
    forma_pagamento: str
    valor: float
    mes: int
    ano: int


class DespesaCreate(BaseModel):
    data: str
    descricao: str
    categoria: str
    forma_pagamento: str
    valor: float


class ResumoMensal(BaseModel):
    mes: int
    ano: int
    total_receitas: float
    total_despesas: float
    saldo: float
    percentual_economia: float
    lucro_prejuizo: str  # "lucro" ou "prejuizo"
from pydantic import BaseModel, Field, model_validator
from datetime import datetime
import uuid
from enum import Enum

# --- Enumerações ---

class TipoCategoria(str, Enum):
    RECEITA = "receita"
    DESPESA = "despesa"

class StatusSaldo(str, Enum):
    LUCRO = "lucro"
    PREJUIZO = "prejuizo"

class FormaPagamento(str, Enum):
    PIX = "PIX"
    CARTAO_CREDITO = "Cartão de Crédito"
    CARTAO_DEBITO = "Cartão de Débito"
    DINHEIRO = "Dinheiro"
    TRANSFERENCIA = "Transferência Bancária"
    BOLETO = "Boleto"

class FormaRecebimento(str, Enum):
    PIX = "PIX"
    SALARIO = "Salário"
    DINHEIRO = "Dinheiro"
    TRANSFERENCIA = "Transferência Bancária"
    VENDAS = "Vendas"

# --- Modelos ---

class Categoria(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    nome: str
    tipo: TipoCategoria
    cor: str = "#3B82F6"

class CategoriaCreate(BaseModel):
    nome: str
    tipo: TipoCategoria
    cor: str = "#3B82F6"

class Receita(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    data: datetime
    descricao: str
    categoria: str
    forma_recebimento: FormaRecebimento
    valor: float
    mes: int
    ano: int

class ReceitaCreate(BaseModel):
    data: datetime
    descricao: str
    categoria: str
    forma_recebimento: FormaRecebimento
    valor: float

    @model_validator(mode='before')
    def extrair_mes_e_ano_da_data(cls, data):
        if 'data' in data and isinstance(data['data'], datetime):
            data['mes'] = data['data'].month
            data['ano'] = data['data'].year
        return data

class Despesa(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    data: datetime
    descricao: str
    categoria: str
    forma_pagamento: FormaPagamento
    valor: float
    mes: int
    ano: int

class DespesaCreate(BaseModel):
    data: datetime
    descricao: str
    categoria: str
    forma_pagamento: FormaPagamento
    valor: float

    @model_validator(mode='before')
    def extrair_mes_e_ano_da_data(cls, data):
        if 'data' in data and isinstance(data['data'], datetime):
            data['mes'] = data['data'].month
            data['ano'] = data['data'].year
        return data

class ResumoMensal(BaseModel):
    mes: int
    ano: int
    total_receitas: float
    total_despesas: float
    saldo: float
    percentual_economia: float
    lucro_prejuizo: StatusSaldo
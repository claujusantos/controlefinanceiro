"""
Testes simples para validar cobertura dos módulos principais
"""
import pytest
from app.core.validators import PasswordValidator, validate_email, validate_name
from app.core.security import hash_senha, verificar_senha
from app.core.utils import extrair_mes_ano
from app.models.user import Usuario, UsuarioCreate
from app.models.financial import Categoria, Receita, Despesa


def test_password_validator():
    """Testa validador de senhas"""
    # Senha fraca
    is_valid, errors = PasswordValidator.validate_password("123")
    assert not is_valid
    assert len(errors) > 0
    
    # Senha forte
    is_valid, errors = PasswordValidator.validate_password("MinhaSenh@123")
    assert is_valid
    assert len(errors) == 0
    
    # Força da senha
    assert PasswordValidator.get_password_strength("123") == "weak"
    assert PasswordValidator.get_password_strength("MinhaSenh@123") == "strong"


def test_email_validator():
    """Testa validador de email"""
    is_valid, error = validate_email("test@example.com")
    assert is_valid
    assert error == ""
    
    is_valid, error = validate_email("invalid-email")
    assert not is_valid
    assert error != ""


def test_name_validator():
    """Testa validador de nome"""
    is_valid, error = validate_name("João Silva")
    assert is_valid
    assert error == ""
    
    is_valid, error = validate_name("")
    assert not is_valid
    assert error != ""


def test_security_functions():
    """Testa funções de segurança"""
    senha = "MinhaSenh@123"
    hash_result = hash_senha(senha)
    assert hash_result != senha
    assert verificar_senha(senha, hash_result)
    assert not verificar_senha("senha_errada", hash_result)


def test_utils():
    """Testa funções utilitárias"""
    mes, ano = extrair_mes_ano("2024-03-15")
    assert mes == 3
    assert ano == 2024
    
    mes, ano = extrair_mes_ano("invalid-date")
    assert mes == 1
    assert ano == 2025


def test_user_models():
    """Testa modelos de usuário"""
    usuario = Usuario(
        nome="João Silva",
        email="joao@example.com",
        senha_hash="hash_example"
    )
    assert usuario.nome == "João Silva"
    assert usuario.plano == "trial"
    assert usuario.status_assinatura == "active"


def test_financial_models():
    """Testa modelos financeiros"""
    categoria = Categoria(
        user_id="user123",
        nome="Alimentação",
        tipo="despesa"
    )
    assert categoria.nome == "Alimentação"
    assert categoria.cor == "#3B82F6"
    
    receita = Receita(
        user_id="user123",
        data="2024-03-15",
        descricao="Salário",
        categoria="Trabalho",
        forma_recebimento="PIX",
        valor=5000.0,
        mes=3,
        ano=2024
    )
    assert receita.valor == 5000.0
    assert receita.mes == 3
    
    despesa = Despesa(
        user_id="user123",
        data="2024-03-15",
        descricao="Supermercado",
        categoria="Alimentação",
        forma_pagamento="Cartão",
        valor=250.0,
        mes=3,
        ano=2024
    )
    assert despesa.valor == 250.0
    assert despesa.mes == 3


def test_usuario_create_validation():
    """Testa validação do modelo UsuarioCreate"""
    # Nome válido
    usuario_data = {
        "nome": "João Silva",
        "email": "joao@example.com",
        "senha": "MinhaSenh@123"
    }
    usuario = UsuarioCreate(**usuario_data)
    assert usuario.nome == "João Silva"
    
    # Senha inválida deve dar erro
    with pytest.raises(ValueError):
        UsuarioCreate(
            nome="João Silva",
            email="joao@example.com",
            senha="123"  # Senha muito fraca
        )


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
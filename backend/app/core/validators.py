import re
from typing import List


class PasswordValidator:
    """Validador de senhas seguras"""
    
    @staticmethod
    def validate_password(password: str) -> tuple[bool, List[str]]:
        """
        Valida se a senha atende aos critérios de segurança
        
        Critérios:
        - Mínimo 6 caracteres
        - Pelo menos 1 letra maiúscula
        - Pelo menos 1 letra minúscula
        - Pelo menos 1 caractere especial (!@#$%^&*()_+-=[]{}|;:,.<>?)
        
        Returns:
            tuple: (is_valid: bool, errors: List[str])
        """
        errors = []
        
        # Verificar comprimento mínimo
        if len(password) < 6:
            errors.append("A senha deve ter pelo menos 6 caracteres")
        
        # Verificar se tem pelo menos uma letra maiúscula
        if not re.search(r'[A-Z]', password):
            errors.append("A senha deve conter pelo menos uma letra maiúscula")
        
        # Verificar se tem pelo menos uma letra minúscula
        if not re.search(r'[a-z]', password):
            errors.append("A senha deve conter pelo menos uma letra minúscula")
        
        # Verificar se tem pelo menos um caractere especial
        if not re.search(r'[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]', password):
            errors.append("A senha deve conter pelo menos um caractere especial (!@#$%^&*()_+-=[]{}|;:,.<>?)")
        
        # Verificar se não contém espaços
        if ' ' in password:
            errors.append("A senha não pode conter espaços em branco")
        
        is_valid = len(errors) == 0
        return is_valid, errors
    
    @staticmethod
    def get_password_strength(password: str) -> str:
        """
        Retorna a força da senha
        
        Returns:
            str: "weak", "medium", "strong"
        """
        if len(password) < 6:
            return "weak"
        
        score = 0
        
        # Critérios básicos
        if re.search(r'[A-Z]', password):
            score += 1
        if re.search(r'[a-z]', password):
            score += 1
        if re.search(r'[0-9]', password):
            score += 1
        if re.search(r'[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]', password):
            score += 1
        
        # Critérios avançados
        if len(password) >= 8:
            score += 1
        if len(password) >= 12:
            score += 1
        
        if score >= 5:
            return "strong"
        elif score >= 3:
            return "medium"
        else:
            return "weak"


def validate_email(email: str) -> tuple[bool, str]:
    """
    Valida formato de email
    
    Returns:
        tuple: (is_valid: bool, error_message: str)
    """
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    if not email:
        return False, "Email é obrigatório"
    
    if not re.match(email_pattern, email):
        return False, "Formato de email inválido"
    
    if len(email) > 254:
        return False, "Email muito longo"
    
    return True, ""


def validate_name(name: str) -> tuple[bool, str]:
    """
    Valida nome do usuário
    
    Returns:
        tuple: (is_valid: bool, error_message: str)
    """
    if not name or not name.strip():
        return False, "Nome é obrigatório"
    
    if len(name.strip()) < 2:
        return False, "Nome deve ter pelo menos 2 caracteres"
    
    if len(name.strip()) > 100:
        return False, "Nome muito longo (máximo 100 caracteres)"
    
    # Verificar se contém apenas letras, espaços, acentos e hífens
    if not re.match(r'^[a-zA-ZàáâãäåæçèéêëìíîïñòóôõöøùúûüýÿÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÑÒÓÔÕÖØÙÚÛÜÝŸ\s\-\']+$', name):
        return False, "Nome deve conter apenas letras, espaços, acentos e hífens"
    
    return True, ""
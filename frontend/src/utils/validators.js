/**
 * Validadores de formulário para o frontend
 */

export const PasswordValidator = {
  /**
   * Valida se a senha atende aos critérios de segurança
   * @param {string} password 
   * @returns {object} {isValid: boolean, errors: string[], strength: string}
   */
  validatePassword: (password) => {
    const errors = [];
    
    // Verificar comprimento mínimo
    if (password.length < 6) {
      errors.push("A senha deve ter pelo menos 6 caracteres");
    }
    
    // Verificar se tem pelo menos uma letra maiúscula
    if (!/[A-Z]/.test(password)) {
      errors.push("A senha deve conter pelo menos uma letra maiúscula");
    }
    
    // Verificar se tem pelo menos uma letra minúscula
    if (!/[a-z]/.test(password)) {
      errors.push("A senha deve conter pelo menos uma letra minúscula");
    }
    
    // Verificar se tem pelo menos um caractere especial
    if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
      errors.push("A senha deve conter pelo menos um caractere especial (!@#$%^&*()_+-=[]{}|;:,.<>?)");
    }
    
    // Verificar se não contém espaços
    if (/\s/.test(password)) {
      errors.push("A senha não pode conter espaços em branco");
    }
    
    const isValid = errors.length === 0;
    const strength = PasswordValidator.getPasswordStrength(password);
    
    return {
      isValid,
      errors,
      strength,
      criteria: {
        minLength: password.length >= 6,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasSpecial: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password),
        noSpaces: !/\s/.test(password)
      }
    };
  },

  /**
   * Retorna a força da senha
   * @param {string} password 
   * @returns {string} "weak", "medium", "strong"
   */
  getPasswordStrength: (password) => {
    if (password.length < 6) {
      return "weak";
    }
    
    let score = 0;
    
    // Critérios básicos
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) score += 1;
    
    // Critérios avançados
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    if (score >= 5) return "strong";
    if (score >= 3) return "medium";
    return "weak";
  }
};

export const EmailValidator = {
  /**
   * Valida formato de email
   * @param {string} email 
   * @returns {object} {isValid: boolean, error: string}
   */
  validateEmail: (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!email) {
      return { isValid: false, error: "Email é obrigatório" };
    }
    
    if (!emailPattern.test(email)) {
      return { isValid: false, error: "Formato de email inválido" };
    }
    
    if (email.length > 254) {
      return { isValid: false, error: "Email muito longo" };
    }
    
    return { isValid: true, error: "" };
  }
};

export const NameValidator = {
  /**
   * Valida nome do usuário
   * @param {string} name 
   * @returns {object} {isValid: boolean, error: string}
   */
  validateName: (name) => {
    if (!name || !name.trim()) {
      return { isValid: false, error: "Nome é obrigatório" };
    }
    
    if (name.trim().length < 2) {
      return { isValid: false, error: "Nome deve ter pelo menos 2 caracteres" };
    }
    
    if (name.trim().length > 100) {
      return { isValid: false, error: "Nome muito longo (máximo 100 caracteres)" };
    }
    
    // Verificar se contém apenas letras, espaços, acentos e hífens
    if (!/^[a-zA-ZàáâãäåæçèéêëìíîïñòóôõöøùúûüýÿÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÑÒÓÔÕÖØÙÚÛÜÝŸ\s\-']+$/.test(name)) {
      return { isValid: false, error: "Nome deve conter apenas letras, espaços, acentos e hífens" };
    }
    
    return { isValid: true, error: "" };
  }
};
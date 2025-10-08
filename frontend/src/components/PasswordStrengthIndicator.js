import React from 'react';

const PasswordStrengthIndicator = ({ password, showCriteria = false }) => {
  const getPasswordStrength = (password) => {
    if (password.length < 6) return { strength: "weak", score: 0 };
    
    let score = 0;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) score += 1;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    let strength = "weak";
    if (score >= 5) strength = "strong";
    else if (score >= 3) strength = "medium";
    
    return { strength, score };
  };

  const getCriteria = (password) => {
    return {
      minLength: password.length >= 6,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password),
      noSpaces: !/\s/.test(password)
    };
  };

  const { strength, score } = getPasswordStrength(password);
  const criteria = getCriteria(password);

  const getStrengthColor = () => {
    switch (strength) {
      case "strong": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      default: return "bg-red-500";
    }
  };

  const getStrengthText = () => {
    switch (strength) {
      case "strong": return "Forte";
      case "medium": return "Médio";
      default: return "Fraca";
    }
  };

  const getStrengthWidth = () => {
    return `${Math.min((score / 6) * 100, 100)}%`;
  };

  if (!password) return null;

  return (
    <div className="mt-2">
      {/* Barra de força da senha */}
      <div className="flex items-center space-x-2 mb-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: getStrengthWidth() }}
          />
        </div>
        <span className={`text-sm font-medium ${
          strength === 'strong' ? 'text-green-600' : 
          strength === 'medium' ? 'text-yellow-600' : 
          'text-red-600'
        }`}>
          {getStrengthText()}
        </span>
      </div>

      {/* Critérios de segurança */}
      {showCriteria && (
        <div className="space-y-1">
          <p className="text-xs text-gray-600 mb-1">Critérios de segurança:</p>
          <div className="space-y-1">
            <div className={`flex items-center text-xs ${criteria.minLength ? 'text-green-600' : 'text-red-600'}`}>
              <span className="mr-2">{criteria.minLength ? '✓' : '✗'}</span>
              Pelo menos 6 caracteres
            </div>
            <div className={`flex items-center text-xs ${criteria.hasUppercase ? 'text-green-600' : 'text-red-600'}`}>
              <span className="mr-2">{criteria.hasUppercase ? '✓' : '✗'}</span>
              Uma letra maiúscula
            </div>
            <div className={`flex items-center text-xs ${criteria.hasLowercase ? 'text-green-600' : 'text-red-600'}`}>
              <span className="mr-2">{criteria.hasLowercase ? '✓' : '✗'}</span>
              Uma letra minúscula
            </div>
            <div className={`flex items-center text-xs ${criteria.hasSpecial ? 'text-green-600' : 'text-red-600'}`}>
              <span className="mr-2">{criteria.hasSpecial ? '✓' : '✗'}</span>
              Um caractere especial
            </div>
            <div className={`flex items-center text-xs ${criteria.noSpaces ? 'text-green-600' : 'text-red-600'}`}>
              <span className="mr-2">{criteria.noSpaces ? '✓' : '✗'}</span>
              Sem espaços
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
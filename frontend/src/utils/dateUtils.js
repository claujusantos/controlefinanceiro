/**
 * Utilitários para manipulação de datas
 */

/**
 * Converte data do formato YYYY-MM-DD para ISO string (backend espera datetime)
 * @param {string} dateString - Data no formato YYYY-MM-DD
 * @returns {string} - ISO string para o backend
 */
export const formatDateForBackend = (dateString) => {
  if (!dateString) return '';
  
  // Se já é um ISO string, retorna como está
  if (dateString.includes('T')) {
    return dateString;
  }
  
  // Converte YYYY-MM-DD para ISO string (meio-dia para evitar problemas de timezone)
  const date = new Date(dateString + 'T12:00:00.000Z');
  return date.toISOString();
};

/**
 * Converte datetime do backend para formato YYYY-MM-DD (para inputs de data)
 * @param {string} isoString - ISO string do backend
 * @returns {string} - Data no formato YYYY-MM-DD
 */
export const formatDateForInput = (isoString) => {
  if (!isoString) return '';
  
  const date = new Date(isoString);
  return date.toISOString().split('T')[0];
};

/**
 * Formata data para exibição (DD/MM/AAAA)
 * @param {string} dateValue - Data em qualquer formato
 * @returns {string} - Data formatada DD/MM/AAAA
 */
export const formatDateForDisplay = (dateValue) => {
  if (!dateValue) return '';
  
  const date = new Date(dateValue);
  
  // Verifica se é uma data válida
  if (isNaN(date.getTime())) {
    return dateValue; // Retorna como veio se não conseguir converter
  }
  
  return date.toLocaleDateString('pt-BR');
};

/**
 * Obter data atual no formato YYYY-MM-DD para inputs
 * @returns {string} - Data atual YYYY-MM-DD
 */
export const getCurrentDateForInput = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};
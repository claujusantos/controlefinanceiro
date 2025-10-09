/**
 * Enumerações sincronizadas com o backend
 */

export const TipoCategoria = {
  RECEITA: 'receita',
  DESPESA: 'despesa'
};

export const FormaPagamento = {
  PIX: 'PIX',
  CARTAO_CREDITO: 'Cartão de Crédito',
  CARTAO_DEBITO: 'Cartão de Débito',
  DINHEIRO: 'Dinheiro',
  TRANSFERENCIA: 'Transferência Bancária',
  BOLETO: 'Boleto'
};

export const FormaRecebimento = {
  PIX: 'PIX',
  SALARIO: 'Salário',
  DINHEIRO: 'Dinheiro',
  TRANSFERENCIA: 'Transferência Bancária',
  VENDAS: 'Vendas'
};

export const StatusSaldo = {
  LUCRO: 'lucro',
  PREJUIZO: 'prejuizo'
};

// Arrays para dropdowns
export const FORMAS_PAGAMENTO = Object.values(FormaPagamento);
export const FORMAS_RECEBIMENTO = Object.values(FormaRecebimento);
export const TIPOS_CATEGORIA = Object.values(TipoCategoria);
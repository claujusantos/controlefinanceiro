import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { DollarSign, Check, CreditCard, Shield, ArrowLeft } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { usuario } = useAuth();
  const [loading, setLoading] = useState(false);
  const [planoSelecionado, setPlanoSelecionado] = useState(null);

  const plans = {
    basico: {
      nome: 'Básico',
      preco: 19.90,
      periodo: 'mês',
      recursos: [
        'Dashboard completo',
        'Controle de receitas e despesas',
        'Até 50 transações/mês',
        'Exportação para Excel',
        'Suporte por email',
      ]
    },
    pro: {
      nome: 'Profissional',
      preco: 39.90,
      periodo: 'mês',
      recursos: [
        'Tudo do plano Básico',
        'Transações ilimitadas',
        'Análise de gastos recorrentes',
        'Projeções financeiras',
        'Filtros avançados',
        'Suporte prioritário',
      ]
    },
    anual: {
      nome: 'Anual',
      preco: 299,
      precoOriginal: 478.80,
      periodo: 'ano',
      recursos: [
        'Tudo do plano Profissional',
        '12 meses pelo preço de 7,5',
        'Economia de R$ 179,80',
        'Garantia de 30 dias',
        'Acesso vitalício às atualizações',
      ],
      desconto: '37% OFF'
    }
  };

  useEffect(() => {
    const plano = searchParams.get('plano') || 'pro';
    setPlanoSelecionado(plans[plano] || plans.pro);
  }, [searchParams]);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const planoId = searchParams.get('plano') || 'pro';
      const response = await axios.post(`${API}/checkout/hotmart`, null, {
        params: { plano: planoId }
      });
      
      // Redirecionar para a Hotmart
      window.location.href = response.data.checkout_url;
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
      setLoading(false);
    }
  };

  if (!planoSelecionado) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-500 p-2 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Controle Financeiro</span>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Resumo do Plano */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Finalizar Assinatura</h1>
            <p className="text-gray-600 mb-8">
              Você está assinando o plano <strong>{planoSelecionado.nome}</strong>
            </p>

            {/* Card do Plano */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    Plano {planoSelecionado.nome}
                  </h2>
                  {planoSelecionado.desconto && (
                    <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                      {planoSelecionado.desconto}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  {planoSelecionado.precoOriginal && (
                    <p className="text-gray-500 line-through text-sm">
                      R$ {planoSelecionado.precoOriginal.toFixed(2)}
                    </p>
                  )}
                  <p className="text-3xl font-bold text-gray-900">
                    R$ {planoSelecionado.preco.toFixed(2)}
                  </p>
                  <p className="text-gray-600 text-sm">por {planoSelecionado.periodo}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">O que está incluído:</h3>
                <ul className="space-y-3">
                  {planoSelecionado.recursos.map((recurso, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{recurso}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Garantias */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Garantias e Segurança
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Garantia de 30 dias - 100% do dinheiro de volta
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Pagamento seguro via Hotmart
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Cancele quando quiser, sem multas
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Acesso imediato após confirmação do pagamento
                </li>
              </ul>
            </div>
          </div>

          {/* Checkout */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Resumo do Pedido
              </h2>

              {/* Dados do Usuário */}
              {usuario && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-1">Assinante</p>
                  <p className="font-semibold text-gray-900">{usuario.nome}</p>
                  <p className="text-sm text-gray-600">{usuario.email}</p>
                </div>
              )}

              {/* Resumo de Preços */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plano {planoSelecionado.nome}</span>
                  <span className="font-semibold">
                    R$ {planoSelecionado.preco.toFixed(2)}
                  </span>
                </div>
                {planoSelecionado.precoOriginal && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto</span>
                    <span className="font-semibold">
                      - R$ {(planoSelecionado.precoOriginal - planoSelecionado.preco).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">
                    R$ {planoSelecionado.preco.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Botão de Checkout */}
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
              >
                {loading ? (
                  'Processando...'
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Finalizar Pagamento
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mb-4">
                Você será redirecionado para a página segura de pagamento da Hotmart
              </p>

              {/* Formas de Pagamento */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600 mb-2">Formas de pagamento aceitas:</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs bg-gray-100 px-3 py-1 rounded">Cartão de Crédito</span>
                  <span className="text-xs bg-gray-100 px-3 py-1 rounded">Boleto</span>
                  <span className="text-xs bg-gray-100 px-3 py-1 rounded">PIX</span>
                  <span className="text-xs bg-gray-100 px-3 py-1 rounded">PayPal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

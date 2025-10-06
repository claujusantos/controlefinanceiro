import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Projecoes = () => {
  const [projecoes, setProjecoes] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProjecoes = async () => {
    try {
      const response = await axios.get(`${API}/projecoes`);
      setProjecoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar projeções:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjecoes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (!projecoes) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-gray-600">Erro ao carregar projeções</div>
      </div>
    );
  }

  // Verificar se há dados suficientes
  const semDados = projecoes.media_receitas === 0 && projecoes.media_despesas === 0;

  const getTendenciaIcon = () => {
    if (projecoes.tendencia === 'crescimento') {
      return <TrendingUp className="w-8 h-8 text-green-500" />;
    } else if (projecoes.tendencia === 'declinio') {
      return <TrendingDown className="w-8 h-8 text-red-500" />;
    }
    return <Activity className="w-8 h-8 text-gray-500" />;
  };

  const getTendenciaText = () => {
    if (projecoes.tendencia === 'crescimento') {
      return { text: 'Tendência de Crescimento', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
    } else if (projecoes.tendencia === 'declinio') {
      return { text: 'Tendência de Declínio', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
    }
    return { text: 'Tendência Neutra', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' };
  };

  const tendenciaInfo = getTendenciaText();

  return (
    <div className="space-y-6" data-testid="projecoes-page">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Projeções Financeiras</h2>
          <p className="text-gray-600 mt-1">Baseado na média dos últimos 3 meses</p>
        </div>
      </div>

      {/* Alerta */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">
              As projeções são estimativas baseadas no histórico recente e podem variar de acordo com seus hábitos financeiros.
            </p>
          </div>
        </div>
      </div>

      {/* Cards de Médias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Média de Receitas</span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600" data-testid="media-receitas">
            R$ {projecoes.media_receitas.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Por mês</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Média de Despesas</span>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-600" data-testid="media-despesas">
            R$ {projecoes.media_despesas.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Por mês</p>
        </div>

        <div className={`rounded-xl shadow-lg p-6 border-2 ${tendenciaInfo.bg} ${tendenciaInfo.border}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Saldo Projetado</span>
            {getTendenciaIcon()}
          </div>
          <p className={`text-3xl font-bold ${tendenciaInfo.color}`} data-testid="saldo-projetado">
            R$ {projecoes.saldo_projetado.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Por mês</p>
        </div>
      </div>

      {/* Tendência */}
      <div className={`rounded-xl shadow-lg p-6 border-2 ${tendenciaInfo.bg} ${tendenciaInfo.border}`}>
        <div className="flex items-center gap-3">
          {getTendenciaIcon()}
          <div>
            <h3 className={`text-xl font-bold ${tendenciaInfo.color}`}>
              {tendenciaInfo.text}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {projecoes.tendencia === 'crescimento' && 'Suas receitas estão superando suas despesas. Continue assim!'}
              {projecoes.tendencia === 'declinio' && 'Suas despesas estão superando suas receitas. Considere revisar seus gastos.'}
              {projecoes.tendencia === 'neutro' && 'Suas receitas e despesas estão equilibradas.'}
            </p>
          </div>
        </div>
      </div>

      {/* Gráfico de Projeção dos Próximos 6 Meses */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Projeção dos Próximos 6 Meses</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={projecoes.projecao_6_meses}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="mes" 
              label={{ value: 'Mês', position: 'insideBottom', offset: -5 }}
            />
            <YAxis label={{ value: 'Valor (R$)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="receita_estimada" 
              stroke="#10B981" 
              strokeWidth={3} 
              name="Receita Estimada"
              strokeDasharray="5 5"
            />
            <Line 
              type="monotone" 
              dataKey="despesa_estimada" 
              stroke="#EF4444" 
              strokeWidth={3} 
              name="Despesa Estimada"
              strokeDasharray="5 5"
            />
            <Line 
              type="monotone" 
              dataKey="saldo_estimado" 
              stroke="#3B82F6" 
              strokeWidth={3} 
              name="Saldo Estimado"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tabela de Projeção */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mês</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Receita Estimada</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Despesa Estimada</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Saldo Estimado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projecoes.projecao_6_meses.map((proj, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    Mês {proj.mes}
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-semibold text-green-600">
                    R$ {proj.receita_estimada.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-semibold text-red-600">
                    R$ {proj.despesa_estimada.toFixed(2)}
                  </td>
                  <td className={`px-6 py-4 text-sm text-right font-bold ${
                    proj.saldo_estimado >= 0 ? 'text-blue-600' : 'text-red-600'
                  }`}>
                    R$ {proj.saldo_estimado.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Projecoes;
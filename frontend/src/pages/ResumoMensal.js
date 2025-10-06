import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ResumoMensal = () => {
  const [resumos, setResumos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResumos = async () => {
    try {
      const response = await axios.get(`${API}/resumo-mensal`);
      setResumos(response.data);
    } catch (error) {
      console.error('Erro ao carregar resumo mensal:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumos();
  }, []);

  const getMesNome = (mes) => {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return meses[mes - 1];
  };

  const totalReceitas = resumos.reduce((sum, r) => sum + r.total_receitas, 0);
  const totalDespesas = resumos.reduce((sum, r) => sum + r.total_despesas, 0);
  const saldoTotal = totalReceitas - totalDespesas;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="resumo-page">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Resumo Mensal</h2>
          <p className="text-gray-600 mt-1">Histórico completo de receitas e despesas</p>
        </div>
      </div>

      {/* Totais Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Total de Receitas</span>
          </div>
          <p className="text-3xl font-bold text-green-600" data-testid="total-receitas-geral">
            R$ {totalReceitas.toFixed(2)}
          </p>
        </div>

        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-6 h-6 text-red-600" />
            <span className="text-sm font-medium text-gray-700">Total de Despesas</span>
          </div>
          <p className="text-3xl font-bold text-red-600" data-testid="total-despesas-geral">
            R$ {totalDespesas.toFixed(2)}
          </p>
        </div>

        <div className={`border-2 rounded-xl p-6 ${
          saldoTotal >= 0 
            ? 'bg-blue-50 border-blue-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Saldo Total</span>
          </div>
          <p className={`text-3xl font-bold ${
            saldoTotal >= 0 ? 'text-blue-600' : 'text-red-600'
          }`} data-testid="saldo-geral">
            R$ {saldoTotal.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Tabela de Resumo */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold">Mês/Ano</th>
                <th className="px-6 py-4 text-right text-sm font-bold">Receitas</th>
                <th className="px-6 py-4 text-right text-sm font-bold">Despesas</th>
                <th className="px-6 py-4 text-right text-sm font-bold">Saldo</th>
                <th className="px-6 py-4 text-right text-sm font-bold">% Economia</th>
                <th className="px-6 py-4 text-center text-sm font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {resumos.map((resumo, index) => (
                <tr 
                  key={`${resumo.mes}-${resumo.ano}`}
                  className={`hover:bg-gray-50 transition-colors ${
                    resumo.lucro_prejuizo === 'prejuizo' ? 'bg-red-50' : ''
                  }`}
                  data-testid={`resumo-row-${index}`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {getMesNome(resumo.mes)} / {resumo.ano}
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-semibold text-green-600">
                    R$ {resumo.total_receitas.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-semibold text-red-600">
                    R$ {resumo.total_despesas.toFixed(2)}
                  </td>
                  <td className={`px-6 py-4 text-sm text-right font-bold ${
                    resumo.saldo >= 0 ? 'text-blue-600' : 'text-red-600'
                  }`}>
                    R$ {resumo.saldo.toFixed(2)}
                  </td>
                  <td className={`px-6 py-4 text-sm text-right font-semibold ${
                    resumo.percentual_economia >= 0 ? 'text-purple-600' : 'text-red-600'
                  }`}>
                    {resumo.percentual_economia.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      resumo.lucro_prejuizo === 'lucro'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {resumo.lucro_prejuizo === 'lucro' ? 'Lucro' : 'Prejuízo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {resumos.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Nenhum registro encontrado
          </div>
        )}
      </div>

      {/* Estatísticas */}
      {resumos.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Estatísticas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Média de Receitas Mensais</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {(totalReceitas / resumos.length).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Média de Despesas Mensais</p>
              <p className="text-2xl font-bold text-red-600">
                R$ {(totalDespesas / resumos.length).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Média de Saldo Mensal</p>
              <p className={`text-2xl font-bold ${
                (saldoTotal / resumos.length) >= 0 ? 'text-blue-600' : 'text-red-600'
              }`}>
                R$ {(saldoTotal / resumos.length).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumoMensal;
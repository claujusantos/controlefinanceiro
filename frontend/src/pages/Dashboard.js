import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, TrendingDown, DollarSign, Percent, Calendar, Filter, RefreshCw, RepeatIcon } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [gastosRecorrentes, setGastosRecorrentes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('total');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      let url = `${API}/dashboard?periodo=${periodo}`;
      if (periodo === 'customizado' && dataInicio && dataFim) {
        url += `&data_inicio=${dataInicio}&data_fim=${dataFim}`;
      }
      const response = await axios.get(url);
      setDashboard(response.data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGastosRecorrentes = async () => {
    try {
      const response = await axios.get(`${API}/gastos-recorrentes`);
      setGastosRecorrentes(response.data);
    } catch (error) {
      console.error('Erro ao carregar gastos recorrentes:', error);
    }
  };

  const exportarExcel = async () => {
    try {
      const response = await axios.get(`${API}/export-excel`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'controle_financeiro.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao exportar Excel:', error);
      alert('Erro ao exportar planilha. Tente novamente.');
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchGastosRecorrentes();
  }, []);

  const aplicarFiltro = () => {
    fetchDashboard();
  };

  const getPeriodoLabel = () => {
    switch(periodo) {
      case 'total': return 'Tempo Total';
      case 'ultimo_mes': return 'Último Mês';
      case 'ultimos_6_meses': return 'Últimos 6 Meses';
      case 'customizado': return `${dataInicio} até ${dataFim}`;
      default: return 'Tempo Total';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-gray-600">Erro ao carregar dados</div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="dashboard-page">
      {/* Header com Filtro */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Dashboard Financeiro</h2>
          <p className="text-gray-600 mt-1">Visualizando: <span className="font-semibold text-blue-600">{getPeriodoLabel()}</span></p>
        </div>
        <button
          onClick={exportarExcel}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg transition-all"
          data-testid="export-excel-btn"
        >
          <Download className="w-5 h-5" />
          Exportar Excel
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-bold text-gray-800">Filtrar por Período</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Seletor de Período */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              data-testid="periodo-select"
            >
              <option value="total">Tempo Total</option>
              <option value="ultimo_mes">Último Mês</option>
              <option value="ultimos_6_meses">Últimos 6 Meses</option>
              <option value="customizado">Período Customizado</option>
            </select>
          </div>

          {/* Data Início (apenas para customizado) */}
          {periodo === 'customizado' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Início</label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="data-inicio-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Fim</label>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="data-fim-input"
                />
              </div>
            </>
          )}

          {/* Botão Aplicar */}
          <div className={`flex items-end ${periodo === 'customizado' ? '' : 'md:col-start-4'}`}>
            <button
              onClick={aplicarFiltro}
              className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-all"
              data-testid="aplicar-filtro-btn"
            >
              <RefreshCw className="w-4 h-4" />
              Aplicar Filtro
            </button>
          </div>
        </div>
      </div>

      {/* Cards de Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6" data-testid="card-receitas">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Receitas Totais</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                R$ {dashboard.total_receitas.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6" data-testid="card-despesas">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Despesas Totais</p>
              <p className="text-2xl font-bold text-red-600 mt-2">
                R$ {dashboard.total_despesas.toFixed(2)}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6" data-testid="card-saldo">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Saldo</p>
              <p className={`text-2xl font-bold mt-2 ${
                dashboard.saldo >= 0 ? 'text-blue-600' : 'text-red-600'
              }`}>
                R$ {dashboard.saldo.toFixed(2)}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6" data-testid="card-economia">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">% Economia</p>
              <p className={`text-2xl font-bold mt-2 ${
                dashboard.percentual_economia >= 0 ? 'text-purple-600' : 'text-red-600'
              }`}>
                {dashboard.percentual_economia.toFixed(2)}%
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Percent className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gastos Recorrentes */}
      {gastosRecorrentes && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <RepeatIcon className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold text-gray-800">Gastos Recorrentes</h3>
          </div>

          {/* Mensagem quando não há dados */}
          {gastosRecorrentes.categorias_mais_frequentes.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <RepeatIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium mb-2">Nenhum gasto recorrente encontrado</p>
              <p className="text-sm text-gray-500">
                Adicione suas despesas para visualizar padrões de gastos frequentes e categorias mais utilizadas.
              </p>
            </div>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Categorias Mais Frequentes */}
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-3">Categorias Mais Frequentes</h4>
              <div className="space-y-3">
                {gastosRecorrentes.categorias_mais_frequentes.slice(0, 5).map((cat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{cat.categoria}</p>
                      <p className="text-xs text-gray-500">{cat.ocorrencias} ocorrências</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">R$ {cat.valor_total.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Média: R$ {cat.valor_medio.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Descrições Recorrentes */}
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-3">Despesas que se Repetem</h4>
              <div className="space-y-3">
                {gastosRecorrentes.descricoes_recorrentes.slice(0, 5).map((desc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{desc.descricao}</p>
                      <p className="text-xs text-gray-500">{desc.ocorrencias}x no período</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-600">R$ {desc.valor_total.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Média: R$ {desc.valor_medio.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                {gastosRecorrentes.descricoes_recorrentes.length === 0 && (
                  <p className="text-center text-gray-500 py-4">Nenhuma despesa recorrente encontrada</p>
                )}
              </div>
            </div>
          </div>

          {/* Média por Categoria */}
          <div className="mt-6">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Média de Gasto por Categoria</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {gastosRecorrentes.media_por_categoria.slice(0, 6).map((cat, index) => (
                <div key={index} className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-gray-700">{cat.categoria}</p>
                  <p className="text-xl font-bold text-purple-600 mt-1">R$ {cat.media_gasto.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Total: R$ {cat.total_gasto.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras - Evolução Mensal */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Receitas vs Despesas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboard.evolucao_mensal}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="receitas" fill="#10B981" name="Receitas" />
              <Bar dataKey="despesas" fill="#EF4444" name="Despesas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Pizza - Distribuição por Categoria */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Distribuição de Despesas por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboard.categorias_distribuicao}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.categoria}
                outerRadius={100}
                fill="#8884d8"
                dataKey="valor"
              >
                {dashboard.categorias_distribuicao.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Linha - Evolução do Saldo */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Evolução do Saldo</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dashboard.evolucao_mensal}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="saldo" stroke="#3B82F6" strokeWidth={3} name="Saldo" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;

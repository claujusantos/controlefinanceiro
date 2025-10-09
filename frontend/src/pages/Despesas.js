import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { FORMAS_PAGAMENTO, TipoCategoria } from '../constants/enums';
import { formatDateForBackend, formatDateForInput, formatDateForDisplay, getCurrentDateForInput } from '../utils/dateUtils';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Despesas = () => {
  const [despesas, setDespesas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    data: getCurrentDateForInput(),
    descricao: '',
    categoria: '',
    forma_pagamento: FORMAS_PAGAMENTO[0], // PIX como padrão
    valor: ''
  });

  const fetchDespesas = async () => {
    try {
      const response = await axios.get(`${API}/despesas`);
      setDespesas(response.data);
    } catch (error) {
      console.error('Erro ao carregar despesas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await axios.get(`${API}/categorias`);
      setCategorias(response.data.filter(c => c.tipo === 'despesa'));
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  useEffect(() => {
    fetchDespesas();
    fetchCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API}/despesas/${editingId}`, formData);
      } else {
        await axios.post(`${API}/despesas`, formData);
      }
      fetchDespesas();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar despesa:', error);
      alert('Erro ao salvar despesa');
    }
  };

  const handleEdit = (despesa) => {
    setFormData({
      data: despesa.data,
      descricao: despesa.descricao,
      categoria: despesa.categoria,
      forma_pagamento: despesa.forma_pagamento,
      valor: despesa.valor.toString()
    });
    setEditingId(despesa.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente deletar esta despesa?')) {
      try {
        await axios.delete(`${API}/despesas/${id}`);
        fetchDespesas();
      } catch (error) {
        console.error('Erro ao deletar despesa:', error);
        alert('Erro ao deletar despesa');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      data: '',
      descricao: '',
      categoria: '',
      forma_pagamento: '',
      valor: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const totalDespesas = despesas.reduce((sum, d) => sum + d.valor, 0);

  return (
    <div className="space-y-6" data-testid="despesas-page">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Despesas</h2>
          <p className="text-gray-600 mt-1">Gerencie suas despesas</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg transition-all"
          data-testid="add-despesa-btn"
        >
          <Plus className="w-5 h-5" />
          Nova Despesa
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              {editingId ? 'Editar Despesa' : 'Nova Despesa'}
            </h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
              <input
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                required
                data-testid="despesa-data-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
              <input
                type="text"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                required
                data-testid="despesa-descricao-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                required
                data-testid="despesa-categoria-select"
              >
                <option value="">Selecione...</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.nome}>{cat.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Forma de Pagamento</label>
              <input
                type="text"
                value={formData.forma_pagamento}
                onChange={(e) => setFormData({ ...formData, forma_pagamento: e.target.value })}
                placeholder="Ex: Cartão, Dinheiro, PIX"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                required
                data-testid="despesa-forma-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                required
                data-testid="despesa-valor-input"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all"
                data-testid="despesa-save-btn"
              >
                <Save className="w-4 h-4" />
                Salvar
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Total */}
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-700">Total de Despesas:</span>
          <span className="text-2xl font-bold text-red-600" data-testid="total-despesas">
            R$ {totalDespesas.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Forma</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {despesas.map((despesa) => (
              <tr key={despesa.id} data-testid={`despesa-row-${despesa.id}`}>
                <td className="px-6 py-4 text-sm text-gray-900">{despesa.data}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{despesa.descricao}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{despesa.categoria}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{despesa.forma_pagamento}</td>
                <td className="px-6 py-4 text-sm font-semibold text-red-600">
                  R$ {despesa.valor.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(despesa)}
                      className="text-blue-600 hover:text-blue-800"
                      data-testid={`edit-despesa-${despesa.id}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(despesa.id)}
                      className="text-red-600 hover:text-red-800"
                      data-testid={`delete-despesa-${despesa.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {despesas.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Nenhuma despesa cadastrada
          </div>
        )}
      </div>
    </div>
  );
};

export default Despesas;
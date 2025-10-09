import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { FORMAS_RECEBIMENTO, TipoCategoria } from '../constants/enums';
import { formatDateForBackend, formatDateForInput, formatDateForDisplay, getCurrentDateForInput } from '../utils/dateUtils';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Receitas = () => {
  const [receitas, setReceitas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    data: getCurrentDateForInput(),
    descricao: '',
    categoria: '',
    forma_recebimento: FORMAS_RECEBIMENTO[0], // PIX como padrão
    valor: ''
  });

  const fetchReceitas = async () => {
    try {
      const response = await axios.get(`${API}/receitas`);
      setReceitas(response.data);
    } catch (error) {
      console.error('Erro ao carregar receitas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await axios.get(`${API}/categorias`);
      setCategorias(response.data.filter(c => c.tipo === TipoCategoria.RECEITA));
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  useEffect(() => {
    fetchReceitas();
    fetchCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        data: formatDateForBackend(formData.data),
        valor: parseFloat(formData.valor)
      };
      
      if (editingId) {
        await axios.put(`${API}/receitas/${editingId}`, dataToSend);
      } else {
        await axios.post(`${API}/receitas`, dataToSend);
      }
      fetchReceitas();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar receita:', error);
      alert('Erro ao salvar receita: ' + (error.response?.data?.detail || 'Erro desconhecido'));
    }
  };

  const handleEdit = (receita) => {
    setFormData({
      data: formatDateForInput(receita.data),
      descricao: receita.descricao,
      categoria: receita.categoria,
      forma_recebimento: receita.forma_recebimento,
      valor: receita.valor.toString()
    });
    setEditingId(receita.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente deletar esta receita?')) {
      try {
        await axios.delete(`${API}/receitas/${id}`);
        fetchReceitas();
      } catch (error) {
        console.error('Erro ao deletar receita:', error);
        alert('Erro ao deletar receita');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      data: '',
      descricao: '',
      categoria: '',
      forma_recebimento: '',
      valor: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const totalReceitas = receitas.reduce((sum, r) => sum + r.valor, 0);

  return (
    <div className="space-y-6" data-testid="receitas-page">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Receitas</h2>
          <p className="text-gray-600 mt-1">Gerencie suas receitas</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg transition-all"
          data-testid="add-receita-btn"
        >
          <Plus className="w-5 h-5" />
          Nova Receita
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              {editingId ? 'Editar Receita' : 'Nova Receita'}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
                data-testid="receita-data-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
              <input
                type="text"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
                data-testid="receita-descricao-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
                data-testid="receita-categoria-select"
              >
                <option value="">Selecione...</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.nome}>{cat.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Forma de Recebimento</label>
              <select
                value={formData.forma_recebimento}
                onChange={(e) => setFormData({ ...formData, forma_recebimento: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
                data-testid="receita-forma-select"
              >
                {FORMAS_RECEBIMENTO.map((forma) => (
                  <option key={forma} value={forma}>{forma}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
                data-testid="receita-valor-input"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all"
                data-testid="receita-save-btn"
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
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-700">Total de Receitas:</span>
          <span className="text-2xl font-bold text-green-600" data-testid="total-receitas">
            R$ {totalReceitas.toFixed(2)}
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
            {receitas.map((receita) => (
              <tr key={receita.id} data-testid={`receita-row-${receita.id}`}>
                <td className="px-6 py-4 text-sm text-gray-900">{receita.data}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{receita.descricao}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{receita.categoria}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{receita.forma_recebimento}</td>
                <td className="px-6 py-4 text-sm font-semibold text-green-600">
                  R$ {receita.valor.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(receita)}
                      className="text-blue-600 hover:text-blue-800"
                      data-testid={`edit-receita-${receita.id}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(receita.id)}
                      className="text-red-600 hover:text-red-800"
                      data-testid={`delete-receita-${receita.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {receitas.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Nenhuma receita cadastrada
          </div>
        )}
      </div>
    </div>
  );
};

export default Receitas;
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Save, X, Tag } from 'lucide-react';
import { TipoCategoria, TIPOS_CATEGORIA } from '../constants/enums';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    tipo: TipoCategoria.RECEITA,
    cor: '#3B82F6'
  });

  const fetchCategorias = async () => {
    try {
      const response = await axios.get(`${API}/categorias`);
      setCategorias(response.data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API}/categorias/${editingId}`, formData);
      } else {
        await axios.post(`${API}/categorias`, formData);
      }
      fetchCategorias();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      alert('Erro ao salvar categoria');
    }
  };

  const handleEdit = (categoria) => {
    setFormData({
      nome: categoria.nome,
      tipo: categoria.tipo,
      cor: categoria.cor
    });
    setEditingId(categoria.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente deletar esta categoria?')) {
      try {
        await axios.delete(`${API}/categorias/${id}`);
        fetchCategorias();
      } catch (error) {
        console.error('Erro ao deletar categoria:', error);
        alert('Erro ao deletar categoria');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      tipo: TipoCategoria.RECEITA,
      cor: '#3B82F6'
    });
    setEditingId(null);
    setShowForm(false);
  };

  const categoriasReceita = categorias.filter(c => c.tipo === TipoCategoria.RECEITA);
  const categoriasDespesa = categorias.filter(c => c.tipo === TipoCategoria.DESPESA);

  return (
    <div className="space-y-6" data-testid="categorias-page">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Categorias</h2>
          <p className="text-gray-600 mt-1">Gerencie suas categorias de receitas e despesas</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg transition-all"
          data-testid="add-categoria-btn"
        >
          <Plus className="w-5 h-5" />
          Nova Categoria
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              {editingId ? 'Editar Categoria' : 'Nova Categoria'}
            </h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                data-testid="categoria-nome-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                data-testid="categoria-tipo-select"
              >
                {TIPOS_CATEGORIA.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo === TipoCategoria.RECEITA ? 'Receita' : 'Despesa'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cor</label>
              <input
                type="color"
                value={formData.cor}
                onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                className="w-full h-10 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                data-testid="categoria-cor-input"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all"
                data-testid="categoria-save-btn"
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

      {/* Categorias de Receitas */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5 text-green-500" />
          Categorias de Receitas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoriasReceita.map((cat) => (
            <div
              key={cat.id}
              className="border-2 rounded-lg p-4 flex items-center justify-between"
              style={{ borderColor: cat.cor }}
              data-testid={`categoria-card-${cat.id}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: cat.cor }}
                />
                <span className="font-medium text-gray-800">{cat.nome}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(cat)}
                  className="text-blue-600 hover:text-blue-800"
                  data-testid={`edit-categoria-${cat.id}`}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-red-600 hover:text-red-800"
                  data-testid={`delete-categoria-${cat.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {categoriasReceita.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhuma categoria de receita cadastrada
          </div>
        )}
      </div>

      {/* Categorias de Despesas */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5 text-red-500" />
          Categorias de Despesas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoriasDespesa.map((cat) => (
            <div
              key={cat.id}
              className="border-2 rounded-lg p-4 flex items-center justify-between"
              style={{ borderColor: cat.cor }}
              data-testid={`categoria-card-${cat.id}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: cat.cor }}
                />
                <span className="font-medium text-gray-800">{cat.nome}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(cat)}
                  className="text-blue-600 hover:text-blue-800"
                  data-testid={`edit-categoria-${cat.id}`}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-red-600 hover:text-red-800"
                  data-testid={`delete-categoria-${cat.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {categoriasDespesa.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhuma categoria de despesa cadastrada
          </div>
        )}
      </div>
    </div>
  );
};

export default Categorias;
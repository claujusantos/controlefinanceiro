import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import '@/App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import Receitas from './pages/Receitas';
import Despesas from './pages/Despesas';
import Categorias from './pages/Categorias';
import ResumoMensal from './pages/ResumoMensal';
import Projecoes from './pages/Projecoes';
import { DollarSign, TrendingUp, TrendingDown, FileText, FolderKanban, BarChart3, LogOut, User } from 'lucide-react';

const NavLink = ({ to, children, icon: Icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        isActive 
          ? 'bg-blue-500 text-white shadow-lg' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
      data-testid={`nav-${to.slice(1) || 'dashboard'}`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{children}</span>
    </Link>
  );
};

const Layout = ({ children }) => {
  const { usuario, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 min-h-screen bg-white shadow-xl p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <DollarSign className="w-8 h-8 text-blue-500" />
              Controle Financeiro
            </h1>
            <p className="text-sm text-gray-500 mt-1">Gestão completa das suas finanças</p>
          </div>

          {/* User Info */}
          {usuario && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 p-2 rounded-full">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{usuario.nome}</p>
                  <p className="text-xs text-gray-600 truncate">{usuario.email}</p>
                </div>
              </div>
            </div>
          )}
          
          <nav className="space-y-2">
            <NavLink to="/" icon={BarChart3}>Dashboard</NavLink>
            <NavLink to="/receitas" icon={TrendingUp}>Receitas</NavLink>
            <NavLink to="/despesas" icon={TrendingDown}>Despesas</NavLink>
            <NavLink to="/categorias" icon={FolderKanban}>Categorias</NavLink>
            <NavLink to="/resumo" icon={FileText}>Resumo Mensal</NavLink>
            <NavLink to="/projecoes" icon={BarChart3}>Projeções</NavLink>
          </nav>

          {/* Logout Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all"
              data-testid="logout-button"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      
      {/* Rotas protegidas */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/receitas" element={
        <ProtectedRoute>
          <Layout>
            <Receitas />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/despesas" element={
        <ProtectedRoute>
          <Layout>
            <Despesas />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/categorias" element={
        <ProtectedRoute>
          <Layout>
            <Categorias />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/resumo" element={
        <ProtectedRoute>
          <Layout>
            <ResumoMensal />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/projecoes" element={
        <ProtectedRoute>
          <Layout>
            <Projecoes />
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

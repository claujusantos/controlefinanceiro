import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import '@/App.css';
import Dashboard from './pages/Dashboard';
import Receitas from './pages/Receitas';
import Despesas from './pages/Despesas';
import Categorias from './pages/Categorias';
import ResumoMensal from './pages/ResumoMensal';
import Projecoes from './pages/Projecoes';
import { DollarSign, TrendingUp, TrendingDown, FileText, FolderKanban, BarChart3 } from 'lucide-react';

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
          
          <nav className="space-y-2">
            <NavLink to="/" icon={BarChart3}>Dashboard</NavLink>
            <NavLink to="/receitas" icon={TrendingUp}>Receitas</NavLink>
            <NavLink to="/despesas" icon={TrendingDown}>Despesas</NavLink>
            <NavLink to="/categorias" icon={FolderKanban}>Categorias</NavLink>
            <NavLink to="/resumo" icon={FileText}>Resumo Mensal</NavLink>
            <NavLink to="/projecoes" icon={BarChart3}>Projeções</NavLink>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/receitas" element={<Receitas />} />
          <Route path="/despesas" element={<Despesas />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/resumo" element={<ResumoMensal />} />
          <Route path="/projecoes" element={<Projecoes />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { PasswordValidator, EmailValidator, NameValidator } from '../utils/validators';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import { PasswordValidator, EmailValidator, NameValidator } from '../utils/validators';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';

const Registro = () => {
  const navigate = useNavigate();
  const { registrar } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [nomeErro, setNomeErro] = useState('');
  const [emailErro, setEmailErro] = useState('');
  const [senhaErros, setSenhaErros] = useState([]);

  // Validações em tempo real
  const handleNomeChange = (value) => {
    setNome(value);
    const validation = NameValidator.validateName(value);
    setNomeErro(validation.isValid ? '' : validation.error);
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    const validation = EmailValidator.validateEmail(value);
    setEmailErro(validation.isValid ? '' : validation.error);
  };

  const handleSenhaChange = (value) => {
    setSenha(value);
    const validation = PasswordValidator.validatePassword(value);
    setSenhaErros(validation.errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    // Validações finais
    const nomeValidation = NameValidator.validateName(nome);
    const emailValidation = EmailValidator.validateEmail(email);
    const senhaValidation = PasswordValidator.validatePassword(senha);

    if (!nomeValidation.isValid) {
      setErro(nomeValidation.error);
      return;
    }

    if (!emailValidation.isValid) {
      setErro(emailValidation.error);
      return;
    }

    if (!senhaValidation.isValid) {
      setErro(`Senha inválida: ${senhaValidation.errors.join(', ')}`);
      return;
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }

    setLoading(true);

    const result = await registrar(nome, email, senha);

    if (result.success) {
      navigate('/');
    } else {
      setErro(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-500 p-4 rounded-full">
              <DollarSign className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Controle Financeiro</h1>
          <p className="text-gray-600 mt-2">Crie sua conta grátis</p>
        </div>

        {/* Card de Registro */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Criar Conta</h2>

          {erro && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded" data-testid="register-error">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-sm text-red-700">{erro}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => handleNomeChange(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    nomeErro ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="João Silva"
                  required
                  data-testid="name-input"
                />
              </div>
              {nomeErro && (
                <p className="mt-1 text-sm text-red-600">{nomeErro}</p>
              )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="seu@email.com"
                  required
                  data-testid="email-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  data-testid="password-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  data-testid="confirm-password-input"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold mb-1">Ao criar sua conta você terá:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Dashboard completo com gráficos</li>
                    <li>Controle de receitas e despesas</li>
                    <li>Análise de gastos recorrentes</li>
                    <li>Exportação para Excel</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="register-button"
            >
              {loading ? (
                <span>Criando conta...</span>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Criar Conta Grátis
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-blue-500 hover:text-blue-600 font-semibold" data-testid="login-link">
                Fazer login
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>© 2025 Controle Financeiro. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Registro;
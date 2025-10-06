import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  Check, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Download,
  Shield,
  Zap,
  Clock,
  Users,
  Star,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('semestral');

  const plans = [
    {
      id: 'mensal',
      nome: 'Mensal',
      preco: 24.90,
      periodo: 'mês',
      recursos: [
        'Dashboard completo com gráficos',
        'Controle ilimitado de receitas e despesas',
        'Análise de gastos recorrentes',
        'Projeções financeiras',
        'Exportação profissional para Excel',
        'Filtros avançados por período',
        'Suporte por email',
      ],
      cor: 'blue',
      popular: false
    },
    {
      id: 'semestral',
      nome: 'Semestral',
      preco: 119.40,
      precoMensal: 19.90,
      precoOriginal: 149.40,
      periodo: '6 meses',
      recursos: [
        'Todos os recursos inclusos',
        'R$ 19,90 por mês',
        'Economia de R$ 30,00',
        '20% de desconto',
        'Pagamento único ou parcelado',
        'Garantia de 7 dias',
      ],
      cor: 'green',
      popular: true,
      desconto: '20% OFF'
    },
    {
      id: 'anual',
      nome: 'Anual',
      preco: 202.80,
      precoMensal: 16.90,
      precoOriginal: 298.80,
      periodo: '12 meses',
      recursos: [
        'Todos os recursos inclusos',
        'R$ 16,90 por mês',
        'Economia de R$ 96,00',
        '32% de desconto',
        'Melhor custo-benefício',
        'Garantia de 7 dias',
        'Bônus: Suporte prioritário',
      ],
      cor: 'purple',
      popular: false,
      desconto: '32% OFF'
    }
  ];

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    // Redirecionar para checkout
    navigate(`/checkout?plano=${planId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Nav */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-500 p-2 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Controle Financeiro</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Entrar
              </button>
              <button
                onClick={() => navigate('/registro')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-all"
              >
                Começar Grátis
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-semibold">Mais de 10.000 usuários satisfeitos</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Controle suas finanças
              <br />
              <span className="text-blue-600">de forma simples e eficaz</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              A solução completa para gerenciar suas receitas, despesas e alcançar seus objetivos financeiros. 
              Dashboard intuitivo, relatórios detalhados e muito mais.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => document.getElementById('planos').scrollIntoView({ behavior: 'smooth' })}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Ver Planos e Preços
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/registro')}
                className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all border-2 border-gray-200"
              >
                Testar Grátis por 7 Dias
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              ✓ Sem cartão de crédito • ✓ Cancele quando quiser
            </p>
          </div>

          {/* Screenshot/Preview */}
          <div className="mt-16 relative">
            <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-200">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-24 h-24 text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-xl text-gray-600">
              Recursos profissionais para gerenciar suas finanças pessoais e empresariais
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                titulo: 'Dashboard Completo',
                descricao: 'Visualize todas as suas finanças em um painel intuitivo com gráficos e indicadores em tempo real.'
              },
              {
                icon: TrendingUp,
                titulo: 'Controle de Receitas',
                descricao: 'Registre e organize todas as suas fontes de renda de forma simples e rápida.'
              },
              {
                icon: PieChart,
                titulo: 'Análise de Gastos',
                descricao: 'Identifique gastos recorrentes e categorias que mais impactam seu orçamento.'
              },
              {
                icon: Download,
                titulo: 'Exportação Excel',
                descricao: 'Exporte relatórios completos em Excel com fórmulas e formatação profissional.'
              },
              {
                icon: Zap,
                titulo: 'Projeções Futuras',
                descricao: 'Veja projeções financeiras baseadas no seu histórico e planeje melhor.'
              },
              {
                icon: Shield,
                titulo: '100% Seguro',
                descricao: 'Seus dados criptografados e protegidos com tecnologia de ponta.'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.titulo}</h3>
                <p className="text-gray-600">{feature.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Mais de 10.000 pessoas já transformaram suas finanças
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                nome: 'Maria Silva',
                cargo: 'Empreendedora',
                texto: 'Comecei a usar e em 3 meses já economizei R$ 2.500! O dashboard é incrível e me ajuda a visualizar exatamente onde estou gastando.',
                nota: 5
              },
              {
                nome: 'João Pedro',
                cargo: 'Freelancer',
                texto: 'Perfeito para quem trabalha como freelancer. Consigo separar receitas de diferentes projetos e acompanhar tudo em tempo real.',
                nota: 5
              },
              {
                nome: 'Ana Costa',
                cargo: 'Contadora',
                texto: 'Recomendo para todos os meus clientes! A exportação para Excel é profissional e economiza horas de trabalho.',
                nota: 5
              }
            ].map((depoimento, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(depoimento.nota)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{depoimento.texto}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{depoimento.nome}</p>
                    <p className="text-sm text-gray-600">{depoimento.cargo}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Escolha o plano ideal para você
            </h2>
            <p className="text-xl text-gray-600">
              Comece grátis e faça upgrade quando precisar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-500 shadow-xl' 
                    : 'bg-white border-2 border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      MAIS POPULAR
                    </span>
                  </div>
                )}
                
                {plan.desconto && (
                  <div className="absolute -top-4 right-4">
                    <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {plan.desconto}
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.nome}</h3>
                
                <div className="mb-6">
                  {plan.precoOriginal && (
                    <p className="text-gray-500 line-through text-lg">
                      De R$ {plan.precoOriginal.toFixed(2).replace('.', ',')}
                    </p>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-gray-900">
                      R$ {plan.preco.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-gray-600">/{plan.periodo}</span>
                  </div>
                  {plan.precoMensal && (
                    <p className="text-sm text-gray-600 mt-2">
                      Equivalente a <strong>R$ {plan.precoMensal.toFixed(2).replace('.', ',')}/mês</strong>
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.recursos.map((recurso, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{recurso}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.popular
                      ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  Começar Agora
                </button>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              ✓ 7 dias de teste grátis • ✓ Cancele quando quiser • ✓ Garantia de 30 dias
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para transformar suas finanças?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a milhares de pessoas que já estão no controle total do seu dinheiro
          </p>
          <button
            onClick={() => navigate('/registro')}
            className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-xl inline-flex items-center gap-2"
          >
            Começar Gratuitamente
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-blue-100 text-sm mt-4">
            Sem compromisso • Cancele quando quiser
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="bg-blue-500 p-2 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Controle Financeiro</span>
            </div>
            <div className="flex gap-8 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Suporte</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2025 Controle Financeiro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

# 📁 ESTRUTURA COMPLETA DO PROJETO

## 🗂️ LOCALIZAÇÃO DO CÓDIGO

**Tudo está em:** `/app/`

---

## 📂 ESTRUTURA DE DIRETÓRIOS

```
/app/
│
├── 📁 backend/                        # BACKEND (FastAPI + Python)
│   ├── server.py                      # ⭐ Código principal do backend
│   ├── requirements.txt               # Dependências Python
│   └── .env                          # Variáveis de ambiente
│
├── 📁 frontend/                       # FRONTEND (React + Tailwind)
│   │
│   ├── 📁 src/                       # Código-fonte React
│   │   │
│   │   ├── 📁 pages/                # ⭐ PÁGINAS PRINCIPAIS
│   │   │   ├── LandingPage.js       # Landing page de vendas
│   │   │   ├── Login.js             # Tela de login
│   │   │   ├── Registro.js          # Tela de cadastro
│   │   │   ├── Dashboard.js         # Dashboard principal
│   │   │   ├── Receitas.js          # Gestão de receitas
│   │   │   ├── Despesas.js          # Gestão de despesas
│   │   │   ├── Categorias.js        # Gestão de categorias
│   │   │   ├── ResumoMensal.js      # Resumo mensal
│   │   │   ├── Projecoes.js         # Projeções financeiras
│   │   │   └── Checkout.js          # Página de checkout
│   │   │
│   │   ├── 📁 components/           # Componentes reutilizáveis
│   │   │   └── ProtectedRoute.js    # Proteção de rotas
│   │   │
│   │   ├── 📁 context/              # Context API
│   │   │   └── AuthContext.js       # ⭐ Contexto de autenticação
│   │   │
│   │   ├── 📁 hooks/                # Custom hooks
│   │   │   └── use-toast.js         # Hook de notificações
│   │   │
│   │   ├── 📁 lib/                  # Utilitários
│   │   │   └── utils.js             # Funções auxiliares
│   │   │
│   │   ├── App.js                   # ⭐ App principal + rotas
│   │   ├── App.css                  # Estilos globais
│   │   ├── index.js                 # Entry point
│   │   └── index.css                # Estilos base
│   │
│   ├── 📁 public/                   # Arquivos públicos
│   │   └── index.html               # HTML base
│   │
│   ├── package.json                 # Dependências Node.js
│   ├── tailwind.config.js           # Configuração Tailwind
│   ├── postcss.config.js            # Configuração PostCSS
│   ├── craco.config.js              # Configuração Craco
│   ├── jsconfig.json                # Config JavaScript
│   └── .env                         # Variáveis de ambiente
│
├── 📁 tests/                         # Testes (opcional)
│   └── __init__.py
│
├── 📄 GUIA_COMPLETO_PUBLICACAO_HOTMART.md  # ⭐ Guia de deploy
├── 📄 GUIA_HOTMART.md                     # Guia de integração
├── 📄 ESTRUTURA_DO_PROJETO.md             # Este arquivo
└── 📄 README.md                           # Documentação geral
```

---

## 🔑 ARQUIVOS PRINCIPAIS (MAIS IMPORTANTES)

### **BACKEND:**
1. **`/app/backend/server.py`** (2.500+ linhas)
   - Todos os endpoints da API
   - Autenticação (JWT)
   - CRUD de receitas, despesas, categorias
   - Dashboard e relatórios
   - Webhook da Hotmart
   - Exportação Excel

### **FRONTEND:**
2. **`/app/frontend/src/App.js`**
   - Configuração de rotas
   - Layout principal
   - Provider de autenticação

3. **`/app/frontend/src/context/AuthContext.js`**
   - Login/Logout
   - Gerenciamento de token
   - Estado global de usuário

4. **`/app/frontend/src/pages/LandingPage.js`**
   - Página de vendas
   - 3 planos
   - CTAs

5. **`/app/frontend/src/pages/Dashboard.js`**
   - Dashboard principal
   - Gráficos
   - Filtros de data
   - Gastos recorrentes

---

## 📦 COMO BAIXAR TODO O CÓDIGO

### **OPÇÃO 1: Via Git (Recomendado)**

Se você conectou com GitHub:
```bash
git clone https://github.com/SEU_USUARIO/seu-repo.git
cd seu-repo
```

### **OPÇÃO 2: Download Direto (Emergent)**

No painel da Emergent:
1. Vá em "Files" ou "Workspace"
2. Clique em "Download Project"
3. Ou use o botão "Save to GitHub"

### **OPÇÃO 3: Copiar Manualmente**

Você pode copiar arquivo por arquivo usando a interface da Emergent.

---

## 🚀 PARA FAZER DEPLOY

### **1. Subir para o GitHub**
```bash
# No terminal da Emergent ou local
cd /app
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/SEU_USUARIO/controle-financeiro.git
git push -u origin main
```

### **2. Deploy Backend (Railway)**
1. Conecte Railway ao GitHub
2. Selecione o repositório
3. Configure root directory: `/backend`
4. Railway faz deploy automático

### **3. Deploy Frontend (Vercel)**
1. Conecte Vercel ao GitHub
2. Selecione o repositório
3. Configure root directory: `/frontend`
4. Build command: `yarn build`
5. Output directory: `build`

---

## 📝 VARIÁVEIS DE AMBIENTE

### **Backend (`/app/backend/.env`)**
```env
MONGO_URL=mongodb+srv://usuario:senha@cluster.mongodb.net/financeiro
DB_NAME=financeiro
JWT_SECRET_KEY=sua-chave-secreta-aqui
CORS_ORIGINS=https://seu-dominio.vercel.app
```

### **Frontend (`/app/frontend/.env`)**
```env
REACT_APP_BACKEND_URL=https://seu-backend.railway.app
```

---

## 📊 ESTATÍSTICAS DO PROJETO

```
Total de Arquivos Principais: ~25
Linhas de Código (estimativa):
- Backend:  ~2.500 linhas (Python)
- Frontend: ~3.500 linhas (JavaScript/React)
- Total:    ~6.000 linhas

Funcionalidades:
✅ Autenticação completa (JWT)
✅ Dashboard com gráficos
✅ CRUD de receitas/despesas/categorias
✅ Filtros avançados por data
✅ Gastos recorrentes
✅ Projeções financeiras
✅ Exportação Excel
✅ Landing page de vendas
✅ Sistema de checkout
✅ Integração Hotmart (webhook)
✅ Multi-tenant (isolamento por usuário)
```

---

## 🔍 ONDE ENCONTRAR CADA FUNCIONALIDADE

| Funcionalidade | Arquivo Backend | Arquivo Frontend |
|----------------|-----------------|------------------|
| **Login/Registro** | `server.py` (linha ~170) | `pages/Login.js`, `pages/Registro.js` |
| **Dashboard** | `server.py` (linha ~450) | `pages/Dashboard.js` |
| **Receitas** | `server.py` (linha ~280) | `pages/Receitas.js` |
| **Despesas** | `server.py` (linha ~330) | `pages/Despesas.js` |
| **Categorias** | `server.py` (linha ~240) | `pages/Categorias.js` |
| **Gastos Recorrentes** | `server.py` (linha ~530) | `pages/Dashboard.js` (linha ~250) |
| **Projeções** | `server.py` (linha ~600) | `pages/Projecoes.js` |
| **Export Excel** | `server.py` (linha ~650) | `pages/Dashboard.js` (botão) |
| **Webhook Hotmart** | `server.py` (linha ~190) | - |
| **Landing Page** | - | `pages/LandingPage.js` |
| **Checkout** | `server.py` (linha ~360) | `pages/Checkout.js` |

---

## 💾 BACKUP DO CÓDIGO

**Recomendação:** Faça backup regularmente!

### **Método 1: GitHub (Automático)**
```bash
git add .
git commit -m "Backup $(date)"
git push
```

### **Método 2: Download Local**
1. Use "Save to GitHub" na Emergent
2. Clone o repositório no seu computador
3. Mantenha cópias locais

---

## 🆘 SE PRECISAR RECUPERAR

Se algo der errado, você sempre pode:
1. Acessar este workspace da Emergent
2. Ou clonar do GitHub (se salvou)
3. Ou usar os guias em `/app/GUIA_*.md` para recriar

---

## 📞 PRECISA DO CÓDIGO?

**Tudo está em `/app/`**

Para visualizar qualquer arquivo:
```bash
# No terminal
cat /app/backend/server.py           # Ver backend
cat /app/frontend/src/App.js         # Ver frontend
ls -la /app/                         # Listar tudo
```

Ou use a interface da Emergent para navegar pelos arquivos! 📂

---

**🎉 Seu código está completo e organizado!**

# 🚀 GUIA COMPLETO: PUBLICAR APLICAÇÃO WEB NA HOTMART

## 📋 VISÃO GERAL

Você vai publicar sua aplicação web de controle financeiro como um **SaaS (Software as a Service)** na Hotmart, onde clientes pagam uma assinatura mensal/semestral/anual para acessar.

**Planos:**
- 💙 Mensal: R$ 24,90/mês
- 💚 Semestral: R$ 119,40 (6x R$ 19,90)
- 💜 Anual: R$ 202,80 (12x R$ 16,90)

---

## PARTE 1: DEPLOY DA APLICAÇÃO WEB

### OPÇÃO A: VERCEL (Recomendado - Mais Fácil) ✅

#### 1. Preparar o Código para Deploy

**1.1. Criar conta no GitHub** (se não tiver)
- Acesse: https://github.com
- Crie uma conta gratuita

**1.2. Subir código para o GitHub**
```bash
# No seu computador/terminal
cd /app
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/SEU_USUARIO/controle-financeiro.git
git push -u origin main
```

#### 2. Deploy do Backend (Railway)

**2.1. Criar conta no Railway**
- Acesse: https://railway.app
- Faça login com GitHub
- Clique em "New Project"

**2.2. Deploy do Backend**
1. Selecione "Deploy from GitHub repo"
2. Escolha seu repositório
3. Selecione a pasta `/backend`
4. Railway detecta automaticamente que é FastAPI

**2.3. Configurar Variáveis de Ambiente**
Vá em "Variables" e adicione:
```
MONGO_URL=mongodb+srv://seu_usuario:sua_senha@cluster.mongodb.net/financeiro
DB_NAME=financeiro
JWT_SECRET_KEY=sua-chave-secreta-super-forte-aqui-123456789
CORS_ORIGINS=https://seu-dominio.vercel.app
```

**2.4. Obter URL do Backend**
- Railway vai gerar algo como: `https://seu-app.railway.app`
- **COPIE ESSA URL!** Você vai precisar

#### 3. Configurar MongoDB Atlas (Banco de Dados)

**3.1. Criar conta no MongoDB Atlas**
- Acesse: https://cloud.mongodb.com
- Crie uma conta gratuita (Free Tier)

**3.2. Criar um Cluster**
1. Clique em "Build a Database"
2. Escolha "FREE" (M0)
3. Escolha a região: São Paulo (ou mais próxima)
4. Clique em "Create"

**3.3. Configurar Acesso**
1. **Database Access:**
   - Crie um usuário (ex: `admin`)
   - Senha forte (copie!)
   - Permissão: "Atlas admin"

2. **Network Access:**
   - Clique em "Add IP Address"
   - Escolha "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirme

**3.4. Obter Connection String**
1. Clique em "Connect"
2. "Connect your application"
3. Copie a string:
```
mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
4. Substitua `<password>` pela sua senha
5. Adicione o nome do banco: `/financeiro` antes do `?`

Exemplo final:
```
mongodb+srv://admin:minhasenha123@cluster0.xxxxx.mongodb.net/financeiro?retryWrites=true&w=majority
```

#### 4. Deploy do Frontend (Vercel)

**4.1. Criar conta no Vercel**
- Acesse: https://vercel.com
- Faça login com GitHub

**4.2. Deploy do Frontend**
1. Clique em "Add New Project"
2. Selecione seu repositório do GitHub
3. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `yarn build`
   - **Output Directory**: `build`

**4.3. Variáveis de Ambiente**
Adicione em "Environment Variables":
```
REACT_APP_BACKEND_URL=https://seu-app.railway.app
```
(Use a URL que você copiou do Railway!)

**4.4. Deploy!**
- Clique em "Deploy"
- Aguarde 2-3 minutos
- Vercel vai gerar uma URL tipo: `https://controle-financeiro.vercel.app`

#### 5. Testar a Aplicação

1. Acesse sua URL do Vercel
2. Vá para `/registro`
3. Crie uma conta teste
4. Verifique se consegue fazer login
5. Teste adicionar receitas/despesas

---

### OPÇÃO B: Servidor VPS (Alternativa Avançada)

Se preferir um servidor próprio:
- Use DigitalOcean, Linode ou AWS
- Instale Docker
- Configure Nginx como proxy reverso
- Certifique-se de ter HTTPS (Let's Encrypt)

---

## PARTE 2: CONFIGURAR PRODUTOS NA HOTMART

### 1. Acessar Hotmart

1. Entre em: https://app.hotmart.com
2. Faça login com sua conta
3. Vá em: **Produtos** → **Meus Produtos**

### 2. Criar Produto MENSAL (R$ 24,90/mês)

**2.1. Informações Básicas**
1. Clique em "Criar Novo Produto"
2. Preencha:
   - **Nome**: Controle Financeiro - Plano Mensal
   - **Tipo de Produto**: **Assinatura** (importante!)
   - **Categoria**: Negócios e Carreiras > Software
   - **Subcategoria**: Aplicativos

**2.2. Precificação**
- **Preço**: R$ 24,90
- **Frequência de cobrança**: Mensal
- **Cobrar imediatamente**: SIM
- **Duração**: Até cancelar (indeterminado)
- **Período de teste**: 7 dias (opcional)

**2.3. Formas de Pagamento**
Habilite todas:
- ✅ Cartão de crédito (até 12x)
- ✅ PIX
- ✅ Boleto
- ✅ PayPal

**2.4. Após Criação**
- **COPIE O PRODUCT ID**: algo como `2654321`
- **COPIE O LINK DE CHECKOUT**: `https://pay.hotmart.com/A12345678B`

### 3. Criar Produto SEMESTRAL (R$ 119,40)

Repita o processo:
- **Nome**: Controle Financeiro - Plano Semestral (6 Meses)
- **Tipo**: Assinatura ou Pagamento Único
- **Preço**: R$ 119,40
- **Frequência**: A cada 6 meses (ou pagamento único)
- **Descrição**: "6 meses de acesso completo. Equivale a R$ 19,90/mês. Economia de 20%."

**Copie:**
- Product ID
- Link de checkout

### 4. Criar Produto ANUAL (R$ 202,80)

Repita:
- **Nome**: Controle Financeiro - Plano Anual (12 Meses)
- **Preço**: R$ 202,80
- **Frequência**: Anual (ou pagamento único)
- **Descrição**: "12 meses completos. Equivale a R$ 16,90/mês. Melhor economia: 32% OFF!"

**Copie:**
- Product ID
- Link de checkout

---

## PARTE 3: CONFIGURAR WEBHOOK

### 1. O que é o Webhook?

O webhook permite que a Hotmart notifique sua aplicação quando:
- Cliente faz uma compra ✅
- Cliente cancela assinatura ❌
- Pagamento é aprovado 💰
- Pagamento falha ⚠️

### 2. Configurar na Hotmart

1. Vá em: **Ferramentas** → **Webhook**
2. Clique em "Novo Webhook"

**Configure:**
```
URL do Webhook: https://seu-app.railway.app/api/webhook/hotmart
Versão: v2 (mais recente)
Formato: JSON
```

**Eventos para Notificar** (marque todos):
- ✅ PURCHASE_COMPLETE
- ✅ PURCHASE_CANCELED
- ✅ PURCHASE_REFUNDED
- ✅ SUBSCRIPTION_CANCELLATION
- ✅ SUBSCRIPTION_REACTIVATION

3. Clique em "Salvar"

### 3. Testar o Webhook

1. Clique em "Testar Webhook"
2. Escolha evento: PURCHASE_COMPLETE
3. Clique em "Enviar"
4. Verifique se retornou "200 OK"

---

## PARTE 4: ATUALIZAR CÓDIGO COM IDS DA HOTMART

### 1. Editar arquivo backend/server.py

Conecte via SSH no Railway ou edite localmente e faça push:

**Linha ~290 - Mapear Product IDs:**
```python
plano_map = {
    "2654321": "mensal",      # ← Seu Product ID Mensal
    "2654322": "semestral",   # ← Seu Product ID Semestral
    "2654323": "anual"        # ← Seu Product ID Anual
}
```

**Linha ~360 - Links de Checkout:**
```python
checkout_links = {
    "mensal": "https://pay.hotmart.com/A12345678B",      # ← Seu link Mensal
    "semestral": "https://pay.hotmart.com/B23456789C",   # ← Seu link Semestral
    "anual": "https://pay.hotmart.com/C34567890D"        # ← Seu link Anual
}
```

### 2. Fazer Deploy das Mudanças

**Se estiver usando Git + Railway:**
```bash
git add .
git commit -m "Atualizar IDs da Hotmart"
git push
```

Railway faz deploy automático!

---

## PARTE 5: CONFIGURAR PÁGINA DE VENDAS

### Opção 1: Landing Page Própria (Recomendado)

**URL da sua landing page:**
```
https://controle-financeiro.vercel.app/landing
```

**Configure na Hotmart:**
1. Vá em: **Produtos** → **Seu Produto**
2. Aba: **Página de Vendas**
3. Escolha: **Página Externa**
4. Cole a URL: `https://controle-financeiro.vercel.app/landing`

### Opção 2: Página da Hotmart

Use o editor da Hotmart para criar uma página simples.

---

## PARTE 6: CONFIGURAR EMAILS AUTOMÁTICOS

### 1. Email de Boas-Vindas

1. Vá em: **Produtos** → **Seu Produto** → **Emails**
2. Ative "Email de Boas-Vindas"
3. Personalize:

**Sugestão de texto:**
```
Olá [NOME],

Seja bem-vindo(a) ao Controle Financeiro! 🎉

Sua assinatura do Plano [PLANO] foi confirmada com sucesso!

Acesse agora mesmo:
👉 https://controle-financeiro.vercel.app/login

Seu email de acesso: [EMAIL]
(Use a mesma senha que você cadastrou)

📊 O que você pode fazer:
✅ Dashboard completo com gráficos
✅ Controle de receitas e despesas ilimitado
✅ Análise de gastos recorrentes
✅ Projeções financeiras
✅ Exportar relatórios para Excel

Dúvidas? Responda este email!

Abraço,
Equipe Controle Financeiro
```

### 2. Email de Cancelamento

Configure também para quando o cliente cancelar.

---

## PARTE 7: TESTAR FLUXO COMPLETO

### 1. Modo Sandbox (Teste)

1. Na Hotmart, ative o **Modo Sandbox**:
   - **Ferramentas** → **Sandbox**
   - Ative para seus produtos

2. Faça uma compra teste:
   - Acesse sua landing page
   - Clique em um plano
   - Use dados de teste da Hotmart

### 2. Verificar se Funcionou

**Checklist:**
- [ ] Compra foi registrada na Hotmart
- [ ] Webhook foi enviado para sua aplicação
- [ ] Usuário foi atualizado no banco (plano alterado)
- [ ] Email de boas-vindas foi enviado
- [ ] Cliente consegue fazer login
- [ ] Dashboard carrega normalmente

---

## PARTE 8: DESATIVAR SANDBOX E PUBLICAR

### 1. Desativar Modo Teste

1. **Ferramentas** → **Sandbox**
2. Desative para todos os produtos

### 2. Solicitar Aprovação (se necessário)

A Hotmart pode revisar seu produto. Aguarde aprovação (24-48h).

### 3. Divulgar!

Agora você pode divulgar:
```
🎯 Landing Page: https://controle-financeiro.vercel.app/landing
💳 Checkout Direto: Use os links da Hotmart
📱 Redes Sociais: Compartilhe!
```

---

## PARTE 9: DIVULGAÇÃO E VENDAS

### Estratégias de Divulgação

**1. Orgânico (Gratuito):**
- Instagram/TikTok mostrando o dashboard
- YouTube com tutorial de uso
- LinkedIn para público empresarial
- Blog com artigos sobre finanças

**2. Pago (Investir):**
- Facebook/Instagram Ads
- Google Ads
- Anúncios no YouTube
- Parcerias com influencers

**3. Conteúdo:**
- "Como organizar suas finanças em 2025"
- "Dashboard financeiro gratuito" (trial)
- "Excel vs Sistema Online: qual melhor?"

---

## PARTE 10: MONITORAMENTO

### Métricas para Acompanhar

1. **Hotmart Dashboard:**
   - Vendas por dia
   - Taxa de conversão
   - Cancelamentos

2. **Google Analytics** (opcional):
   - Visitas na landing page
   - Taxa de cliques nos planos

3. **MongoDB:**
   - Número de usuários ativos
   - Uso médio por usuário

---

## TROUBLESHOOTING COMUM

### Problema: Webhook não funciona
**Solução:**
- Verifique se a URL está correta
- Teste manualmente no Postman
- Veja logs do Railway: `railway logs`

### Problema: Cliente pagou mas não tem acesso
**Solução:**
- Verifique se o email dele está no banco
- Veja se o webhook foi recebido (logs)
- Ative manualmente: edite no MongoDB

### Problema: Erro ao fazer login
**Solução:**
- Limpe cache do navegador
- Verifique variável REACT_APP_BACKEND_URL
- Teste a API diretamente

---

## CUSTOS MENSAIS ESTIMADOS

**Deploy Gratuito (início):**
- Railway: $5/mês (primeiros meses grátis)
- Vercel: Gratuito
- MongoDB Atlas: Gratuito (até 512MB)
- **Total: ~$5/mês**

**Com Domínio Próprio:**
- Domínio .com.br: R$ 40/ano (~R$ 3/mês)
- **Total: ~R$ 20/mês**

**Taxas Hotmart:**
- 9,9% + R$ 1,49 por venda
- Ex: Venda de R$ 24,90 = R$ 2,46 + R$ 1,49 = ~R$ 3,95 de taxa

---

## RECEITA ESTIMADA

**Cenário 1: Conservador (20 vendas/mês)**
- 15 mensais (R$ 24,90) = R$ 373,50
- 3 semestrais (R$ 119,40) = R$ 358,20
- 2 anuais (R$ 202,80) = R$ 405,60
- **Total bruto: R$ 1.137,30/mês**
- Descontando Hotmart (~10%): **~R$ 1.023/mês**

**Cenário 2: Moderado (50 vendas/mês)**
- **~R$ 2.500/mês líquido**

**Cenário 3: Otimista (100 vendas/mês)**
- **~R$ 5.000/mês líquido**

---

## CHECKLIST FINAL ANTES DE PUBLICAR

- [ ] Aplicação deployada e funcionando
- [ ] 3 produtos criados na Hotmart
- [ ] Product IDs atualizados no código
- [ ] Links de checkout atualizados
- [ ] Webhook configurado e testado
- [ ] Emails automáticos configurados
- [ ] Compra teste realizada com sucesso
- [ ] Modo Sandbox desativado
- [ ] Landing page acessível
- [ ] SSL ativo (HTTPS)
- [ ] Contas de teste criadas e funcionando

---

## 🎉 PRONTO PARA VENDER!

Sua aplicação está **100% configurada** e pronta para receber clientes pagantes!

**Próximo passo:** Comece a divulgar e faça suas primeiras vendas! 🚀

---

**Suporte:**
- Hotmart: https://atendimento.hotmart.com
- Railway: https://railway.app/help
- Vercel: https://vercel.com/docs

**Boa sorte com as vendas! 💰**

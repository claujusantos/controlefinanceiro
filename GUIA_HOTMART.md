# 🚀 GUIA COMPLETO DE INTEGRAÇÃO COM HOTMART

## 📋 ÍNDICE
1. [Configuração dos Produtos na Hotmart](#1-configuração-dos-produtos-na-hotmart)
2. [Configuração do Webhook](#2-configuração-do-webhook)
3. [Atualização dos Links no Código](#3-atualização-dos-links-no-código)
4. [Testando a Integração](#4-testando-a-integração)
5. [Fluxo Completo de Compra](#5-fluxo-completo-de-compra)

---

## 1. CONFIGURAÇÃO DOS PRODUTOS NA HOTMART

### Passo 1: Acessar o Painel da Hotmart
1. Entre em: https://app.hotmart.com
2. Vá em: **Produtos** → **Meus Produtos**

### Passo 2: Criar os 3 Produtos (Planos)

#### PRODUTO 1: Plano Básico (R$ 19,90/mês)
1. Clique em **"Criar Novo Produto"**
2. Preencha:
   - **Nome**: Controle Financeiro - Plano Básico
   - **Tipo**: Assinatura/Recorrência
   - **Categoria**: Software/Aplicativos
   - **Preço**: R$ 19,90
   - **Frequência**: Mensal
   - **Descrição**: Plano básico com dashboard completo e controle de até 50 transações/mês

3. **Copie o Product ID** (vai precisar!)
   - Ex: `12345678` ou similar

#### PRODUTO 2: Plano Profissional (R$ 39,90/mês)
1. Repita o processo acima com:
   - **Nome**: Controle Financeiro - Plano Profissional
   - **Preço**: R$ 39,90
   - **Frequência**: Mensal
   - **Descrição**: Plano completo com transações ilimitadas, análises e projeções

2. **Copie o Product ID**

#### PRODUTO 3: Plano Anual (R$ 299/ano)
1. Repita o processo com:
   - **Nome**: Controle Financeiro - Plano Anual
   - **Preço**: R$ 299,00
   - **Frequência**: Anual (ou pagamento único)
   - **Descrição**: 12 meses com 37% de desconto

2. **Copie o Product ID**

---

## 2. CONFIGURAÇÃO DO WEBHOOK

### Passo 1: Gerar URL do Webhook
Sua URL de webhook será:
```
https://SEU_DOMINIO.com/api/webhook/hotmart
```

**Importante**: Substitua `SEU_DOMINIO.com` pelo domínio real da sua aplicação.

### Passo 2: Configurar na Hotmart
1. Acesse: **Ferramentas** → **Webhook**
2. Clique em **"Novo Webhook"**
3. Configure:
   - **URL**: `https://SEU_DOMINIO.com/api/webhook/hotmart`
   - **Eventos para Notificar**:
     - ✅ PURCHASE_COMPLETE (Compra Aprovada)
     - ✅ PURCHASE_CANCELED (Compra Cancelada)
     - ✅ PURCHASE_REFUNDED (Reembolso)
     - ✅ SUBSCRIPTION_CANCELLATION (Cancelamento de Assinatura)
   - **Formato**: JSON
   - **Versão**: v2 (mais recente)

4. Clique em **"Salvar"**

### Passo 3: Testar o Webhook
1. Use o botão **"Testar Webhook"** no painel da Hotmart
2. Verifique se chegou no seu servidor (veja os logs)

---

## 3. ATUALIZAÇÃO DOS LINKS NO CÓDIGO

### Passo 1: Atualizar IDs dos Produtos no Backend
Abra o arquivo `/app/backend/server.py` e encontre esta seção:

```python
# Identificar o plano baseado no product_id da Hotmart
plano_map = {
    # Você vai preencher com os IDs reais dos seus produtos na Hotmart
    "PRODUCT_ID_BASICO": "basico",
    "PRODUCT_ID_PRO": "pro",
    "PRODUCT_ID_ANUAL": "anual"
}
```

**Substitua** pelos IDs reais:
```python
plano_map = {
    "12345678": "basico",      # ← Seu Product ID do Plano Básico
    "23456789": "pro",         # ← Seu Product ID do Plano Pro
    "34567890": "anual"        # ← Seu Product ID do Plano Anual
}
```

### Passo 2: Atualizar Links de Checkout
No mesmo arquivo, encontre:

```python
checkout_links = {
    "basico": "https://pay.hotmart.com/SEU_PRODUTO_BASICO",
    "pro": "https://pay.hotmart.com/SEU_PRODUTO_PRO",
    "anual": "https://pay.hotmart.com/SEU_PRODUTO_ANUAL"
}
```

**Substitua** pelos links reais da Hotmart:

1. Na Hotmart, vá em **Produtos** → **Seu Produto**
2. Copie o **"Link de Checkout"** (algo como: `https://pay.hotmart.com/A12345678B`)
3. Cole no código:

```python
checkout_links = {
    "basico": "https://pay.hotmart.com/A12345678B",
    "pro": "https://pay.hotmart.com/B23456789C",
    "anual": "https://pay.hotmart.com/C34567890D"
}
```

### Passo 3: Reiniciar o Backend
```bash
sudo supervisorctl restart backend
```

---

## 4. TESTANDO A INTEGRAÇÃO

### Teste 1: Link de Checkout
1. Acesse sua landing page: `https://SEU_DOMINIO.com/landing`
2. Clique em **"Começar Agora"** em qualquer plano
3. Verifique se é redirecionado para a página da Hotmart

### Teste 2: Compra Teste (Hotmart Sandbox)
1. Na Hotmart, ative o **"Modo Sandbox"** (Ferramentas → Sandbox)
2. Faça uma compra teste
3. Verifique se o webhook foi recebido
4. Confirme se o usuário foi atualizado no banco de dados

### Teste 3: Verificar Logs
```bash
tail -f /var/log/supervisor/backend.err.log
```

Procure por:
- `Erro no webhook Hotmart:` (se houver erro)
- Eventos de webhook recebidos

---

## 5. FLUXO COMPLETO DE COMPRA

### Fluxo do Cliente:
```
1. Cliente acessa a Landing Page
   ↓
2. Seleciona um plano
   ↓
3. Clica em "Começar Agora"
   ↓
4. Faz login/registro (se necessário)
   ↓
5. É redirecionado para a Hotmart
   ↓
6. Completa o pagamento na Hotmart
   ↓
7. Hotmart envia webhook para seu servidor
   ↓
8. Backend atualiza assinatura do usuário
   ↓
9. Cliente recebe email de confirmação
   ↓
10. Cliente acessa o dashboard com plano ativo
```

### Fluxo Técnico do Webhook:
```
1. Hotmart → POST /api/webhook/hotmart
   ↓
2. Backend identifica o evento (PURCHASE_COMPLETE)
   ↓
3. Backend busca usuário pelo email
   ↓
4. Backend atualiza:
   - plano: "pro"
   - status_assinatura: "active"
   - data_expiracao: +30 dias
   ↓
5. Backend cria registro na collection "assinaturas"
   ↓
6. Retorna sucesso para Hotmart
```

---

## 6. CONFIGURAÇÕES ADICIONAIS RECOMENDADAS

### Página de Obrigado (Thank You Page)
1. Na Hotmart, configure a **"Página de Obrigado"**:
   ```
   https://SEU_DOMINIO.com/?payment=success
   ```

2. Crie uma página de confirmação no frontend que exibe:
   - "Pagamento confirmado!"
   - "Acesse seu dashboard agora"
   - Botão para ir ao dashboard

### Email de Boas-Vindas
1. Configure na Hotmart: **Ferramentas** → **Emails Automáticos**
2. Crie email personalizado com:
   - Boas-vindas
   - Link de acesso: `https://SEU_DOMINIO.com/login`
   - Instruções de uso

### Página de Vendas Personalizada
1. Use a landing page criada como página principal
2. Configure na Hotmart para redirecionar para sua landing

---

## 7. TROUBLESHOOTING

### Webhook não está funcionando?
1. Verifique se a URL está correta
2. Teste com o botão "Testar Webhook" da Hotmart
3. Verifique os logs do backend
4. Certifique-se que a rota `/api/webhook/hotmart` não requer autenticação

### Usuário não foi atualizado após pagamento?
1. Verifique se o email do comprador existe no banco
2. Veja os logs para erros
3. Confirme que o Product ID está correto no código

### Link de checkout não funciona?
1. Verifique se copiou o link correto da Hotmart
2. Teste o link diretamente no navegador
3. Confirme que o produto está ativo na Hotmart

---

## 8. CHECKLIST FINAL

Antes de colocar no ar:

- [ ] Todos os 3 produtos criados na Hotmart
- [ ] Product IDs atualizados no código
- [ ] Links de checkout atualizados
- [ ] Webhook configurado e testado
- [ ] Compra teste realizada com sucesso
- [ ] Email de boas-vindas configurado
- [ ] Página de obrigado configurada
- [ ] Modo Sandbox desativado (produção)
- [ ] SSL configurado (HTTPS)
- [ ] Logs funcionando corretamente

---

## 9. SUPORTE

Se tiver problemas:
1. Verifique a documentação da Hotmart: https://developers.hotmart.com
2. Teste o webhook no Postman/Insomnia
3. Revise os logs do backend
4. Entre em contato com o suporte da Hotmart

---

**🎉 Pronto! Seu sistema de pagamentos está configurado!**

Qualquer dúvida, consulte este guia ou a documentação oficial da Hotmart.

# 📦 Sistema de Controle de Peças e Fornecedores

## 🎯 Visão Geral

Sistema web completo para gerenciamento de peças e notificação automática de fornecedores, integrado com **Power Automate** para envio de e-mails de cobrança.

---

## 📂 Estrutura do Projeto

```
siteluiz/
├── index.html          # Estrutura HTML (Navbar, 3 Abas, Modais, Footer)
├── styles.css          # Estilos customizados (Tailwind + customizações)
├── app.js              # Lógica JavaScript (gerenciamento, APIs, localStorage)
├── README.md           # Este arquivo
└── data.json           # (Opcional) Dados iniciais mockados
```

---

## 🚀 Como Usar

### 1. **Abrir o Site**
   - Abra `index.html` em um navegador (Chrome, Edge, Firefox)
   - Ou publique em um servidor web

### 2. **Navegação**
   - **📊 Dashboard**: Visualiza métricas e alertas urgentes
   - **📋 Gestão de Peças**: Visualiza, edita, adiciona e remove peças
   - **📜 Histórico**: Auditoria de e-mails enviados

---

## 🎨 Funcionalidades

### **Dashboard (Aba 1)**
- ✅ Cards de métricas (Total, Entregues, Não fornecidas, Notificados)
- ✅ Tabela de alertas urgentes (peças não fornecidas)
- ✅ Botão para notificar todos os fornecedores pendentes em lote

### **Gestão de Peças (Aba 2)**
- ✅ Busca por nome, código ou fornecedor
- ✅ Filtro por status (Todos, Fornecida, Não fornecida)
- ✅ Adicionar nova peça (Modal)
- ✅ Editar peça existente (Modal pré-preenchido)
- ✅ Disparar e-mail individual para fornecedor
- ✅ Deletar peça
- ✅ Coloração: Verde = Fornecida, Vermelho = Não fornecida

### **Histórico de Alertas (Aba 3)**
- ✅ Auditoria completa de todos os e-mails enviados
- ✅ Coluna de status (Sucesso/Falha)
- ✅ Persistência dos últimos 100 registros

---

## 🔌 Integração com Power Automate

### **Passo 1: Configurar o Webhook no Power Automate**

1. Acesse [Power Automate](https://make.powerautomate.com/)
2. Crie um novo **Cloud Flow** → **Instant cloud flow**
3. Escolha o gatilho: **When an HTTP request is received**
4. Deixe o campo **JSON Schema** vazio (Power Automate preencherá automaticamente)
5. Adicione as ações:
   - **Get rows (Excel Online)**: Conecte à sua planilha
   - **Apply to each**: Itere sobre as linhas
   - **Send an email (Outlook)**: Configure o template de e-mail

### **Passo 2: Obter a URL do Webhook**

1. Salve o fluxo
2. Copie a **URL do HTTP POST** gerada
3. Cole em `app.js` na variável `POWER_AUTOMATE_WEBHOOK_URL`:

```javascript
const POWER_AUTOMATE_WEBHOOK_URL = "https://prod-XX.westeurope.logic.azure.com/workflows/.../triggers/manual/paths/invoke?...";
```

### **Passo 3: Testar a Integração**

1. Clique em "Disparar E-mail" em uma peça não fornecida
2. Verifique se a requisição chegou ao Power Automate
3. Valide se o e-mail foi enviado para o fornecedor

---

## 📊 Estrutura de Dados

### **Peça (Objeto)**
```javascript
{
  id: 1,                          // ID único
  codigo: "P001",                 // Código da peça
  nome: "Parafuso M8",            // Nome descritivo
  fornecedor: "Fornecedor XYZ",   // Nome do fornecedor
  email: "contato@xyz.com",       // E-mail para notificação
  status: "Não fornecida"         // "Fornecida" ou "Não fornecida"
}
```

### **Histórico (Objeto)**
```javascript
{
  dataHora: "15/08/2026 14:30:45",
  peca: "Parafuso M8",
  fornecedor: "Fornecedor XYZ",
  emailDestino: "contato@xyz.com",
  status: "Sucesso"               // "Sucesso" ou "Falha"
}
```

---

## 🔐 Persistência de Dados

- Todos os dados são salvos em **LocalStorage** do navegador
- Máximo de 100 registros de histórico (para evitar limite de storage)
- Limpar dados: Abra o DevTools (F12) → Console → `localStorage.clear()`

---

## 🎯 Payload Enviado ao Power Automate

Quando você clica em "Disparar E-mail", este JSON é enviado:

```json
{
  "nomePeca": "Parafuso M8",
  "codigoPeca": "P001",
  "fornecedor": "Fornecedor XYZ",
  "emailFornecedor": "contato@xyz.com",
  "dataEnvio": "2026-08-15T14:30:45.123Z"
}
```

---

## 🛠️ Customizações

### **Mudar Cores**
- Edite `styles.css` para alterar cores das badges e botões
- Cores padrão: Azul (azul-600), Verde (green-600), Vermelho (red-600)

### **Adicionar Novas Peças Iniciais**
- Edite o array `pecas` em `app.js` com seus dados

### **Mudar Nome/Logo**
- Edite o título em `index.html` (linha 17)
- Altere o emoji 📦 por outro de sua preferência

### **Ajustar Timeout do Toast**
- Em `app.js`, função `mostrarToast()`, altere o valor em `setTimeout()`

---

## 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| E-mails não estão sendo enviados | Verifique se a URL do Power Automate está correta em `app.js` |
| Dados sumiram ao recarregar | Verifique as configurações de localStorage do navegador |
| Filtro não funciona | Limpe o localStorage e recarregue a página |
| Modal não fecha | Verifique se o `id` do modal está correto |
| Indicador de conexão sempre vermelho | É apenas simulação; cheque a conexão real ao Power Automate |

---

## 📋 Checklist de Implementação

- [ ] Configurar URL do Power Automate Webhook
- [ ] Testar envio individual de e-mail
- [ ] Testar notificação em lote
- [ ] Validar histórico de alertas
- [ ] Personalizar cores/branding
- [ ] Treinar usuários finais
- [ ] Fazer backup dos dados (exportar localStorage)

---

## 💡 Dicas Úteis

1. **Exportar Histórico**: Use `JSON.stringify(historicoAlertas)` no console
2. **Importar Peças em Lote**: Modifique `app.js` para ler de um arquivo JSON
3. **Notificações em Tempo Real**: Integre com WebSockets para atualizar automaticamente
4. **Relatórios**: Adicione um botão para gerar PDF com o histórico

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique o console do navegador (F12 → Console)
2. Valide a estrutura dos dados em localStorage
3. Teste a URL do Power Automate com Postman/Insomnia

---

**Desenvolvido com ❤️ para gerenciamento eficiente de peças e fornecedores**

Versão: 1.0.0  
Última atualização: 15/08/2026

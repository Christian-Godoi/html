# 🎯 Guia de Início Rápido v2.0

## ⚡ Primeiros 10 Minutos

### 1. **Abra o Site**
```powershell
# Navegue até a pasta
cd c:\Users\chris\Documents\siteluiz

# Abra index.html no navegador
# (Clique duplo ou arraste para o navegador)
```

### 2. **Faça Login** 🔐
```
Tela de Login aparecerá automaticamente:

Usuário: admin
Senha:   123456

[Clique em "Entrar"]
```

### 3. **Explore o Dashboard** 📊
Você verá 5 abas:
- **📊 Dashboard** - Métricas e alertas
- **📋 Gestão** - Gerenciar peças
- **🔧 Admin** - Adicionar produtos
- **📊 Excel** - Upload de Excel
- **📜 Histórico** - Log de e-mails

### 4. **Adicione uma Peça** (opcional)
- Clique em **"📋 Gestão"**
- Clique em **"+ Nova Peça"**
- Preencha os campos:
  - Código: `P001`
  - Nome: `Parafuso M8`
  - Fornecedor: `Fornecedor XYZ`
  - E-mail: `seu-email@teste.com`
  - Status: `Não fornecida`
- Clique em **"Salvar"**

### 5. **Configure Power Automate** (Importante!)
- Siga o guia: [POWER_AUTOMATE_SETUP.md](POWER_AUTOMATE_SETUP.md)
- Copie a URL do webhook
- Cole em `app.js` (linha 8)

### 6. **Teste com Excel** 📊
1. Crie um Excel com colunas:
   ```
   Peça | Fornecedor | E-mail | Status
   P001 | Metal SP   | metal@... | Não fornecida
   ```

2. Clique na aba **"📊 Excel"**
3. Arraste o arquivo para a área cinza (ou clique)
4. Clique **"✅ Analisar Excel"**
5. Clique **"📧 Disparar E-mails"**
6. Confirme

**Pronto! Os e-mails são disparados! 🎉**

---

## 🔐 Login & Admin

### Mudar Credenciais
Edit `app.js` (linhas 4-5):
```javascript
const ADMIN_USER = "seu_usuario";
const ADMIN_PASSWORD = "sua_senha";
```

### Gerenciar Produtos
1. Clique na aba **"🔧 Admin"**
2. Preencha o formulário
3. Clique **"➕ Adicionar"**
4. Produtos aparecem na tabela

---

## 📁 Arquivos do Projeto

| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Estrutura (Login, Abas, Modais) |
| `app.js` | Lógica (Login, Admin, Excel, Emails) |
| `styles.css` | Estilos e customizações |
| `data.json` | Dados de exemplo (opcional) |
| `README.md` | Documentação principal |
| `LOGIN_ADMIN_EXCEL_GUIDE.md` | 🆕 Guia de Login, Admin e Excel |
| `POWERSHELL_GUIDE.md` | 🆕 Automação com PowerShell |
| `CHANGELOG.md` | 🆕 Histórico de mudanças |
| `POWER_AUTOMATE_SETUP.md` | Webhook do Power Automate |
| `QUICK_START.md` | Este arquivo |
| `EXCEL_INTEGRATION.md` | Integração com Excel/SharePoint |
| `DEPLOYMENT.md` | Publicação em servidores |
| `QUICK_START.md` | Este arquivo |

---

## 🎨 Navegação do Site

### **Navbar (Topo)**
```
[Logo] Sistema de Controle de Peças | [Indicador] Conectado | [Botões] 📊 📋 📜 | 👤 Admin
```

### **Abas Disponíveis**

#### 📊 **Dashboard**
- Visualização de métricas
- 4 cards com contadores
- Tabela de alertas urgentes
- Botão para notificar todos

#### 📋 **Gestão de Peças**
- Busca e filtros
- Tabela com todas as peças
- Ações: Editar, Enviar E-mail, Deletar

#### 📜 **Histórico**
- Auditoria de e-mails enviados
- Status de sucesso/falha
- Data e hora de cada envio

---

## 🔧 Operações Comuns

### ➕ Adicionar Peça
1. Clique em **"+ Nova Peça"**
2. Preencha o formulário
3. Clique em **"Salvar"**
4. Peça aparecerá na tabela

### ✏️ Editar Peça
1. Na aba "Gestão de Peças", clique no botão ✏️
2. Altere os dados desejados
3. Clique em **"Salvar"**

### 📧 Enviar E-mail Individual
1. Na aba "Gestão de Peças"
2. Localize a peça não fornecida
3. Clique no botão 📧
4. Aguarde a notificação de sucesso

### 📧 Enviar E-mails em Lote
1. Na aba "Dashboard"
2. Clique em **"Notificar Todos os Pendentes"**
3. Confirme na janela de diálogo
4. E-mails serão disparados para todos os fornecedores

### 🗑️ Deletar Peça
1. Na aba "Gestão de Peças", clique no botão 🗑️
2. Confirme a deleção
3. Peça será removida

### 🔍 Buscar Peça
1. Use o campo de busca na aba "Gestão de Peças"
2. Digite nome, código ou fornecedor
3. Tabela será filtrada em tempo real

---

## 💾 Salvamento de Dados

- ✅ Dados salvos automaticamente no **LocalStorage**
- ✅ Histórico persiste ao recarregar o navegador
- ✅ Máximo 100 registros de histórico (proteção)
- ⚠️ Limpar cache do navegador = perder dados

### Backup Manual
```javascript
// Cole no console (F12 → Console)
const backup = JSON.stringify({
    pecas: localStorage.getItem("pecasData"),
    historico: localStorage.getItem("historicoData")
});
console.log(backup);
// Copie e salve em um arquivo .json
```

### Restaurar Dados
```javascript
// Cole no console
const backup = {/* seus dados aqui */};
localStorage.setItem("pecasData", backup.pecas);
localStorage.setItem("historicoData", backup.historico);
// Recarregue a página
```

---

## 🌐 Conexão com Power Automate

### Status de Conexão
- 🟢 **Verde**: Conectado e pronto
- 🔴 **Vermelho**: Desconectado (simula falha)

### Verificar Webhook
```powershell
# Teste a URL do webhook com curl
$url = "https://prod-XX.westeurope.logic.azure.com/workflows/.../triggers/manual/paths/invoke"
$body = @{
    nomePeca = "Teste"
    fornecedor = "Teste"
    emailFornecedor = "test@test.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
```

---

## 📱 Compatibilidade

| Navegador | Suportado |
|-----------|-----------|
| Chrome | ✅ |
| Firefox | ✅ |
| Edge | ✅ |
| Safari | ✅ |
| Internet Explorer | ❌ |

### Responsivo
- ✅ Desktop (1920x1080)
- ✅ Tablet (768px)
- ⚠️ Mobile (redimensiona, mas otimizado para desktop)

---

## 🐛 Dicas de Troubleshooting

### "E-mail não é enviado"
1. Verifique a URL do Power Automate em `app.js`
2. Teste manualmente o webhook (veja seção acima)
3. Verifique se a peça está com status "Não fornecida"
4. Abra F12 → Console para ver erros

### "Dados sumiram"
1. Verificar se localStorage foi limpo
2. Restaurar dados do backup (veja seção acima)
3. Recarregar a página (Ctrl+Shift+Delete)

### "Modal não aparece"
1. Abra Console (F12)
2. Digite `document.getElementById("modalPeca").classList.remove("hidden")`
3. Verifique se há erros JavaScript

### "Tabela vazia"
1. Clique em **"+ Nova Peça"** para adicionar dados
2. Verifique o filtro de status
3. Limpe o campo de busca

---

## 📊 Dados de Exemplo

O sistema vem com **5 peças de exemplo** pré-carregadas:

| Código | Nome | Fornecedor | Status |
|--------|------|------------|--------|
| P001 | Parafuso M8 Inox | Metalúrgica SP | ⚠️ |
| P002 | Porca M8 | Fornecimentos Industriais | ✅ |
| P003 | Arruela Inox | Distribuidora de Metais | ⚠️ |
| P004 | Rebite Pop | Soluções em Fixação | ✅ |
| P005 | Parafuso Métrico M10 | Tech Parts | ⚠️ |

**Nota**: Você pode deletar esses dados e adicionar os seus!

---

## 🎓 Próximos Passos

1. ✅ Testar o site localmente (feito!)
2. ⬜ Configurar Power Automate
3. ⬜ Testar envio de e-mails
4. ⬜ Integrar com Excel/SharePoint
5. ⬜ Publicar em servidor (Azure, GitHub Pages, etc.)
6. ⬜ Treinar usuários finais

---

## 📞 Suporte e Ajuda

### Recursos
- **README.md** - Documentação completa
- **POWER_AUTOMATE_SETUP.md** - Configuração Power Automate
- **EXCEL_INTEGRATION.md** - Integração com Excel
- **DEPLOYMENT.md** - Publicação do site

### Verificar Erros
1. Abra DevTools: **F12**
2. Vá para aba **"Console"**
3. Você verá mensagens de erro (se houver)
4. Copie e pesquise no Google

### Limpar Dados (Reset)
```javascript
// Cole no console (F12 → Console)
localStorage.clear();
// Recarregue a página
```

---

## ✨ Destaques Principais

- ✅ **Interface Intuitiva**: Fácil para usuários finais
- ✅ **Responsivo**: Adapta-se a diferentes telas
- ✅ **Rápido**: LocalStorage = sem servidor necessário
- ✅ **Seguro**: Dados locais do navegador
- ✅ **Integrado**: Power Automate + Excel + Outlook
- ✅ **Auditável**: Histórico completo de ações

---

**Divirta-se gerenciando suas peças! 🎉**

*Última atualização: 15/08/2026*

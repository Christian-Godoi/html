# ⚙️ Guia de Integração com Excel e SharePoint

## 🎯 Objetivo
Sincronizar os dados do site com uma planilha Excel hospedada no OneDrive ou SharePoint para gerenciamento centralizado.

---

## 📂 Opção 1: Usando Excel Online + Power Automate (Recomendado)

### Passo 1: Preparar o Excel
1. Crie uma planilha em `OneDrive for Business` ou `SharePoint`
2. Nomeie como `PecasFornecedores.xlsx`
3. Crie uma tabela com as colunas:
   - **Código** (texto)
   - **Nome da Peça** (texto)
   - **Fornecedor** (texto)
   - **E-mail do Fornecedor** (e-mail)
   - **Status** (texto: Fornecida / Não fornecida)
   - **Data da Requisição** (data)
   - **Data do Prazo** (data)
   - **Última Notificação** (data/hora)

### Passo 2: Vincular ao Power Automate
1. No seu fluxo Power Automate, adicione a ação **"Get rows (Excel Online)"**
2. Configure:
   - **Location**: Selecione sua pasta OneDrive/SharePoint
   - **Document Library**: Docs ou SharePoint Library
   - **File**: `PecasFornecedores.xlsx`
   - **Table**: Selecione a tabela criada

### Passo 3: Sincronizar Dados no Site
Adicione este código em `app.js` para carregar dados do Excel:

```javascript
// Função para carregar dados do Excel via Power Automate
async function carregarDadosDoExcel() {
    const excelURL = "https://seu-sharepoint.com/sites/sua-pasta/_api/web/lists/GetByTitle('Peças')/items";
    
    try {
        const response = await fetch(excelURL, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + await obterTokenMS(),
                "Accept": "application/json"
            }
        });

        if (response.ok) {
            const dados = await response.json();
            pecas = dados.value.map(item => ({
                id: item.ID,
                codigo: item.Codigo,
                nome: item.Nome_x0020_da_x0020_Peça,
                fornecedor: item.Fornecedor,
                email: item.Email_x0020_do_x0020_Fornecedor,
                status: item.Status
            }));
            
            salvarDadosLocais();
            renderizarTabelaPecas();
            mostrarToast("✅ Dados sincronizados do Excel!", "success");
        }
    } catch (erro) {
        console.error("Erro ao carregar dados do Excel:", erro);
        mostrarToast("❌ Erro ao sincronizar com Excel", "error");
    }
}
```

---

## 🔄 Opção 2: Sincronização Bidirecional

### Passo 1: Detectar Mudanças no Site
```javascript
// Função para salvar peça no Excel quando criada/editada
async function salvarPecaNoExcel(peca) {
    const excelURL = "https://seu-sharepoint.com/sites/sua-pasta/_api/web/lists/GetByTitle('Peças')/items";
    
    try {
        const response = await fetch(excelURL, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + await obterTokenMS(),
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                Codigo: peca.codigo,
                Nome_x0020_da_x0020_Peça: peca.nome,
                Fornecedor: peca.fornecedor,
                Email_x0020_do_x0020_Fornecedor: peca.email,
                Status: peca.status
            })
        });

        if (response.ok) {
            console.log("✅ Peça salva no Excel");
            mostrarToast("✅ Peça sincronizada com Excel!", "success");
        }
    } catch (erro) {
        console.error("Erro ao salvar no Excel:", erro);
    }
}
```

### Passo 2: Atualizar Status no Excel
Integre a função acima em `salvarPeca()`:

```javascript
function salvarPeca(e) {
    e.preventDefault();
    
    const novaPeca = {
        codigo: document.getElementById("inputCodigo").value,
        nome: document.getElementById("inputNomePeca").value,
        fornecedor: document.getElementById("inputFornecedor").value,
        email: document.getElementById("inputEmail").value,
        status: document.getElementById("inputStatus").value
    };

    // Adicionar ao site
    pecas.push(novaPeca);
    salvarDadosLocais();
    
    // Sincronizar com Excel
    salvarPecaNoExcel(novaPeca); // ← Nova linha
    
    // ... resto do código
}
```

---

## 📊 Opção 3: Usando API REST do SharePoint

### Autenticação
```javascript
// Obter token de autenticação Microsoft
async function obterTokenMS() {
    const tokenURL = "https://login.microsoftonline.com/seu-tenant-id/oauth2/v2.0/token";
    
    const params = new URLSearchParams({
        client_id: "SEU_CLIENT_ID",
        client_secret: "SEU_CLIENT_SECRET",
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials"
    });

    try {
        const response = await fetch(tokenURL, {
            method: "POST",
            body: params
        });

        const dados = await response.json();
        return dados.access_token;
    } catch (erro) {
        console.error("Erro ao obter token:", erro);
    }
}
```

### Ler Dados
```javascript
async function lerLinhasExcel() {
    const token = await obterTokenMS();
    const apiURL = "https://graph.microsoft.com/v1.0/sites/site-id/lists/list-id/items";

    try {
        const response = await fetch(apiURL, {
            headers: {
                "Authorization": "Bearer " + token,
                "Accept": "application/json"
            }
        });

        const dados = await response.json();
        return dados.value;
    } catch (erro) {
        console.error("Erro:", erro);
    }
}
```

---

## 🚀 Opção 4: Automação com Power Automate (Recomendado)

### Criar Fluxo de Sincronização

**Gatilho**: `Scheduled` (diariamente às 9h)

**Ações**:
1. **Get rows (Excel Online)**
   - Arquivo: `PecasFornecedores.xlsx`
   - Tabela: `Peças`

2. **Apply to each** (para cada linha)
   - Dentro: Comparar com histórico do site
   
3. **Send notification to Power Apps** (sincronizar com site)
   - Ou usar **HTTP POST** para chamar uma API do site

### Fluxo Inverso (Site → Excel)

**Gatilho**: `When an HTTP request is received` (webhook do site)

**Ações**:
1. **Parse JSON** (dados recebidos)
2. **Add a row into a table** (Excel Online)
   - Mapear campos automaticamente

---

## 📱 Integração Sem Power Automate (Usando CORS)

Se preferir comunicação direta (avançado):

```javascript
// Função auxiliar para requisições com CORS
async function requisicaoExcel(metodo, dados) {
    const sheetURL = "https://sheets.googleapis.com/v4/spreadsheets/YOUR_SHEET_ID/values/Peças!A:F";
    
    try {
        const response = await fetch(sheetURL, {
            method: metodo,
            headers: {
                "Authorization": "Bearer " + ACCESS_TOKEN,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        return await response.json();
    } catch (erro) {
        console.error("Erro CORS:", erro);
    }
}
```

**Nota**: CORS requer configuração no servidor e token de acesso válido.

---

## 🔒 Segurança na Integração

### Boas Práticas:
1. ✅ **Nunca** coloque credenciais no `app.js`
2. ✅ Use variáveis de ambiente ou `config.json` (não versionado)
3. ✅ Implemente autenticação OAuth 2.0
4. ✅ Valide e sanitize os dados antes de enviar
5. ✅ Use HTTPS em todas as requisições

### Arquivo `config.js` (não versionado):
```javascript
// config.js - ADICIONAR AO .gitignore
const CONFIG = {
    CLIENT_ID: "seu-client-id",
    TENANT_ID: "seu-tenant-id",
    SHAREPOINT_SITE: "https://seu-sharepoint.com/sites/sua-pasta",
    EXCEL_FILE: "PecasFornecedores.xlsx",
    EXCEL_TABLE: "Peças"
};
```

---

## 📋 Checklist de Implementação

- [ ] Criar planilha no OneDrive/SharePoint
- [ ] Configurar tabela com colunas corretas
- [ ] Testar leitura de dados do Excel
- [ ] Testar criação de novo item no Excel
- [ ] Validar sincronização bidirecional
- [ ] Implementar tratamento de erros
- [ ] Adicionar logs de sincronização
- [ ] Treinar usuários finais

---

## 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| 401 - Não autorizado | Verifique token e permissões no SharePoint |
| 403 - Acesso negado | Adicione permissões à aplicação no Azure AD |
| Dados não sincronizam | Verifique se a tabela Excel existe e tem o nome correto |
| Erro CORS | Configure CORS no SharePoint ou use Power Automate |
| Timeout | Aumente o limite ou use paginação para grandes volumes |

---

**Com essa integração, você terá uma solução completa e escalável!** 🎉

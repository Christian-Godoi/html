# 💾 Guia de Backup & Restauração de Dados

## 📋 Visão Geral

Este guia explica como:
- ✅ Fazer backup de seus dados
- ✅ Exportar para arquivo
- ✅ Restaurar dados
- ✅ Migrar entre navegadores/computadores

---

## 🔍 Onde os Dados são Salvos?

Todos os dados são armazenados em **localStorage** do navegador:

```javascript
// Dados salvos em localStorage
pecasData         // Array de peças
produtosData      // Array de produtos  
historicoData     // Array de histórico de e-mails
usuarioLogado     // Usuário atual
```

### Localização por Navegador

**Chrome/Edge (Windows)**
```
C:\Users\[usuario]\AppData\Local\Google\Chrome\User Data\Default\Local Storage
C:\Users\[usuario]\AppData\Local\Microsoft\Edge\User Data\Default\Local Storage
```

**Firefox (Windows)**
```
C:\Users\[usuario]\AppData\Roaming\Mozilla\Firefox\Profiles\[profile]\storage
```

**Safari (macOS)**
```
~/Library/Safari/LocalStorage
```

---

## 💾 Método 1: Exportar via Console (Simples)

### Passo a Passo

1. **Abra o Navegador e Faça Login**
   - Acesse o site
   - Faça login com admin/123456

2. **Abra Console do Navegador**
   - Pressione `F12` ou `Ctrl+Shift+I`
   - Clique na aba **"Console"**

3. **Copie e Cole Este Código**

```javascript
// Exportar todos os dados
const backup = {
  pecas: JSON.parse(localStorage.getItem("pecasData") || "[]"),
  produtos: JSON.parse(localStorage.getItem("produtosData") || "[]"),
  historico: JSON.parse(localStorage.getItem("historicoData") || "[]"),
  dataBackup: new Date().toISOString()
};

// Mostrar e copiar
console.log("Backup gerado:");
console.log(JSON.stringify(backup, null, 2));

// Copiar para clipboard
copy(JSON.stringify(backup, null, 2));
console.log("✅ Backup copiado para clipboard!");
```

4. **Salve o Resultado**
   - Clique direito no console → Salvar como
   - OU crie um arquivo `backup.json` e cole o conteúdo

---

## 📤 Método 2: Exportar via Arquivo HTML

Crie um arquivo `backup.html` para facilitar:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Backup - Sistema de Peças</title>
    <style>
        body { font-family: Arial; padding: 20px; background: #f5f5f5; }
        button { padding: 10px 20px; margin: 5px; cursor: pointer; background: #2563eb; color: white; border: none; border-radius: 5px; }
        textarea { width: 100%; height: 300px; font-family: monospace; padding: 10px; }
    </style>
</head>
<body>
    <h1>💾 Backup de Dados</h1>
    
    <h2>Exportar</h2>
    <button onclick="exportarBackup()">📥 Exportar Dados</button>
    
    <h2>Dados</h2>
    <textarea id="textareaBackup" placeholder="Os dados aparecerão aqui..."></textarea>
    
    <h2>Salvar como Arquivo</h2>
    <button onclick="salvarArquivo()">💾 Salvar como JSON</button>
    
    <h2>Restaurar de Arquivo</h2>
    <input type="file" id="inputArquivo" accept=".json">
    <button onclick="restaurarArquivo()">📤 Restaurar</button>
    
    <script>
        function exportarBackup() {
            const backup = {
                pecas: JSON.parse(localStorage.getItem("pecasData") || "[]"),
                produtos: JSON.parse(localStorage.getItem("produtosData") || "[]"),
                historico: JSON.parse(localStorage.getItem("historicoData") || "[]"),
                dataBackup: new Date().toISOString()
            };
            
            document.getElementById("textareaBackup").value = JSON.stringify(backup, null, 2);
            alert("✅ Backup exportado!");
        }
        
        function salvarArquivo() {
            const conteudo = document.getElementById("textareaBackup").value;
            if (!conteudo) {
                alert("❌ Faça um backup primeiro!");
                return;
            }
            
            const elemento = document.createElement('a');
            elemento.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(conteudo));
            elemento.setAttribute('download', 'backup_' + new Date().getTime() + '.json');
            elemento.style.display = 'none';
            document.body.appendChild(elemento);
            elemento.click();
            document.body.removeChild(elemento);
            alert("✅ Arquivo salvo!");
        }
        
        function restaurarArquivo() {
            const file = document.getElementById("inputArquivo").files[0];
            if (!file) {
                alert("❌ Selecione um arquivo!");
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const backup = JSON.parse(e.target.result);
                    
                    if (confirm("Deseja restaurar? Isso vai sobrescrever os dados atuais.")) {
                        localStorage.setItem("pecasData", JSON.stringify(backup.pecas || []));
                        localStorage.setItem("produtosData", JSON.stringify(backup.produtos || []));
                        localStorage.setItem("historicoData", JSON.stringify(backup.historico || []));
                        alert("✅ Dados restaurados com sucesso!");
                        location.reload();
                    }
                } catch (erro) {
                    alert("❌ Erro ao ler arquivo: " + erro.message);
                }
            };
            reader.readAsText(file);
        }
    </script>
</body>
</html>
```

**Como usar:**
1. Salve o código acima como `backup.html`
2. Coloque na mesma pasta do `index.html`
3. Abra `backup.html` em um navegador
4. Use os botões para exportar/restaurar

---

## 📥 Método 3: Restaurar via Console

Se você tem um backup em JSON:

```javascript
// Passo 1: Abra o Console (F12)

// Passo 2: Cole este código com seus dados
const backupRestaurar = {
  pecas: [...],  // Cole o array aqui
  produtos: [...],
  historico: [...]
};

// Passo 3: Restaure
localStorage.setItem("pecasData", JSON.stringify(backupRestaurar.pecas));
localStorage.setItem("produtosData", JSON.stringify(backupRestaurar.produtos));
localStorage.setItem("historicoData", JSON.stringify(backupRestaurar.historico));

console.log("✅ Dados restaurados!");
location.reload();
```

---

## 🔄 Método 4: Sincronizar Entre Navegadores

### Chrome para Firefox (Exemplo)

1. **No Chrome:**
   - Abra Console (F12)
   - Execute código para exportar
   - Copie o resultado

2. **No Firefox:**
   - Abra Console (F12)
   - Cole o código de restauração
   - Pronto!

---

## 🖥️ Migrar para Outro Computador

### Usando Arquivo de Backup

1. **Computador Antigo:**
   - Abra `index.html`
   - Faça login
   - Faça backup (Console ou arquivo HTML)
   - Salve o arquivo `backup_XXXX.json`

2. **Transportar:**
   - Envie por e-mail
   - Copie por pen drive
   - Sincronize na nuvem

3. **Computador Novo:**
   - Abra `index.html`
   - Abra `backup.html`
   - Clique "Restaurar"
   - Selecione o arquivo
   - Pronto!

---

## 🔐 Backup em Nuvem

### Google Drive

```javascript
// Exportar para Google Drive
// Usando Google Apps Script

const dados = JSON.stringify({
  pecas: JSON.parse(localStorage.getItem("pecasData")),
  produtos: JSON.parse(localStorage.getItem("produtosData")),
  historico: JSON.parse(localStorage.getItem("historicoData"))
});

// Salvar em Drive via Apps Script
function salvarEmDrive() {
  const blob = Blob.createFromString(dados, 'application/json');
  const file = DriveApp.createFile('backup_' + new Date().getTime() + '.json', blob);
  console.log('✅ Salvo em:', file.getUrl());
}
```

### OneDrive

```javascript
// Similar ao Google Drive, usar Microsoft Graph API
```

### Dropbox

```javascript
// Usar API do Dropbox para sincronizar
```

---

## 📊 Verificar Tamanho de Dados

```javascript
// No Console, execute:
const size = JSON.stringify(localStorage).length;
console.log('Tamanho total:', size, 'bytes');
console.log('Tamanho em MB:', (size / 1024 / 1024).toFixed(2), 'MB');

// Limite típico: 5-10MB por navegador
```

---

## 🗑️ Limpar Dados Locais

**⚠️ Cuidado: Isso vai deletar tudo!**

```javascript
// Método 1: Via Console
localStorage.clear();
console.log("✅ Dados deletados!");
location.reload();

// Método 2: Via Navegador
// Chrome: Ctrl+Shift+Delete → Local Storage → Delete
// Firefox: Ctrl+Shift+Delete → Cookies and Site Data → Clear
```

---

## 🛡️ Melhores Práticas

### ✅ Faça Backup Regularmente
- Semanalmente se usar ativamente
- Mensalmente se usar esporadicamente
- Antes de grandes atualizações

### ✅ Use Vários Backups
```
backup_2026_08_15.json   ← Semanal
backup_2026_08_22.json   ← Semanal
backup_2026_08_29.json   ← Semanal
backup_2026_mensal.json  ← Mensal
```

### ✅ Teste Restauração
1. Faça um backup
2. Limpe os dados
3. Restaure do backup
4. Verifique se tudo está OK

### ❌ Evite
- Não deixe backups em abas
- Não compartilhe arquivos com dados sensíveis
- Não misture backups de diferentes versões
- Não confie apenas em localStorage

---

## 🔄 Sincronizar com Backend (Futuro)

Quando migrar para versão com banco de dados:

```javascript
// Enviar dados para servidor
async function syncParaServidor() {
  const dados = {
    pecas: JSON.parse(localStorage.getItem("pecasData")),
    produtos: JSON.parse(localStorage.getItem("produtosData")),
    historico: JSON.parse(localStorage.getItem("historicoData"))
  };
  
  const response = await fetch('/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  
  return response.json();
}
```

---

## 🐛 Troubleshooting

### "Backup não aparece"
```javascript
// Verifique se há dados
console.log(localStorage);

// Se vazio, você pode ter sido deslogado
localStorage.setItem("usuarioLogado", "admin");
location.reload();
```

### "Não consegui restaurar"
```javascript
// Verifique o formato JSON
JSON.parse(backupString);  // Deve não gerar erro
```

### "Erro de tamanho"
```javascript
// localStorage tem limite de 5-10MB
// Se exceder, delete histórico antigo
const historico = JSON.parse(localStorage.getItem("historicoData"));
localStorage.setItem("historicoData", JSON.stringify(historico.slice(-50)));
```

---

## 📞 Suporte

Se tiver problemas:
1. Leia o FAQ.md
2. Verifique Console (F12)
3. Veja a documentação completa
4. Tente restaurar de um backup anterior

---

**Guia de Backup v1.0**  
*Sistema de Controle de Peças*  
Data: 15/08/2026

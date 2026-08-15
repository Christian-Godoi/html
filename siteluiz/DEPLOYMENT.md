# 🚀 Guia de Deployment e Publicação

## 📋 Sumário
1. [Localmente (Teste)](#localmente)
2. [Servidor Web Simples](#servidor-web-simples)
3. [Azure App Service](#azure-app-service)
4. [GitHub Pages](#github-pages)
5. [Checklist Final](#checklist-final)

---

## 🖥️ Localmente (Teste)

### Opção 1: Abrir Diretamente no Navegador
```powershell
# Windows - Abrir Explorer
explorer "c:\Users\chris\Documents\siteluiz"

# Depois, clique com botão direito em index.html → Abrir com Navegador
```

### Opção 2: Usar Python (Recomendado)
```powershell
# Navegue até a pasta do projeto
cd c:\Users\chris\Documents\siteluiz

# Python 3
python -m http.server 8000

# Ou Python 2
python -m SimpleHTTPServer 8000

# Abra no navegador
# http://localhost:8000
```

### Opção 3: Usar Node.js (http-server)
```powershell
# Instalar globalmente
npm install -g http-server

# Rodar servidor
cd c:\Users\chris\Documents\siteluiz
http-server -p 8000

# Acesse: http://localhost:8000
```

### Opção 4: Visual Studio Code Live Server
1. Instale a extensão **"Live Server"** no VS Code
2. Clique com botão direito em `index.html` → **"Open with Live Server"**
3. O navegador abrirá em `http://127.0.0.1:5500`

---

## 🌐 Servidor Web Simples

### Usar IIS Express (Windows)
```powershell
# Instale IIS Express (já vem com Visual Studio)
# Ou baixe em: https://www.microsoft.com/en-us/download/details.aspx?id=48217

# Navegue até a pasta
cd c:\Users\chris\Documents\siteluiz

# Inicie o servidor
C:\Program Files\IIS Express\iisexpress.exe /path:. /port:8080

# Acesse: http://localhost:8080
```

### Usar Apache (Windows)
1. Instale XAMPP: https://www.apachefriends.org/
2. Copie a pasta `siteluiz` para `C:\xampp\htdocs\`
3. Abra: `http://localhost/siteluiz`

---

## ☁️ Azure App Service (Recomendado para Produção)

### Passo 1: Preparar Projeto
```powershell
# Certifique-se de que todos os arquivos estão na pasta
# - index.html
# - app.js
# - styles.css
# - data.json (opcional)
```

### Passo 2: Criar App Service via Portal
1. Acesse [Azure Portal](https://portal.azure.com/)
2. Clique em **"+ Create a resource"**
3. Pesquise **"App Service"** → Create
4. Preencha:
   - **Name**: `meu-site-pecas` (URL única)
   - **Publish**: `Code`
   - **Runtime stack**: `Node.js 18 LTS` (ou static)
   - **Operating System**: `Windows` ou `Linux`
   - **App Service Plan**: `Free` ou `Basic`

### Passo 3: Deploy via Git
```powershell
# Inicializar repositório Git local
cd c:\Users\chris\Documents\siteluiz
git init

# Adicionar todos os arquivos
git add .
git commit -m "Deploy inicial do site"

# Configurar remote do Azure
git remote add azure https://seu-usuario@meu-site-pecas.scm.azurewebsites.net:443/meu-site-pecas.git

# Fazer push
git push azure master

# Acesse: https://meu-site-pecas.azurewebsites.net
```

### Passo 4: Configurar Variáveis de Ambiente
1. No Azure Portal → **Configuration**
2. Adicione a chave:
   - **Name**: `POWER_AUTOMATE_WEBHOOK_URL`
   - **Value**: `https://prod-...`
3. Clique em **Save**

### Passo 5: Verificar Deploy
1. Vá em **Deployment Center** → **GitHub (ou Git)**
2. Acompanhe o status do build
3. Quando terminar, acesse a URL do App Service

---

## 🐙 GitHub Pages (Gratuito)

### Passo 1: Criar Repositório
1. Acesse [GitHub.com](https://github.com)
2. Clique em **"New Repository"**
3. Nome: `siteluiz`
4. Deixe público
5. Clique em **"Create Repository"**

### Passo 2: Push do Código
```powershell
cd c:\Users\chris\Documents\siteluiz
git init
git add .
git commit -m "Primeira versão"
git branch -M main
git remote add origin https://github.com/seu-usuario/siteluiz.git
git push -u origin main
```

### Passo 3: Ativar GitHub Pages
1. Vá em **Settings** do repositório
2. Role até **Pages**
3. Em **Source**, selecione **main branch**
4. Clique em **Save**
5. Sua URL será: `https://seu-usuario.github.io/siteluiz`

### Passo 4: Atualizar Webhook URL
No `app.js`, o webhook URL já estará configurado (não muda).

---

## 📦 Docker (Avançado)

### Criar Dockerfile
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Build e Run
```powershell
# Build da imagem
docker build -t siteluiz:1.0 .

# Rodar container
docker run -p 8080:80 siteluiz:1.0

# Acesse: http://localhost:8080
```

---

## 🔧 Configurações de Produção

### Arquivo `.env` (recomendado)
```env
POWER_AUTOMATE_WEBHOOK_URL=https://prod-XX.westeurope.logic.azure.com/workflows/.../triggers/manual/paths/invoke
NODE_ENV=production
LOG_LEVEL=info
CORS_ORIGIN=https://seu-dominio.com
```

### Arquivo `web.config` (para IIS)
```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Rewrite Root" stopProcessing="true">
          <match url="^$" />
          <action type="Rewrite" url="index.html" />
        </rule>
      </rules>
    </rewrite>
    <staticContent>
      <mimeMap fileExtension=".json" mimeType="application/json" />
    </staticContent>
  </system.webServer>
</configuration>
```

---

## 🔐 Segurança para Produção

### 1. HTTPS Obrigatório
```javascript
// No app.js - Redirecionar HTTP para HTTPS
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
}
```

### 2. Content Security Policy
```html
<!-- No index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' cdn.tailwindcss.com">
```

### 3. Proteger Webhook
```javascript
// Adicionar verificação de autenticação antes de chamar Power Automate
const dispararEmail = async (peca) => {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
        mostrarToast("❌ Você não está autenticado", "error");
        return;
    }
    
    // ... resto do código
};
```

---

## 📊 Monitoramento em Produção

### Azure Application Insights
1. No Azure Portal → **Application Insights**
2. Crie uma instância
3. Adicione o script no `index.html`:
```html
<script type="text/javascript">
var sdkInstance="appInsightsSDK";window[sdkInstance]="appInsights";
var aiName=window.aiName||"appInsights";
// ... (script completo fornecido pelo Azure)
</script>
```

### Verificar Status
```powershell
# Via PowerShell - Testar conexão
$url = "https://seu-site.azurewebsites.net"
Invoke-WebRequest -Uri $url
```

---

## 🧪 Testes Finais (Checklist)

- [ ] Site carrega em menos de 3 segundos
- [ ] Dashboard exibe métricas corretamente
- [ ] Adicionar peça funciona
- [ ] Editar peça funciona
- [ ] Deletar peça funciona
- [ ] Filtros funcionam
- [ ] Modal de notificação aparece
- [ ] E-mail é disparado para Power Automate
- [ ] Histórico registra eventos
- [ ] Dados persistem ao recarregar
- [ ] Indicador de conexão funciona
- [ ] Toast de notificação aparece
- [ ] Site funciona em mobile (responsive)
- [ ] Não há erros no console (F12)

---

## 📈 Performance Optimization

### Minificar Código
```powershell
# Instalar minificadores
npm install -g uglify-js cleanCSS-cli

# Minificar JS
uglifyjs app.js -o app.min.js

# Minificar CSS
cleancss -o styles.min.css styles.css

# Atualizar imports no HTML
# <script src="app.min.js"></script>
# <link rel="stylesheet" href="styles.min.css">
```

### Cache Control
```html
<!-- No head do index.html -->
<meta http-equiv="Cache-Control" content="max-age=31536000">
```

---

## 🆘 Troubleshooting

| Problema | Solução |
|----------|---------|
| 404 - index.html não encontrado | Verifique a estrutura de arquivos |
| Erro CORS | Configure CORS no servidor ou use proxy |
| Webhook retorna 401 | Verifique token e URL do Power Automate |
| Site lento | Minifique código, ative cache, use CDN |
| Dados não carregam | Verifique localStorage e console de erros |

---

## 📞 Suporte Pós-Deployment

### Monitorar Erros
1. Abra DevTools (F12) → **Console**
2. Verifique se há mensagens de erro
3. Salve logs em `localStorage` para auditoria

### Atualizar Código em Produção
```powershell
# Fazer alterações locais
# Fazer commit
git add .
git commit -m "Correção de bugs"
git push azure master

# Ou para GitHub Pages
git push origin main
```

---

**Pronto! Seu site está em produção! 🎉**

Para dúvidas sobre deployment, consulte:
- [Azure App Service Docs](https://docs.microsoft.com/en-us/azure/app-service/)
- [GitHub Pages Docs](https://pages.github.com/)
- [IIS Documentation](https://docs.microsoft.com/en-us/iis/)

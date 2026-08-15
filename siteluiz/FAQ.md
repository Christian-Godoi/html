# ❓ FAQ - Perguntas Frequentes

## 📌 Instalação e Configuração

### P: Como executo o site?
**R**: Existem várias formas:
1. Duplo clique em `index.html`
2. Arrastar `index.html` para o navegador
3. Usar `python -m http.server 8000` (veja DEPLOYMENT.md)
4. VS Code → Live Server Extension

### P: Qual é o navegador recomendado?
**R**: Chrome, Firefox, Edge ou Safari. **Não** funciona no Internet Explorer.

### P: Os dados são salvos na nuvem?
**R**: Não. Dados são salvos localmente no navegador (`localStorage`). Se limpar o cache, perderá os dados.

### P: Como faço backup dos dados?
**R**: Abra Console (F12) e execute:
```javascript
JSON.stringify(localStorage)
```
Copie e salve em um arquivo .txt ou .json

---

## 🔌 Power Automate

### P: Qual é a URL do webhook?
**R**: Varia por ambiente. Siga [POWER_AUTOMATE_SETUP.md](POWER_AUTOMATE_SETUP.md) para obter a sua.

### P: Onde coloco a URL no site?
**R**: Abra `app.js` e procure por:
```javascript
const POWER_AUTOMATE_WEBHOOK_URL = "...";
```

### P: Como testo se o webhook funciona?
**R**: Use o Postman ou Insomnia:
1. Crie uma requisição POST
2. Cole a URL do webhook
3. Body (JSON):
```json
{
  "nomePeca": "Teste",
  "codigoPeca": "T001",
  "fornecedor": "Teste",
  "emailFornecedor": "seu-email@teste.com",
  "dataEnvio": "2026-08-15T14:00:00Z"
}
```
4. Clique em Send

### P: E-mail não está sendo enviado. O que fazer?
**R**: 
1. Verifique se a URL do webhook está correta
2. Abra Console (F12) e veja se há erros
3. Teste manualmente o webhook (veja acima)
4. Verifique se o fluxo Power Automate está ATIVADO
5. Verifique a caixa de SPAM

### P: Posso usar outro serviço de e-mail (Gmail, etc)?
**R**: Sim! Mas será mais complexo. Recomenda-se usar Power Automate + Outlook.

---

## 📊 Dashboard e Dados

### P: Como adiciono uma peça?
**R**: 
1. Clique em **"+ Nova Peça"** na aba "Gestão de Peças"
2. Preencha todos os campos
3. Clique em "Salvar"

### P: Como edito uma peça?
**R**:
1. Na aba "Gestão de Peças", clique no ícone ✏️
2. Altere os dados
3. Clique em "Salvar"

### P: Como deleto uma peça?
**R**:
1. Na aba "Gestão de Peças", clique no ícone 🗑️
2. Confirme a deleção
3. Peça será removida (não há volta!)

### P: Como filtro as peças?
**R**:
1. Use o campo de busca (por nome, código ou fornecedor)
2. Use o dropdown de status (Todos, Fornecida, Não fornecida)
3. Ambos podem ser usados juntos

### P: Quantas peças posso adicionar?
**R**: Teoricamente ilimitado, mas é recomendado máximo 1000 para melhor performance.

### P: Os contadores no Dashboard se atualizam automaticamente?
**R**: Sim! Ao adicionar, editar ou deletar uma peça, os contadores são atualizados imediatamente.

---

## 📧 Envio de E-mails

### P: Como envio um e-mail individual?
**R**:
1. Aba "Gestão de Peças"
2. Localize a peça (status = "Não fornecida")
3. Clique no botão 📧
4. Aguarde a notificação

### P: Como envio e-mails em lote?
**R**:
1. Aba "Dashboard"
2. Clique em **"Notificar Todos os Pendentes"**
3. Confirme a quantia de fornecedores
4. E-mails serão disparados automaticamente

### P: Por que o botão 📧 está desativado?
**R**: Porque a peça já tem status "Fornecida". Você só pode notificar peças não fornecidas.

### P: Posso ver o histórico de e-mails enviados?
**R**: Sim! Aba "Histórico de Alertas" mostra todos os envios com status (Sucesso/Falha).

### P: Quantos registros de histórico são mantidos?
**R**: Máximo 100 registros (para evitar limite de localStorage).

---

## 💾 Persistência e Backup

### P: Quantos dados posso armazenar?
**R**: LocalStorage tem limite de ~5-10 MB, suficiente para ~5000 peças.

### P: O que acontece se limpar o cache do navegador?
**R**: Todos os dados serão perdidos. Por isso, faça backups regularmente!

### P: Como importo dados de um backup?
**R**: Abra Console (F12) e execute:
```javascript
// Seu backup em JSON
const backup = { "pecasData": "...", "historicoData": "..." };
localStorage.setItem("pecasData", backup.pecasData);
localStorage.setItem("historicoData", backup.historicoData);
location.reload();
```

### P: Posso sincronizar dados com Excel?
**R**: Sim! Veja [EXCEL_INTEGRATION.md](EXCEL_INTEGRATION.md) para detalhes.

---

## 🌐 Publicação e Servidores

### P: Como publico o site?
**R**: Várias opções:
- GitHub Pages (grátis)
- Azure App Service
- Servidor próprio (IIS, Apache)
- Veja [DEPLOYMENT.md](DEPLOYMENT.md) para detalhes

### P: O site funciona offline?
**R**: Sim! Dados são salvos localmente. Apenas o envio de e-mails ao Power Automate requer internet.

### P: Preciso de um servidor backend?
**R**: Não! Tudo funciona no navegador (frontend). Power Automate cuida do backend de e-mails.

### P: Como adiciono HTTPS?
**R**: Se publicar no Azure ou GitHub Pages, HTTPS é automático. Veja [DEPLOYMENT.md](DEPLOYMENT.md).

---

## 🎨 Customização

### P: Como mudo as cores?
**R**: Edite `styles.css` e procure por:
- `bg-blue-600` (azul primária)
- `bg-green-600` (sucesso)
- `bg-red-600` (erro)

### P: Como mudo o título/logo?
**R**: Edite `index.html` linha 17:
```html
<h1 class="text-xl font-bold text-gray-800">Seu Novo Título</h1>
```

### P: Como adiciono um menu diferente?
**R**: Edite o HTML da navbar (linhas 24-34 do `index.html`).

### P: Como altero o horário do último timestamp?
**R**: O timestamp atualiza automaticamente. Não pode ser alterado manualmente.

---

## 🐛 Troubleshooting Avançado

### P: Aparecem erros no Console (F12)
**R**: 
1. Abra DevTools (F12)
2. Aba "Console"
3. Copie a mensagem de erro
4. Pesquise no Google ou Stack Overflow
5. Verifique se é erro de digitação em `app.js`

### P: A tabela não carrega
**R**:
1. Abra Console (F12)
2. Digite: `console.log(pecas)`
3. Se retornar `[]`, dados estão vazios
4. Adicione uma peça e tente novamente

### P: Modal não fecha após salvar
**R**: Abra Console e execute:
```javascript
document.getElementById("modalPeca").classList.add("hidden");
```

### P: Site fica lento com muitas peças
**R**:
1. Limite a visualização a 500 peças
2. Use filtros para reduzir dados mostrados
3. Considere usar um backend real (banco de dados)

### P: Botão "Notificar Todos" não funciona
**R**:
1. Verifique se há peças "Não fornecidas"
2. Verifique a URL do Power Automate
3. Abra Console e veja os erros

### P: LocalStorage está cheio
**R**: Execute no Console:
```javascript
// Limpar tudo
localStorage.clear();

// Ou manter apenas histórico recente
let hist = JSON.parse(localStorage.getItem("historicoData"));
hist = hist.slice(-50); // Manter últimos 50
localStorage.setItem("historicoData", JSON.stringify(hist));
```

---

## 🚀 Performance

### P: Como otimizo o site?
**R**:
1. Minifique JS e CSS
2. Use compressão gzip
3. Implemente cache control
4. Veja [DEPLOYMENT.md](DEPLOYMENT.md)

### P: Qual é o tempo de carregamento esperado?
**R**: < 2 segundos em conexão normal (3G/4G/5G).

### P: Como monitoro o uso?
**R**: Use Azure Application Insights (veja [DEPLOYMENT.md](DEPLOYMENT.md)).

---

## 🔐 Segurança

### P: Dados estão seguros no localStorage?
**R**: Relativamente seguro no navegador local. Mas **não** é criptografado. Para maior segurança, use um backend com autenticação.

### P: Como protejo o webhook?
**R**: Implemente autenticação OAuth 2.0 no Power Automate (veja [POWER_AUTOMATE_SETUP.md](POWER_AUTOMATE_SETUP.md)).

### P: Posso adicionar login de usuário?
**R**: Sim! Seria necessário integrar com Azure AD ou outro provedor. Fora do escopo desta versão.

### P: O site coleta dados pessoais?
**R**: Não. Apenas dados de peças e fornecedores (configurados por você).

---

## 📱 Mobile

### P: O site funciona em celular?
**R**: Sim, mas a interface é otimizada para desktop. Mobile ficará com colunas comprimidas.

### P: Como torno responsivo de verdade?
**R**: Edite `styles.css` para adicionar media queries (breakpoints 768px, 1024px).

---

## 🆘 Problemas Comuns

| Problema | Solução |
|----------|---------|
| "Arquivo não encontrado" | Certifique-se que `index.html` está na pasta correta |
| "Webhook retorna 401" | URL expirou, regenere no Power Automate |
| "Sem acesso ao localStorage" | Navegador em modo privado, mude para modo normal |
| "CSS não carrega" | Verifique se `styles.css` está na mesma pasta |
| "Botão não responde" | Abra Console (F12) para ver erros |
| "Toast não aparece" | Verifique se o elemento `#toast` existe no HTML |

---

## 📞 Recursos Adicionais

- **GitHub**: https://github.com
- **Microsoft Power Automate**: https://make.powerautomate.com/
- **Azure Portal**: https://portal.azure.com/
- **Tailwind CSS**: https://tailwindcss.com/
- **MDN Web Docs**: https://developer.mozilla.org/

---

## ✅ Checklist de Troubleshooting

Se algo não funciona, siga este checklist:

1. ✅ Recarregue a página (F5 ou Ctrl+R)
2. ✅ Limpe o cache (Ctrl+Shift+Delete)
3. ✅ Abra Console (F12) e verifique erros
4. ✅ Verifique a URL do Power Automate
5. ✅ Teste manualmente o webhook
6. ✅ Consulte este FAQ
7. ✅ Se ainda não funcionar, salve o erro e pesquise no Google

---

**Não encontrou sua dúvida? Verifique os outros guias:**
- [README.md](README.md) - Documentação Completa
- [QUICK_START.md](QUICK_START.md) - Guia de Início Rápido
- [POWER_AUTOMATE_SETUP.md](POWER_AUTOMATE_SETUP.md) - Configuração PA
- [DEPLOYMENT.md](DEPLOYMENT.md) - Publicação

*Última atualização: 15/08/2026*

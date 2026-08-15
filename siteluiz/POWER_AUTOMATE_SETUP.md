# 🤖 Guia de Configuração do Power Automate

## 📋 Sumário
1. [Criar o Fluxo](#criar-o-fluxo)
2. [Configurar Gatilho HTTP](#configurar-gatilho-http)
3. [Conectar ao Excel](#conectar-ao-excel)
4. [Configurar E-mails](#configurar-emails)
5. [Testar e Validar](#testar-e-validar)
6. [URL do Webhook](#url-do-webhook)

---

## 🚀 Criar o Fluxo

### Passo 1: Acessar Power Automate
1. Vá para [https://make.powerautomate.com/](https://make.powerautomate.com/)
2. Faça login com sua conta Microsoft
3. Clique em **"+ Criar"** no menu esquerdo
4. Selecione **"Fluxo de nuvem instantâneo"** (Instant cloud flow)
5. Escolha o gatilho: **"When an HTTP request is received"**
6. Clique em **"Criar"**

---

## 🔌 Configurar Gatilho HTTP

### Passo 2: Adicionar o Gatilho
1. No Power Automate, você verá um cartão chamado **"When an HTTP request is received"**
2. Neste cartão:
   - **Método**: Selecione `POST`
   - **Corpo do Esquema JSON**: Deixe em branco inicialmente (será preenchido automaticamente)

### Passo 3: Adicionar Ação "Send an email"
1. Clique em **"+ New step"**
2. Pesquise por **"Send an email (V2)"** (Outlook)
3. Selecione a ação **"Send an email (V2)"**

### Configuração do E-mail:
```
Para: emailFornecedor (do payload JSON)
Assunto: Cobrança de Peça Pendente - @{body('triggerBody()').codigoPeca}
Corpo: 
  Prezado(a) @{body('triggerBody()').fornecedor},

  Esperamos pela entrega da seguinte peça:
  
  Código: @{body('triggerBody()').codigoPeca}
  Nome: @{body('triggerBody()').nomePeca}
  
  Por favor, confirme a previsão de entrega.
  
  Atenciosamente,
  Sistema de Controle de Peças
```

---

## 📊 Conectar ao Excel

### Passo 4: (Opcional) Atualizar Planilha
Se quiser atualizar o Excel automaticamente:

1. Clique em **"+ New step"**
2. Pesquise por **"Update a row"** (Excel Online)
3. Configure:
   - **Location**: Selecione sua pasta no OneDrive/SharePoint
   - **Document Library**: Selecione
   - **File**: Escolha a planilha (ex: `PecasFornecedores.xlsx`)
   - **Table**: Selecione a tabela (ex: `Peças`)
   - **Key**: Selecione a coluna de código
   - **Código da Peça**: Mapeie para `codigoPeca`
   - **Status**: Altere para "Notificado" ou similar

---

## 💌 Configurar E-mails

### Passo 5: Template de E-mail Avançado

Para um e-mail mais profissional, use HTML:

```html
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .header { background-color: #2563eb; color: white; padding: 20px; }
    .content { padding: 20px; background-color: #f9fafb; }
    .footer { text-align: center; font-size: 12px; color: #999; padding: 10px; }
    .alert { background-color: #fee2e2; padding: 15px; border-left: 4px solid #991b1b; }
  </style>
</head>
<body>
  <div class="header">
    <h2>🔴 Cobrança de Peça Pendente</h2>
  </div>
  <div class="content">
    <p>Prezado(a) <strong>@{body('triggerBody()').fornecedor}</strong>,</p>
    
    <div class="alert">
      <p><strong>Ainda estamos aguardando a entrega da seguinte peça:</strong></p>
      <ul>
        <li><strong>Código:</strong> @{body('triggerBody()').codigoPeca}</li>
        <li><strong>Nome:</strong> @{body('triggerBody()').nomePeca}</li>
        <li><strong>Data de Notificação:</strong> @{body('triggerBody()').dataEnvio}</li>
      </ul>
    </div>
    
    <p>Por favor, confirme a previsão de entrega ou forneça um status atualizado.</p>
    <p>Agradecemos a atenção!</p>
  </div>
  <div class="footer">
    <p>Sistema de Controle de Peças e Fornecedores</p>
  </div>
</body>
</html>
```

---

## ✅ Testar e Validar

### Passo 6: Teste Manual

1. **Salve o Fluxo**
2. Clique em **"Test"** (no canto superior direito)
3. Escolha **"Manually"**
4. Clique em **"Test"**
5. Na página do teste, clique em **"Run"**
6. **Preencha o Body JSON** com:
```json
{
  "nomePeca": "Parafuso M8",
  "codigoPeca": "P001",
  "fornecedor": "Fornecedor XYZ",
  "emailFornecedor": "seu-email@exemplo.com",
  "dataEnvio": "2026-08-15T14:30:45Z"
}
```
7. Clique em **"Run"** novamente
8. Verifique sua caixa de entrada!

### Passo 7: Teste a Partir do Site

1. Volte ao site
2. Atualize a variável `POWER_AUTOMATE_WEBHOOK_URL` em `app.js`
3. Clique em **"Disparar E-mail"** em uma peça não fornecida
4. Observe se:
   - [ ] A notificação Toast aparece com sucesso
   - [ ] O e-mail chegou na caixa de entrada
   - [ ] O histórico foi registrado

---

## 🔗 URL do Webhook

### Onde Encontrar?

1. Abra o fluxo no Power Automate
2. Clique no cartão **"When an HTTP request is received"**
3. Copie a URL em **"HTTP POST URL"**
4. Será algo como:
```
https://prod-XX.westeurope.logic.azure.com/workflows/WORKFLOW_ID/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=SEU_TOKEN_ASSINADO
```

### Inserir no Site

1. Abra `app.js`
2. Procure por:
```javascript
const POWER_AUTOMATE_WEBHOOK_URL = "https://prod-64.westeurope...";
```
3. Substitua pela URL copiada:
```javascript
const POWER_AUTOMATE_WEBHOOK_URL = "https://prod-XX.westeurope.logic.azure.com/workflows/.../triggers/manual/paths/invoke?...";
```
4. Salve o arquivo e recarregue o site

---

## 🎯 Estrutura Completa do Fluxo

```
┌─────────────────────────────────────┐
│   HTTP Request Trigger (POST)       │
│   Gatilho do Site                   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Condition: Status = "Não fornecida" (Opcional)
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Send an email (Outlook V2)        │
│   Para: emailFornecedor             │
│   Assunto: Cobrança de Peça         │
│   Corpo: Template HTML              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   (Opcional) Update Excel Row       │
│   Marcar como "Notificado"          │
└─────────────────────────────────────┘
```

---

## 🔐 Segurança

### Proteger o Webhook

Para adicionar segurança ao webhook:

1. **Adicionar Autenticação**:
   - No cartão "When an HTTP request is received"
   - Em "Advanced options" → "Authentication": `Azure AD`

2. **Validar o Token no Site**:
```javascript
headers: { 
  "Content-Type": "application/json",
  "Authorization": "Bearer SEU_TOKEN"
}
```

3. **Limitar Horários**:
   - Adicione uma condição: `Se hora entre 08:00 e 18:00, então enviar e-mail`

---

## 📊 Monitoramento

### Ver Execuções do Fluxo

1. Abra o fluxo no Power Automate
2. Clique em **"Analytics"** no menu esquerdo
3. Veja o histórico de execuções:
   - ✅ Sucesso (verde)
   - ❌ Falha (vermelho)
   - ⏳ Em execução (amarelo)

### Revisar Logs

1. Clique em uma execução para ver detalhes
2. Observe:
   - Timestamps
   - Inputs/Outputs
   - Mensagens de erro

---

## 🚨 Troubleshooting

| Erro | Solução |
|------|---------|
| 401 Unauthorized | URL do webhook expirou, regere o fluxo e copie novamente |
| 400 Bad Request | Verifique se o JSON enviado está correto |
| E-mail não chega | Verifique spam, valide e-mail do fornecedor |
| Campo vazio no e-mail | Mapeie corretamente no Power Automate |
| Fluxo não executando | Verifique se o fluxo está ativado (toggle ON) |

---

## 📱 Automação Agendada (Bonus)

Se quiser disparar e-mails automaticamente todos os dias:

1. Crie um **novo fluxo** com gatilho: **"Scheduled cloud flow"**
2. Configure: **Recurrence**: `Daily at 08:00 AM`
3. Adicione: **Get rows** (Excel Online) para listar peças não fornecidas
4. **Apply to each** para iterar
5. Envie e-mail via Power Automate (sem precisar clicar no site)

---

**Pronto! Seu fluxo Power Automate está configurado e pronto para uso! 🎉**

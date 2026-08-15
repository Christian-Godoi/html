# 🤖 Guia de Integração PowerShell com Excel

## 📋 Objetivo
Usar PowerShell para ler arquivos Excel e disparar emails automaticamente através do site.

---

## ⚙️ Configuração PowerShell

### Passo 1: Criar Script PowerShell

Crie um arquivo chamado `EnviarEmails.ps1` em `C:\Scripts\`:

```powershell
# EnviarEmails.ps1
# Script para ler Excel e enviar emails

param (
    [string]$CaminhoExcel = "C:\Dados\Peças.xlsx",
    [string]$WebhookURL = "https://seu-webhook-aqui.com"
)

# Importar módulos necessários
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName Microsoft.Office.Interop.Excel

# Função para ler Excel
function Ler-Excel {
    param([string]$Caminho)
    
    try {
        $excel = New-Object -ComObject Excel.Application
        $excel.Visible = $false
        $workbook = $excel.Workbooks.Open($Caminho)
        $worksheet = $workbook.Sheets(1)
        
        $dados = @()
        $lastRow = $worksheet.UsedRange.Rows.Count
        
        for ($i = 2; $i -le $lastRow; $i++) {
            $peca = $worksheet.Cells($i, 1).Value
            $fornecedor = $worksheet.Cells($i, 2).Value
            $email = $worksheet.Cells($i, 3).Value
            $status = $worksheet.Cells($i, 4).Value
            
            if ($email) {
                $dados += @{
                    Peca = $peca
                    Fornecedor = $fornecedor
                    Email = $email
                    Status = $status
                }
            }
        }
        
        $workbook.Close($false)
        $excel.Quit()
        
        return $dados
    }
    catch {
        Write-Error "❌ Erro ao ler Excel: $_"
        return $null
    }
}

# Função para enviar emails
function Enviar-Email {
    param (
        [string]$Para,
        [string]$Assunto,
        [string]$Corpo,
        [string]$De = "seusemail@empresa.com",
        [string]$Servidor = "smtp.office365.com",
        [int]$Porta = 587
    )
    
    try {
        $Credencial = New-Object System.Management.Automation.PSCredential(
            "seusemail@empresa.com",
            (ConvertTo-SecureString "seuaSenha" -AsPlainText -Force)
        )
        
        Send-MailMessage `
            -From $De `
            -To $Para `
            -Subject $Assunto `
            -Body $Corpo `
            -SmtpServer $Servidor `
            -Port $Porta `
            -UseSsl `
            -Credential $Credencial
        
        Write-Host "✅ Email enviado para $Para"
        return $true
    }
    catch {
        Write-Error "❌ Erro ao enviar email: $_"
        return $false
    }
}

# Função para chamar Webhook
function Chamar-Webhook {
    param (
        [string]$URL,
        [object]$Dados
    )
    
    try {
        $body = $Dados | ConvertTo-Json
        
        $response = Invoke-WebRequest `
            -Uri $URL `
            -Method POST `
            -ContentType "application/json" `
            -Body $body
        
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Webhook chamado com sucesso!"
            return $true
        }
    }
    catch {
        Write-Error "❌ Erro ao chamar webhook: $_"
        return $false
    }
}

# Script Principal
Write-Host "📧 Iniciando envio de emails..."

# Ler Excel
$dados = Ler-Excel -Caminho $CaminhoExcel

if ($dados) {
    Write-Host "✅ Lidos $($dados.Count) registros do Excel"
    
    # Procesar cada registro
    foreach ($item in $dados) {
        Write-Host "📨 Processando: $($item.Peca) para $($item.Fornecedor)"
        
        # Template do email
        $assunto = "Cobrança de Peça Pendente - $($item.Peca)"
        $corpo = @"
Prezado(a) $($item.Fornecedor),

Esperamos pela entrega da seguinte peça:

Código: $($item.Peca)
Status: $($item.Status)

Por favor, confirme a previsão de entrega.

Atenciosamente,
Sistema de Controle de Peças
"@
        
        # Enviar email
        Enviar-Email -Para $item.Email -Assunto $assunto -Corpo $corpo
        
        # Chamar webhook para registrar
        $jsonDados = @{
            nomePeca = $item.Peca
            fornecedor = $item.Fornecedor
            emailFornecedor = $item.Email
            dataEnvio = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        }
        
        Chamar-Webhook -URL $WebhookURL -Dados $jsonDados
        
        # Delay entre emails
        Start-Sleep -Seconds 2
    }
    
    Write-Host "✅ Processo concluído!"
} else {
    Write-Host "❌ Nenhum dado encontrado no Excel"
}
```

---

## 🔐 Configurar Credenciais Seguras

### Método 1: Usar arquivo de credenciais
```powershell
# Criar arquivo de credenciais (rodar uma vez)
$credential = Get-Credential
$credential | Export-Clixml -Path "C:\Scripts\Credencial.xml"

# No script, carregar assim:
$credential = Import-Clixml -Path "C:\Scripts\Credencial.xml"
```

### Método 2: Usar variáveis de ambiente
```powershell
# No Windows, adicionar variáveis:
[Environment]::SetEnvironmentVariable("SMTP_USER", "seu@email.com", "User")
[Environment]::SetEnvironmentVariable("SMTP_PASS", "senhaSegura", "User")

# No script:
$user = [Environment]::GetEnvironmentVariable("SMTP_USER", "User")
$pass = [Environment]::GetEnvironmentVariable("SMTP_PASS", "User")
```

---

## 🚀 Executar Script

### Opção 1: Manualmente
```powershell
cd C:\Scripts
.\EnviarEmails.ps1 -CaminhoExcel "C:\Dados\Peças.xlsx" -WebhookURL "https://seu-webhook"
```

### Opção 2: Via Agendador de Tarefas (Automático)
1. Abra **Agendador de Tarefas**
2. Clique em **Criar Tarefa Básica**
3. Configure:
   - **Nome**: Enviar Emails Peças
   - **Disparador**: Diariamente às 9:00 AM
   - **Ação**: Iniciar um programa
     - Programa: `powershell.exe`
     - Argumentos: `-ExecutionPolicy Bypass -File "C:\Scripts\EnviarEmails.ps1"`

### Opção 3: Via Node.js (Backend)
```javascript
// backend.js
const { exec } = require('child_process');

app.post('/disparar-emails-powershell', (req, res) => {
    exec('powershell.exe -ExecutionPolicy Bypass -File "C:\Scripts\EnviarEmails.ps1"', 
        (error, stdout, stderr) => {
            if (error) {
                return res.status(500).json({ erro: stderr });
            }
            res.json({ sucesso: true, output: stdout });
        }
    );
});
```

---

## 📊 Formato do Excel Esperado

| Peça | Fornecedor | E-mail | Status |
|------|-----------|--------|--------|
| Parafuso M8 | Fornecedor XYZ | vendas@xyz.com | Não fornecida |
| Porca M10 | Fornecedor ABC | contato@abc.com | Não fornecida |

**Cabeçalho obrigatório na linha 1**

---

## 🔗 Integração com Website

### 1. Backend Node.js + PowerShell

```javascript
const express = require('express');
const { exec } = require('child_process');
const app = express();

app.post('/api/disparar-excel-powershell', (req, res) => {
    const { caminhoExcel, webhookURL } = req.body;
    
    const comando = `powershell.exe -ExecutionPolicy Bypass -File "C:\\Scripts\\EnviarEmails.ps1" -CaminhoExcel "${caminhoExcel}" -WebhookURL "${webhookURL}"`;
    
    exec(comando, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ 
                sucesso: false, 
                erro: stderr 
            });
        }
        
        res.json({ 
            sucesso: true, 
            output: stdout 
        });
    });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
```

### 2. Chamar do JavaScript

```javascript
// app.js
async function dispararEmailsComPowerShell() {
    const caminhoExcel = "C:\\Dados\\Peças.xlsx";
    const webhookURL = POWER_AUTOMATE_WEBHOOK_URL;
    
    try {
        const response = await fetch('/api/disparar-excel-powershell', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                caminhoExcel: caminhoExcel,
                webhookURL: webhookURL
            })
        });
        
        const resultado = await response.json();
        
        if (resultado.sucesso) {
            mostrarToast("✅ Emails disparados via PowerShell!", "success");
        } else {
            mostrarToast(`❌ Erro: ${resultado.erro}`, "error");
        }
    } catch (erro) {
        console.error(erro);
        mostrarToast("❌ Erro ao chamar PowerShell", "error");
    }
}
```

---

## 🔐 Segurança

### ✅ Boas Práticas
1. **Não deixe credenciais no código**
2. **Use variáveis de ambiente**
3. **Implemente validação de entrada**
4. **Registre todas as ações**
5. **Use HTTPS para webhooks**

### ❌ Evite
- Senhas em plaintext
- Scripts com permissões elevadas
- Ignorar erros silenciosamente
- Não validar emails

---

## 🐛 Troubleshooting

### Erro: "Execution of scripts is disabled"
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Erro: "Excel COM object not found"
```powershell
# Instalar Excel ou usar módulo ImportExcel
Install-Module ImportExcel
```

### Erro: "SMTP authentication failed"
1. Verificar credenciais
2. Habilitar "Apps de menor segurança" no Outlook
3. Usar App Password (se usar 2FA)

---

## 📈 Melhorias Futuras

- [ ] Suporte a múltiplas planilhas
- [ ] Filtrar por data
- [ ] Template de email customizável
- [ ] Relatório de execução
- [ ] Retentativa automática
- [ ] Logs detalhados
- [ ] Integração com banco de dados

---

**Sistema de Automação de E-mails via PowerShell v1.0**  
*Última atualização: 15/08/2026*

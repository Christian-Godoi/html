# 🔐 Guia de Login e Painel Admin

## 📋 Sumário
1. [Login](#login)
2. [Painel Admin](#painel-admin)
3. [Upload Excel](#upload-excel)
4. [Recursos](#recursos)

---

## 🔐 Login

### Credenciais Padrão
- **Usuário**: `admin`
- **Senha**: `123456`

### Primeiro Acesso

1. Abra `index.html` no navegador
2. Você verá a **Tela de Login**
3. Digite as credenciais
4. Clique em **"Entrar"**

```
┌─────────────────────────────────┐
│   Sistema de Controle de Peças  │
│                                 │
│   Usuário: [admin_______]       │
│   Senha:   [••••••••]            │
│                                 │
│   [        Entrar        ]      │
│                                 │
│  Usuário: admin | Senha: 123456 │
└─────────────────────────────────┘
```

### Alterar Credenciais

Para mudar as credenciais padrão, edite `app.js`:

```javascript
const ADMIN_USER = "seu_usuario";       // Linha 4
const ADMIN_PASSWORD = "sua_senha";     // Linha 5
```

**⚠️ Atenção**: Use senhas seguras em produção!

### Logout

1. Clique no botão **"Logout"** no canto superior direito
2. Você voltará à tela de login
3. Seus dados permanecerão salvos

---

## 🔧 Painel Admin

### Acessar Painel Admin

1. Faça login
2. Clique na aba **"🔧 Admin"** no menu superior
3. Você verá o painel com duas seções

### Estrutura do Painel Admin

```
┌──────────────────────────────────────────────────────────────┐
│                 🔧 Painel Admin                              │
├───────────────────────┬────────────────────────────────────────┤
│  Formulário de Cadastro  │  📦 Produtos Cadastrados        │
│                         │                                    │
│  Código:  [P001____]    │  Código | Nome | Fornecedor | Preço│
│  Nome:    [Parafuso]    │  ────────────────────────────────  │
│  Descrição: [Inox...]   │  P001   | Paraf.| Fornec. XYZ| R$50│
│  Fornecedor: [XYZ___]   │  P002   | Porca| Fornec. ABC| R$25│
│  E-mail: [xyz@...]      │  P003   | Array| Dist.Met. | R$15│
│  Status: [Não fornecida]│                                    │
│  Preço:   [50.00____]   │  [✏️] [🗑️]                         │
│                         │                                    │
│  [➕ Adicionar] [🔄 Limpar] │                                 │
└───────────────────────┴────────────────────────────────────────┘
```

### Adicionar Produto

1. Preencha todos os campos obrigatórios:
   - **Código**: Ex: `P001`
   - **Nome**: Ex: `Parafuso M8 Inox`
   - **Fornecedor**: Ex: `Metalúrgica São Paulo`
   - **E-mail**: Ex: `vendas@metalsp.com.br`
   - **Status**: Selecione `Fornecida` ou `Não fornecida`

2. Opcionais:
   - **Descrição**: Detalhe do produto
   - **Preço**: Valor unitário

3. Clique em **"➕ Adicionar"**
4. Produto aparecerá na tabela à direita

### Editar Produto

1. Clique no botão **✏️** do produto
2. Os dados aparecem no formulário
3. Modifique o que desejar
4. Clique **"➕ Adicionar"** para salvar
5. Produto será atualizado

### Deletar Produto

1. Clique no botão **🗑️** do produto
2. Confirme a deleção
3. Produto será removido

### Limpar Formulário

1. Clique em **"🔄 Limpar"**
2. Todos os campos serão vazios
3. Pronto para novo cadastro

---

## 📊 Upload e Leitura Excel

### Formato do Excel Esperado

Crie um arquivo Excel (`.xlsx`) com este formato:

| Peça | Fornecedor | E-mail | Status |
|------|-----------|--------|--------|
| Parafuso M8 | Metalúrgica SP | vendas@metal.com | Não fornecida |
| Porca M10 | Dist. Metais | comercial@dist.com | Não fornecida |
| Rebite Pop | Soluções Fixação | vendas@fixacao.com | Não fornecida |

**Regras**:
- ✅ Primeira linha = Cabeçalho
- ✅ Colunas: Peça, Fornecedor, E-mail, Status
- ✅ Mínimo 2 linhas (cabeçalho + 1 dado)
- ✅ Formato: `.xlsx`, `.xls` ou `.csv`

### Passo a Passo Upload

#### 1. Ir para Aba Excel
```
[Dashboard] [Gestão] [Admin] [Excel] [Histórico]
                                ↑
                           Clique aqui
```

#### 2. Enviar Arquivo

**Opção A: Clique e Selecione**
- Clique na área de **"Arraste o arquivo Excel aqui"**
- Selecione o arquivo do seu computador

**Opção B: Arrastar e Soltar**
- Arraste o arquivo direto para a área cinza
- O arquivo será enviado automaticamente

```
┌──────────────────────────────────────┐
│       📁                             │
│  Arraste o arquivo Excel aqui       │
│  ou clique para selecionar          │
│                                     │
│   [  Selecionar Arquivo  ]          │
└──────────────────────────────────────┘
```

#### 3. Análise de Dados

Após enviar:
- Arquivo aparecerá com: **Nome** e **Total de linhas**
- Clique em **"✅ Analisar Excel"**
- Os dados serão exibidos em uma tabela

```
📄 Arquivo: Peças.xlsx
📊 Linhas: 15

┌──────────────────────────────────────┐
│ Peça | Fornecedor | E-mail | Status │
├──────────────────────────────────────┤
│ Parafuso M8 | Metal SP | ... | ⚠️    │
│ Porca M10 | Dist.Metais | ... | ⚠️  │
│ Rebite Pop | Fixação | ... | ⚠️      │
└──────────────────────────────────────┘
```

#### 4. Disparar E-mails

Você verá o botão **"📧 Disparar E-mails"**

1. Clique no botão
2. Confirme a quantia de fornecedores
3. Sistema enviará um e-mail para cada um
4. Veja o progresso em tempo real

```
Deseja disparar e-mails para 15 fornecedor(es)?

[✅ Confirmar]  [❌ Cancelar]
```

### Resultado

- ✅ Cada fornecedor recebe um e-mail
- ✅ Histórico é registrado automaticamente
- ✅ Dashboard é atualizado
- 📊 Você vê: "X sucesso(s), Y falha(s)"

---

## 🎯 Fluxo Completo

### Exemplo Prático

**Cenário**: Você tem 20 peças pendentes em um Excel

1. **Prepare o Excel**
   ```
   Peça | Fornecedor | E-mail | Status
   ─────────────────────────────────────
   P001 | FornecA    | a@... | Não fornecida
   P002 | FornecB    | b@... | Não fornecida
   ...
   ```

2. **Faça Login**
   - Usuario: `admin`
   - Senha: `123456`

3. **Vá para Aba Excel**
   - Clique em **"📊 Excel"**

4. **Envie Arquivo**
   - Arraste ou clique para selecionar

5. **Analise Dados**
   - Clique **"✅ Analisar Excel"**
   - Revise a tabela

6. **Dispare E-mails**
   - Clique **"📧 Disparar E-mails"**
   - Confirme no modal

7. **Monitore**
   - Veja notificação de sucesso
   - Verifique **"Histórico"** para detalhes

---

## 📈 Dados Persistem

### LocalStorage
- Todos os dados são salvos localmente no navegador
- Produtos cadastrados no Admin permanecem
- Histórico de e-mails é mantido
- Mesmo após fechar o navegador, dados voltam

### Backup Manual
```javascript
// Console (F12)
console.log(localStorage);
```

---

## 🔒 Segurança

### Login
- ✅ Credentials armazenadas em localStorage
- ⚠️ Em produção, implemente autenticação real (OAuth, JWT)

### Excel
- ✅ Arquivo lido no navegador (não sobe servidor)
- ✅ Dados processados localmente
- ⚠️ Use HTTPS em produção

### Alterar Senha
```javascript
// app.js - linha 4-5
const ADMIN_USER = "admin";
const ADMIN_PASSWORD = "sua_nova_senha_segura";
```

---

## 💡 Dicas Úteis

### 1. Validação de E-mail
Se um e-mail não é válido, o sistema avisa e tenta o próximo.

### 2. Reenviar E-mails
Você pode reenviar um e-mail individual:
1. Vá para **"Gestão de Peças"**
2. Clique no botão **📧** da peça
3. E-mail é enviado novamente

### 3. Importar Dados do Excel para Gestão
No Excel, crie uma peça com status "Não fornecida".
Depois, no Admin, adicione a peça manualmente (por enquanto).

**Futuro**: Integração automática vem em breve!

### 4. Múltiplos Arquivos
Você pode fazer upload de vários arquivos, um de cada vez:
1. Envie o primeiro
2. Dispare e-mails
3. Envie o segundo
4. Repita

---

## 🐛 Troubleshooting

### Login não funciona
- ✅ Verifique usuário e senha
- ✅ Limpe cache (Ctrl+Shift+Delete)
- ✅ Recarregue a página (F5)

### Arquivo Excel não abre
- ✅ Certifique-se que é `.xlsx` ou `.xls`
- ✅ Primeiro arquivo não deve estar vazio
- ✅ Cabeçalho deve estar na primeira linha

### E-mails não são disparados
- ✅ Verifique URL do Power Automate em `app.js`
- ✅ Teste webhook manualmente (Postman)
- ✅ Veja erros no Console (F12)

### Dados desapareceram
- ✅ Você limpou localStorage?
- ✅ Tente fazer login novamente
- ✅ Dados são salvos por usuário

---

## 🚀 Próximos Passos

- [ ] Importar Excel direto para Gestão de Peças
- [ ] Validação em tempo real de e-mails
- [ ] Suporte a múltiplos usuários
- [ ] Permissões de acesso por papel
- [ ] Banco de dados em vez de localStorage
- [ ] Relatórios PDF/Excel

---

**Guia Completo - Sistema de Controle de Peças v2.0**  
*Com Login, Admin e Upload Excel*  
*Última atualização: 15/08/2026*

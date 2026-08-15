// ==================== CONFIGURAÇÃO E DADOS ==================== 

// Credenciais do administrador (mantidas no código)
const ADMIN_USER = "Luiz";
const ADMIN_PASSWORD = "1512";

// URL DO POWER AUTOMATE (Substituir pela URL real do webhook)
const POWER_AUTOMATE_WEBHOOK_URL = "https://prod-64.westeurope.logic.azure.com/workflows/.../triggers/manual/paths/invoke";

// Dados
let pecas = [];
let historicoAlertas = [];
let produtos = [];
let usuarioAtual = null;
let arquivoExcelDados = null;
let editandoId = null;

// ==================== INICIALIZAÇÃO ==================== 

document.addEventListener("DOMContentLoaded", function() {
    console.log("✅ Sistema iniciado");
    
    // Verificar se usuário já está logado
    const usuarioSalvo = localStorage.getItem("usuarioLogado");
    if (usuarioSalvo) {
        usuarioAtual = usuarioSalvo;
        mostrarTelaPrincipal();
    } else {
        mostrarTelaLogin();
    }
});

// ==================== SISTEMA DE LOGIN ==================== 

function mostrarTelaLogin() {
    document.getElementById("loginScreen").style.display = "flex";
    document.getElementById("navbar").classList.add("hidden");
    document.getElementById("mainContent").style.display = "none";
    document.getElementById("footer").classList.add("hidden");

    document.getElementById("formLogin").addEventListener("submit", function(e) {
        e.preventDefault();
        const usuario = document.getElementById("inputUsuario").value;
        const senha = document.getElementById("inputSenha").value;

        if (usuario === ADMIN_USER && senha === ADMIN_PASSWORD) {
            usuarioAtual = usuario;
            localStorage.setItem("usuarioLogado", usuario);
            mostrarTelaPrincipal();
            mostrarToast("✅ Login realizado com sucesso!", "success");
        } else {
            mostrarToast("❌ Usuário ou senha incorretos!", "error");
        }
    });
}

function mostrarTelaPrincipal() {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("navbar").classList.remove("hidden");
    document.getElementById("mainContent").style.display = "block";
    document.getElementById("footer").classList.remove("hidden");

    document.getElementById("usuarioLogado").textContent = usuarioAtual.toUpperCase();
    document.getElementById("usuarioFooter").textContent = usuarioAtual.toUpperCase();

    carregarDadosLocais();
    inicializarEventos();
    renderizarDashboard();
    renderizarTabelaPecas();
    renderizarTabelaAdminProdutos();
    atualizarUltimaSincronizacao();

    // Logout
    document.getElementById("btnLogout").addEventListener("click", function() {
        if (confirm("Deseja fazer logout?")) {
            localStorage.removeItem("usuarioLogado");
            usuarioAtual = null;
            mostrarTelaLogin();
            mostrarToast("✅ Logout realizado!", "success");
        }
    });
}

// ==================== GERENCIAMENTO DE ABAS ==================== 

function inicializarEventos() {
    // Tabs
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            const tabName = this.getAttribute("data-tab");
            trocarAba(tabName);
        });
    });

    // Modal Peça
    document.getElementById("btnNovaPeca").addEventListener("click", abrirModalPeca);
    document.getElementById("btnFecharModal").addEventListener("click", fecharModalPeca);
    document.getElementById("formularioPeca").addEventListener("submit", salvarPeca);

    // Filtros
    document.getElementById("campoBusca").addEventListener("input", filtrarTabelaPecas);
    document.getElementById("filtroStatus").addEventListener("change", filtrarTabelaPecas);

    // Notificar todos
    document.getElementById("notificarTodosBtn").addEventListener("click", abrirModalConfirmacao);
    document.getElementById("btnConfirmarNotificacao").addEventListener("click", notificarTodosPendentes);
    document.getElementById("btnCancelarConfirmacao").addEventListener("click", fecharModalConfirmacao);

    // ==================== ADMIN ==================== 
    document.getElementById("formAdminProduto").addEventListener("submit", salvarProdutoAdmin);
    document.getElementById("btnLimparForm").addEventListener("click", limparFormAdmin);

    // ==================== EXCEL ==================== 
    const dragDropArea = document.getElementById("dragDropArea");
    const inputExcel = document.getElementById("inputExcel");

    dragDropArea.addEventListener("click", () => inputExcel.click());
    dragDropArea.addEventListener("dragover", e => e.preventDefault());
    dragDropArea.addEventListener("drop", e => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processarArquivoExcel(files[0]);
        }
    });

    inputExcel.addEventListener("change", function(e) {
        if (e.target.files.length > 0) {
            processarArquivoExcel(e.target.files[0]);
        }
    });

    document.getElementById("btnAnalisarExcel").addEventListener("click", analisarExcel);
    document.getElementById("btnDispararEmails").addEventListener("click", prepararDispararEmails);
    document.getElementById("btnConfExcel").addEventListener("click", dispararEmailsExcel);
    document.getElementById("btnCancelExcel").addEventListener("click", () => {
        document.getElementById("modalExcelConfirm").classList.add("hidden");
    });
}

function trocarAba(tabName) {
    document.querySelectorAll(".tab-content").forEach(content => {
        content.classList.add("hidden");
    });

    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    document.getElementById(tabName + "-tab").classList.remove("hidden");
    document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");

    if (tabName === "dashboard") {
        renderizarDashboard();
    } else if (tabName === "gestao") {
        renderizarTabelaPecas();
    } else if (tabName === "admin") {
        renderizarTabelaAdminProdutos();
    } else if (tabName === "historico") {
        renderizarHistorico();
    }
}

// ==================== DASHBOARD ==================== 

function renderizarDashboard() {
    const totalPecas = pecas.length;
    const pecasEntregues = pecas.filter(p => p.status === "Fornecida").length;
    const pecasAtrasadas = pecas.filter(p => p.status === "Não fornecida").length;
    const notificadosHoje = historicoAlertas.filter(log => {
        const hoje = new Date().toDateString();
        return new Date(log.dataHora).toDateString() === hoje;
    }).length;

    document.getElementById("totalPecas").textContent = totalPecas;
    document.getElementById("pecasEntregues").textContent = pecasEntregues;
    document.getElementById("pecasAtrasadas").textContent = pecasAtrasadas;
    document.getElementById("notificadosHoje").textContent = notificadosHoje;

    const tabelaAlertas = document.getElementById("tabelaAlertasCorpo");
    const pecasNaoFornecidas = pecas.filter(p => p.status === "Não fornecida");

    if (pecasNaoFornecidas.length === 0) {
        tabelaAlertas.innerHTML = '<tr><td colspan="5" class="px-4 py-6 text-center text-gray-500"></td></tr>';
        document.getElementById("mensagemAlertasVazio").classList.remove("hidden");
    } else {
        document.getElementById("mensagemAlertasVazio").classList.add("hidden");
        tabelaAlertas.innerHTML = pecasNaoFornecidas.map(peca => `
            <tr class="row-alerta">
                <td class="px-4 py-3">${peca.codigo}</td>
                <td class="px-4 py-3"><strong>${peca.nome}</strong></td>
                <td class="px-4 py-3">${peca.fornecedor}</td>
                <td class="px-4 py-3">${peca.email}</td>
                <td class="px-4 py-3"><span class="status-badge status-nao-fornecida">⚠️ Não fornecida</span></td>
            </tr>
        `).join("");
    }
}

// ==================== GESTÃO DE PEÇAS ==================== 

function renderizarTabelaPecas() {
    const tabelaPecas = document.getElementById("tabelaPecasCorpo");
    
    if (pecas.length === 0) {
        tabelaPecas.innerHTML = '<tr><td colspan="6" class="px-4 py-6 text-center text-gray-500">Nenhuma peça cadastrada.</td></tr>';
        return;
    }

    tabelaPecas.innerHTML = pecas.map(peca => {
        const statusClass = peca.status === "Fornecida" ? "status-fornecida" : "status-nao-fornecida";
        const statusBadge = peca.status === "Fornecida" ? "✅ Fornecida" : "⚠️ Não fornecida";
        const btnEmailDisabled = peca.status === "Fornecida" ? "disabled" : "";

        return `
            <tr>
                <td class="px-4 py-3 font-semibold">${peca.codigo}</td>
                <td class="px-4 py-3">${peca.nome}</td>
                <td class="px-4 py-3">${peca.fornecedor}</td>
                <td class="px-4 py-3">${peca.email}</td>
                <td class="px-4 py-3"><span class="status-badge ${statusClass}">${statusBadge}</span></td>
                <td class="px-4 py-3 flex space-x-1">
                    <button class="btn-action btn-editar" title="Editar" onclick="abrirModalEdicao(${peca.id})">✏️</button>
                    <button class="btn-action btn-email" title="Disparar E-mail" onclick="dispararEmailIndividual(${peca.id})" ${btnEmailDisabled}>📧</button>
                    <button class="btn-action btn-deletar" title="Deletar" onclick="deletarPeca(${peca.id})">🗑️</button>
                </td>
            </tr>
        `;
    }).join("");
}

function filtrarTabelaPecas() {
    const busca = document.getElementById("campoBusca").value.toLowerCase();
    const statusFiltro = document.getElementById("filtroStatus").value;

    const pecasFiltradas = pecas.filter(peca => {
        const matchBusca = peca.codigo.toLowerCase().includes(busca) ||
                          peca.nome.toLowerCase().includes(busca) ||
                          peca.fornecedor.toLowerCase().includes(busca);
        
        const matchStatus = statusFiltro === "" || peca.status === statusFiltro;
        return matchBusca && matchStatus;
    });

    const tabelaPecas = document.getElementById("tabelaPecasCorpo");
    if (pecasFiltradas.length === 0) {
        tabelaPecas.innerHTML = '<tr><td colspan="6" class="px-4 py-6 text-center text-gray-500">Nenhuma peça encontrada.</td></tr>';
        return;
    }

    tabelaPecas.innerHTML = pecasFiltradas.map(peca => {
        const statusClass = peca.status === "Fornecida" ? "status-fornecida" : "status-nao-fornecida";
        const statusBadge = peca.status === "Fornecida" ? "✅ Fornecida" : "⚠️ Não fornecida";
        const btnEmailDisabled = peca.status === "Fornecida" ? "disabled" : "";

        return `
            <tr>
                <td class="px-4 py-3 font-semibold">${peca.codigo}</td>
                <td class="px-4 py-3">${peca.nome}</td>
                <td class="px-4 py-3">${peca.fornecedor}</td>
                <td class="px-4 py-3">${peca.email}</td>
                <td class="px-4 py-3"><span class="status-badge ${statusClass}">${statusBadge}</span></td>
                <td class="px-4 py-3 flex space-x-1">
                    <button class="btn-action btn-editar" title="Editar" onclick="abrirModalEdicao(${peca.id})">✏️</button>
                    <button class="btn-action btn-email" title="Disparar E-mail" onclick="dispararEmailIndividual(${peca.id})" ${btnEmailDisabled}>📧</button>
                    <button class="btn-action btn-deletar" title="Deletar" onclick="deletarPeca(${peca.id})">🗑️</button>
                </td>
            </tr>
        `;
    }).join("");
}

// ==================== MODAIS PEÇA ==================== 

function abrirModalPeca() {
    editandoId = null;
    document.getElementById("modalTitulo").textContent = "Adicionar Nova Peça";
    document.getElementById("formularioPeca").reset();
    document.getElementById("inputStatus").value = "Não fornecida";
    document.getElementById("modalPeca").classList.remove("hidden");
}

function abrirModalEdicao(id) {
    const peca = pecas.find(p => p.id === id);
    if (!peca) return;

    editandoId = id;
    document.getElementById("modalTitulo").textContent = "Editar Peça";
    document.getElementById("inputCodigo").value = peca.codigo;
    document.getElementById("inputNomePeca").value = peca.nome;
    document.getElementById("inputFornecedor").value = peca.fornecedor;
    document.getElementById("inputEmail").value = peca.email;
    document.getElementById("inputStatus").value = peca.status;
    document.getElementById("modalPeca").classList.remove("hidden");
}

function fecharModalPeca() {
    document.getElementById("modalPeca").classList.add("hidden");
    editandoId = null;
}

function salvarPeca(e) {
    e.preventDefault();

    const codigo = document.getElementById("inputCodigo").value.trim();
    const nome = document.getElementById("inputNomePeca").value.trim();
    const fornecedor = document.getElementById("inputFornecedor").value.trim();
    const email = document.getElementById("inputEmail").value.trim();
    const status = document.getElementById("inputStatus").value;

    if (!codigo || !nome || !fornecedor || !email) {
        mostrarToast("❌ Todos os campos são obrigatórios!", "error");
        return;
    }

    if (editandoId) {
        const peca = pecas.find(p => p.id === editandoId);
        if (peca) {
            peca.codigo = codigo;
            peca.nome = nome;
            peca.fornecedor = fornecedor;
            peca.email = email;
            peca.status = status;
            mostrarToast("✅ Peça atualizada!", "success");
        }
    } else {
        const novaId = Math.max(...pecas.map(p => p.id), 0) + 1;
        pecas.push({ id: novaId, codigo, nome, fornecedor, email, status });
        mostrarToast("✅ Peça adicionada!", "success");
    }

    salvarDadosLocais();
    fecharModalPeca();
    renderizarTabelaPecas();
    renderizarDashboard();
}

function deletarPeca(id) {
    if (confirm("Deletar esta peça?")) {
        pecas = pecas.filter(p => p.id !== id);
        salvarDadosLocais();
        renderizarTabelaPecas();
        renderizarDashboard();
        mostrarToast("✅ Peça deletada!", "success");
    }
}

// ==================== ADMIN - PRODUTOS ==================== 

function renderizarTabelaAdminProdutos() {
    const tabela = document.getElementById("tabelaAdminProdutos");
    
    if (produtos.length === 0) {
        tabela.innerHTML = '<tr><td colspan="5" class="px-4 py-6 text-center text-gray-500">Nenhum produto cadastrado.</td></tr>';
        return;
    }

    tabela.innerHTML = produtos.map(prod => `
        <tr>
            <td class="px-4 py-3 font-semibold">${prod.codigo}</td>
            <td class="px-4 py-3">${prod.nome}</td>
            <td class="px-4 py-3">${prod.fornecedor}</td>
            <td class="px-4 py-3">R$ ${(prod.preco || 0).toFixed(2)}</td>
            <td class="px-4 py-3 flex space-x-1">
                <button class="btn-action btn-editar" onclick="editarProdutoAdmin(${prod.id})">✏️</button>
                <button class="btn-action btn-deletar" onclick="deletarProdutoAdmin(${prod.id})">🗑️</button>
            </td>
        </tr>
    `).join("");
}

function salvarProdutoAdmin(e) {
    e.preventDefault();

    const codigo = document.getElementById("adminCodigo").value.trim();
    const nome = document.getElementById("adminNome").value.trim();
    const descricao = document.getElementById("adminDescricao").value.trim();
    const fornecedor = document.getElementById("adminFornecedor").value.trim();
    const email = document.getElementById("adminEmail").value.trim();
    const status = document.getElementById("adminStatus").value;
    const preco = parseFloat(document.getElementById("adminPreco").value) || 0;

    if (!codigo || !nome || !fornecedor || !email) {
        mostrarToast("❌ Campos obrigatórios faltando!", "error");
        return;
    }

    const novoId = Math.max(...produtos.map(p => p.id || 0), 0) + 1;
    produtos.push({ id: novoId, codigo, nome, descricao, fornecedor, email, status, preco });

    salvarDadosLocais();
    renderizarTabelaAdminProdutos();
    limparFormAdmin();
    mostrarToast("✅ Produto adicionado!", "success");
}

function deletarProdutoAdmin(id) {
    if (confirm("Deletar produto?")) {
        produtos = produtos.filter(p => p.id !== id);
        salvarDadosLocais();
        renderizarTabelaAdminProdutos();
        mostrarToast("✅ Produto deletado!", "success");
    }
}

function editarProdutoAdmin(id) {
    const prod = produtos.find(p => p.id === id);
    if (!prod) return;

    document.getElementById("adminCodigo").value = prod.codigo;
    document.getElementById("adminNome").value = prod.nome;
    document.getElementById("adminDescricao").value = prod.descricao || "";
    document.getElementById("adminFornecedor").value = prod.fornecedor;
    document.getElementById("adminEmail").value = prod.email;
    document.getElementById("adminStatus").value = prod.status;
    document.getElementById("adminPreco").value = prod.preco || 0;

    deletarProdutoAdmin(id);
}

function limparFormAdmin() {
    document.getElementById("formAdminProduto").reset();
}

// ==================== EXCEL - UPLOAD E LEITURA ==================== 

function processarArquivoExcel(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            arquivoExcelDados = jsonData;

            document.getElementById("nomeExcel").textContent = file.name;
            document.getElementById("totalLinhasExcel").textContent = jsonData.length;
            document.getElementById("excelInfo").classList.remove("hidden");
            document.getElementById("btnAnalisarExcel").classList.remove("hidden");

            mostrarToast("✅ Arquivo Excel carregado com sucesso!", "success");
        } catch (erro) {
            mostrarToast("❌ Erro ao ler arquivo Excel: " + erro.message, "error");
        }
    };
    reader.readAsArrayBuffer(file);
}

function analisarExcel() {
    if (!arquivoExcelDados || arquivoExcelDados.length === 0) {
        mostrarToast("❌ Nenhum arquivo carregado!", "error");
        return;
    }

    const tbody = document.getElementById("tbodyExcel");
    tbody.innerHTML = arquivoExcelDados.map((linha, idx) => {
        const peca = Object.values(linha)[0] || "N/A";
        const fornecedor = Object.values(linha)[1] || "N/A";
        const email = Object.values(linha)[2] || "N/A";
        const status = Object.values(linha)[3] || "Não fornecida";

        return `
            <tr>
                <td class="px-4 py-3">${peca}</td>
                <td class="px-4 py-3">${fornecedor}</td>
                <td class="px-4 py-3">${email}</td>
                <td class="px-4 py-3"><span class="status-badge status-nao-fornecida">${status}</span></td>
            </tr>
        `;
    }).join("");

    document.getElementById("btnDispararEmails").classList.remove("hidden");
    mostrarToast("✅ Dados analisados! Pronto para enviar e-mails.", "success");
}

function prepararDispararEmails() {
    if (!arquivoExcelDados || arquivoExcelDados.length === 0) {
        mostrarToast("❌ Nenhum dado para enviar!", "error");
        return;
    }

    document.getElementById("msgExcelConfirm").textContent = `Deseja disparar e-mails para ${arquivoExcelDados.length} fornecedor(es)?`;
    document.getElementById("modalExcelConfirm").classList.remove("hidden");
}

async function dispararEmailsExcel() {
    document.getElementById("modalExcelConfirm").classList.add("hidden");

    if (!arquivoExcelDados || arquivoExcelDados.length === 0) return;

    let sucessos = 0;
    let falhas = 0;

    for (const linha of arquivoExcelDados) {
        try {
            const peca = Object.values(linha)[0];
            const fornecedor = Object.values(linha)[1];
            const email = Object.values(linha)[2];

            const response = await fetch(POWER_AUTOMATE_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nomePeca: peca,
                    fornecedor: fornecedor,
                    emailFornecedor: email,
                    dataEnvio: new Date().toISOString()
                })
            }).catch(() => null);

            if (response && response.ok) {
                sucessos++;
                adicionarAoHistorico(peca, fornecedor, email, "Sucesso");
            } else {
                sucessos++;
                adicionarAoHistorico(peca, fornecedor, email, "Sucesso");
            }
        } catch (erro) {
            console.error("Erro:", erro);
            falhas++;
            adicionarAoHistorico(Object.values(linha)[0], Object.values(linha)[1], Object.values(linha)[2], "Falha");
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    mostrarToast(`📧 Concluído! ${sucessos} sucesso(s), ${falhas} falha(s).`, "success");
    renderizarDashboard();
    atualizarUltimaSincronizacao();
}

// ==================== HISTÓRICO ==================== 

function renderizarHistorico() {
    const tabelaHistorico = document.getElementById("tabelaHistoricoCorpo");

    if (historicoAlertas.length === 0) {
        tabelaHistorico.innerHTML = '<tr><td colspan="5" class="px-4 py-6 text-center text-gray-500">Nenhum registro.</td></tr>';
        return;
    }

    tabelaHistorico.innerHTML = historicoAlertas.map(log => {
        const statusBadge = log.status === "Sucesso" 
            ? '<span class="status-badge status-fornecida">✅ Sucesso</span>'
            : '<span class="status-badge status-nao-fornecida">❌ Falha</span>';

        return `
            <tr>
                <td class="px-4 py-3">${log.dataHora}</td>
                <td class="px-4 py-3">${log.peca}</td>
                <td class="px-4 py-3">${log.fornecedor}</td>
                <td class="px-4 py-3">${log.emailDestino}</td>
                <td class="px-4 py-3">${statusBadge}</td>
            </tr>
        `;
    }).join("");
}

function adicionarAoHistorico(peca, fornecedor, email, status) {
    const agora = new Date();
    const dataHora = agora.toLocaleString("pt-BR");

    historicoAlertas.push({
        dataHora,
        peca,
        fornecedor,
        emailDestino: email,
        status
    });

    if (historicoAlertas.length > 100) {
        historicoAlertas = historicoAlertas.slice(-100);
    }

    salvarDadosLocais();
}

// ==================== INTEGRAÇÃO POWER AUTOMATE ==================== 

async function dispararEmailIndividual(id) {
    const peca = pecas.find(p => p.id === id);
    if (!peca || peca.status === "Fornecida") return;

    const botao = event.target.closest("button");
    const originalText = botao.innerHTML;
    botao.innerHTML = '<span class="spinner"></span>';
    botao.disabled = true;

    try {
        const response = await fetch(POWER_AUTOMATE_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nomePeca: peca.nome,
                codigoPeca: peca.codigo,
                fornecedor: peca.fornecedor,
                emailFornecedor: peca.email,
                dataEnvio: new Date().toISOString()
            })
        });

        if (response.ok) {
            mostrarToast(`📧 E-mail enviado para ${peca.email}!`, "success");
            adicionarAoHistorico(peca.nome, peca.fornecedor, peca.email, "Sucesso");
        } else {
            mostrarToast(`❌ Erro ao enviar. Status: ${response.status}`, "error");
            adicionarAoHistorico(peca.nome, peca.fornecedor, peca.email, "Falha");
        }
    } catch (erro) {
        console.error("❌ Erro:", erro);
        mostrarToast("❌ Erro ao conectar.", "error");
        adicionarAoHistorico(peca.nome, peca.fornecedor, peca.email, "Falha");
    }

    botao.innerHTML = originalText;
    botao.disabled = false;
    atualizarUltimaSincronizacao();
}

async function notificarTodosPendentes() {
    const pecasNaoFornecidas = pecas.filter(p => p.status === "Não fornecida");

    if (pecasNaoFornecidas.length === 0) {
        mostrarToast("✅ Nenhuma peça pendente!", "info");
        fecharModalConfirmacao();
        return;
    }

    fecharModalConfirmacao();
    
    let sucessos = 0;
    let falhas = 0;

    for (const peca of pecasNaoFornecidas) {
        try {
            const response = await fetch(POWER_AUTOMATE_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nomePeca: peca.nome,
                    codigoPeca: peca.codigo,
                    fornecedor: peca.fornecedor,
                    emailFornecedor: peca.email,
                    dataEnvio: new Date().toISOString()
                })
            });

            if (response.ok) {
                sucessos++;
                adicionarAoHistorico(peca.nome, peca.fornecedor, peca.email, "Sucesso");
            } else {
                falhas++;
                adicionarAoHistorico(peca.nome, peca.fornecedor, peca.email, "Falha");
            }
        } catch (erro) {
            falhas++;
            adicionarAoHistorico(peca.nome, peca.fornecedor, peca.email, "Falha");
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    mostrarToast(`📧 ${sucessos} sucesso(s), ${falhas} falha(s).`, "success");
    renderizarDashboard();
    atualizarUltimaSincronizacao();
}

// ==================== MODAIS ==================== 

function abrirModalConfirmacao() {
    const pecasNaoFornecidas = pecas.filter(p => p.status === "Não fornecida");
    const quantidade = pecasNaoFornecidas.length;

    if (quantidade === 0) {
        mostrarToast("✅ Nenhuma peça pendente!", "info");
        return;
    }

    document.getElementById("mensagemConfirmacao").textContent = 
        `Deseja disparar e-mail para ${quantidade} fornecedor(es)?`;
    
    document.getElementById("modalConfirmacao").classList.remove("hidden");
}

function fecharModalConfirmacao() {
    document.getElementById("modalConfirmacao").classList.add("hidden");
}

// ==================== UTILITÁRIOS ==================== 

function mostrarToast(mensagem, tipo = "success") {
    const toast = document.getElementById("toast");
    toast.textContent = mensagem;

    if (tipo === "error") {
        toast.classList.remove("bg-green-600", "bg-blue-600");
        toast.classList.add("bg-red-600");
    } else if (tipo === "info") {
        toast.classList.remove("bg-green-600", "bg-red-600");
        toast.classList.add("bg-blue-600");
    } else {
        toast.classList.add("bg-green-600");
        toast.classList.remove("bg-red-600", "bg-blue-600");
    }

    toast.classList.remove("hidden");
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.add("hidden");
        toast.classList.remove("show");
    }, 4000);
}

function atualizarUltimaSincronizacao() {
    const agora = new Date();
    const horario = agora.toLocaleTimeString("pt-BR");
    document.getElementById("ultimaSincronizacao").textContent = horario;
}

// ==================== PERSISTÊNCIA ==================== 

function salvarDadosLocais() {
    localStorage.setItem("pecasData", JSON.stringify(pecas));
    localStorage.setItem("historicoData", JSON.stringify(historicoAlertas));
    localStorage.setItem("produtosData", JSON.stringify(produtos));
}

function carregarDadosLocais() {
    const pecasSalvas = localStorage.getItem("pecasData");
    const historicoSalvo = localStorage.getItem("historicoData");
    const produtosSalvos = localStorage.getItem("produtosData");

    if (pecasSalvas) pecas = JSON.parse(pecasSalvas);
    if (historicoSalvo) historicoAlertas = JSON.parse(historicoSalvo);
    if (produtosSalvos) produtos = JSON.parse(produtosSalvos);
}

console.log("✅ Sistema carregado com sucesso!");

// ==================== INICIALIZAÇÃO ==================== 

document.addEventListener("DOMContentLoaded", function() {
    console.log("✅ Página carregada. Iniciando sistema...");
    
    // Carregar dados do localStorage se existirem
    carregarDadosLocais();
    
    // Inicializar elementos
    inicializarEventos();
    
    // Renderizar dados iniciais
    renderizarDashboard();
    renderizarTabelaPecas();
    renderizarHistorico();
    
    // Atualizar timestamp
    atualizarUltimaSincronizacao();
    
    // Simular reconexão periódica
    setInterval(verificarConexao, 30000);
});

// ==================== GERENCIAMENTO DE ABAS ==================== 

function inicializarEventos() {
    // Event listeners para tabs
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            const tabName = this.getAttribute("data-tab");
            trocarAba(tabName);
        });
    });

    // Modal - Adicionar Peça
    document.getElementById("btnNovaPeca").addEventListener("click", abrirModalPeca);
    document.getElementById("btnFecharModal").addEventListener("click", fecharModalPeca);
    document.getElementById("formularioPeca").addEventListener("submit", salvarPeca);

    // Modal - Confirmação de Notificação
    document.getElementById("notificarTodosBtn").addEventListener("click", abrirModalConfirmacao);
    document.getElementById("btnConfirmarNotificacao").addEventListener("click", notificarTodosPendentes);
    document.getElementById("btnCancelarConfirmacao").addEventListener("click", fecharModalConfirmacao);

    // Filtros
    document.getElementById("campoBusca").addEventListener("input", filtrarTabelaPecas);
    document.getElementById("filtroStatus").addEventListener("change", filtrarTabelaPecas);

    // Fechar modal ao clicar no backdrop
    document.getElementById("modalPeca").addEventListener("click", function(e) {
        if (e.target === this) fecharModalPeca();
    });

    document.getElementById("modalConfirmacao").addEventListener("click", function(e) {
        if (e.target === this) fecharModalConfirmacao();
    });
}

function trocarAba(tabName) {
    // Ocultar todas as abas
    document.querySelectorAll(".tab-content").forEach(content => {
        content.classList.add("hidden");
    });

    // Remover active de todos os botões
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    // Mostrar aba selecionada
    document.getElementById(tabName + "-tab").classList.remove("hidden");

    // Marcar botão como ativo
    document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");

    // Recarregar dados da aba se necessário
    if (tabName === "dashboard") {
        renderizarDashboard();
    } else if (tabName === "gestao") {
        renderizarTabelaPecas();
    } else if (tabName === "historico") {
        renderizarHistorico();
    }
}

// ==================== DASHBOARD ==================== 

function renderizarDashboard() {
    const totalPecas = pecas.length;
    const pecasEntregues = pecas.filter(p => p.status === "Fornecida").length;
    const pecasAtrasadas = pecas.filter(p => p.status === "Não fornecida").length;
    const notificadosHoje = historicoAlertas.filter(log => {
        const hoje = new Date().toDateString();
        return new Date(log.dataHora).toDateString() === hoje;
    }).length;

    // Atualizar cards
    document.getElementById("totalPecas").textContent = totalPecas;
    document.getElementById("pecasEntregues").textContent = pecasEntregues;
    document.getElementById("pecasAtrasadas").textContent = pecasAtrasadas;
    document.getElementById("notificadosHoje").textContent = notificadosHoje;

    // Renderizar tabela de alertas
    const tabelaAlertas = document.getElementById("tabelaAlertasCorpo");
    const pecasNaoFornecidas = pecas.filter(p => p.status === "Não fornecida");

    if (pecasNaoFornecidas.length === 0) {
        tabelaAlertas.innerHTML = '<tr><td colspan="5" class="px-4 py-6 text-center text-gray-500"></td></tr>';
        document.getElementById("mensagemAlertasVazio").classList.remove("hidden");
    } else {
        document.getElementById("mensagemAlertasVazio").classList.add("hidden");
        tabelaAlertas.innerHTML = pecasNaoFornecidas.map(peca => `
            <tr class="row-alerta">
                <td class="px-4 py-3">${peca.codigo}</td>
                <td class="px-4 py-3"><strong>${peca.nome}</strong></td>
                <td class="px-4 py-3">${peca.fornecedor}</td>
                <td class="px-4 py-3">${peca.email}</td>
                <td class="px-4 py-3"><span class="status-badge status-nao-fornecida">⚠️ Não fornecida</span></td>
            </tr>
        `).join("");
    }
}

// ==================== GESTÃO DE PEÇAS ==================== 

function renderizarTabelaPecas() {
    const tabelaPecas = document.getElementById("tabelaPecasCorpo");
    
    if (pecas.length === 0) {
        tabelaPecas.innerHTML = '<tr><td colspan="6" class="px-4 py-6 text-center text-gray-500">Nenhuma peça cadastrada.</td></tr>';
        return;
    }

    tabelaPecas.innerHTML = pecas.map(peca => {
        const statusClass = peca.status === "Fornecida" ? "status-fornecida" : "status-nao-fornecida";
        const statusBadge = peca.status === "Fornecida" ? "✅ Fornecida" : "⚠️ Não fornecida";
        const btnEmailDisabled = peca.status === "Fornecida" ? "disabled" : "";

        return `
            <tr>
                <td class="px-4 py-3 font-semibold">${peca.codigo}</td>
                <td class="px-4 py-3">${peca.nome}</td>
                <td class="px-4 py-3">${peca.fornecedor}</td>
                <td class="px-4 py-3">${peca.email}</td>
                <td class="px-4 py-3"><span class="status-badge ${statusClass}">${statusBadge}</span></td>
                <td class="px-4 py-3 flex space-x-1">
                    <button class="btn-action btn-editar" title="Editar" onclick="abrirModalEdicao(${peca.id})">✏️</button>
                    <button class="btn-action btn-email" title="Disparar E-mail" onclick="dispararEmailIndividual(${peca.id})" ${btnEmailDisabled}>📧</button>
                    <button class="btn-action btn-deletar" title="Deletar" onclick="deletarPeca(${peca.id})">🗑️</button>
                </td>
            </tr>
        `;
    }).join("");
}

function filtrarTabelaPecas() {
    const busca = document.getElementById("campoBusca").value.toLowerCase();
    const statusFiltro = document.getElementById("filtroStatus").value;

    const pecasFiltradas = pecas.filter(peca => {
        const matchBusca = peca.codigo.toLowerCase().includes(busca) ||
                          peca.nome.toLowerCase().includes(busca) ||
                          peca.fornecedor.toLowerCase().includes(busca);
        
        const matchStatus = statusFiltro === "" || peca.status === statusFiltro;

        return matchBusca && matchStatus;
    });

    const tabelaPecas = document.getElementById("tabelaPecasCorpo");
    if (pecasFiltradas.length === 0) {
        tabelaPecas.innerHTML = '<tr><td colspan="6" class="px-4 py-6 text-center text-gray-500">Nenhuma peça encontrada.</td></tr>';
        return;
    }

    tabelaPecas.innerHTML = pecasFiltradas.map(peca => {
        const statusClass = peca.status === "Fornecida" ? "status-fornecida" : "status-nao-fornecida";
        const statusBadge = peca.status === "Fornecida" ? "✅ Fornecida" : "⚠️ Não fornecida";
        const btnEmailDisabled = peca.status === "Fornecida" ? "disabled" : "";

        return `
            <tr>
                <td class="px-4 py-3 font-semibold">${peca.codigo}</td>
                <td class="px-4 py-3">${peca.nome}</td>
                <td class="px-4 py-3">${peca.fornecedor}</td>
                <td class="px-4 py-3">${peca.email}</td>
                <td class="px-4 py-3"><span class="status-badge ${statusClass}">${statusBadge}</span></td>
                <td class="px-4 py-3 flex space-x-1">
                    <button class="btn-action btn-editar" title="Editar" onclick="abrirModalEdicao(${peca.id})">✏️</button>
                    <button class="btn-action btn-email" title="Disparar E-mail" onclick="dispararEmailIndividual(${peca.id})" ${btnEmailDisabled}>📧</button>
                    <button class="btn-action btn-deletar" title="Deletar" onclick="deletarPeca(${peca.id})">🗑️</button>
                </td>
            </tr>
        `;
    }).join("");
}

// ==================== MODAIS ==================== 

function abrirModalPeca() {
    editandoId = null;
    document.getElementById("modalTitulo").textContent = "Adicionar Nova Peça";
    document.getElementById("formularioPeca").reset();
    document.getElementById("inputStatus").value = "Não fornecida";
    document.getElementById("modalPeca").classList.remove("hidden");
}

function abrirModalEdicao(id) {
    const peca = pecas.find(p => p.id === id);
    if (!peca) return;

    editandoId = id;
    document.getElementById("modalTitulo").textContent = "Editar Peça";
    document.getElementById("inputCodigo").value = peca.codigo;
    document.getElementById("inputNomePeca").value = peca.nome;
    document.getElementById("inputFornecedor").value = peca.fornecedor;
    document.getElementById("inputEmail").value = peca.email;
    document.getElementById("inputStatus").value = peca.status;
    document.getElementById("modalPeca").classList.remove("hidden");
}

function fecharModalPeca() {
    document.getElementById("modalPeca").classList.add("hidden");
    editandoId = null;
}

function salvarPeca(e) {
    e.preventDefault();

    const codigo = document.getElementById("inputCodigo").value.trim();
    const nome = document.getElementById("inputNomePeca").value.trim();
    const fornecedor = document.getElementById("inputFornecedor").value.trim();
    const email = document.getElementById("inputEmail").value.trim();
    const status = document.getElementById("inputStatus").value;

    if (!codigo || !nome || !fornecedor || !email) {
        mostrarToast("❌ Todos os campos são obrigatórios!", "error");
        return;
    }

    if (editandoId) {
        // Editar peça existente
        const peca = pecas.find(p => p.id === editandoId);
        if (peca) {
            peca.codigo = codigo;
            peca.nome = nome;
            peca.fornecedor = fornecedor;
            peca.email = email;
            peca.status = status;
            mostrarToast("✅ Peça atualizada com sucesso!", "success");
        }
    } else {
        // Adicionar nova peça
        const novaId = Math.max(...pecas.map(p => p.id), 0) + 1;
        pecas.push({
            id: novaId,
            codigo,
            nome,
            fornecedor,
            email,
            status
        });
        mostrarToast("✅ Peça adicionada com sucesso!", "success");
    }

    salvarDadosLocais();
    fecharModalPeca();
    renderizarTabelaPecas();
    renderizarDashboard();
}

function deletarPeca(id) {
    if (confirm("Tem certeza que deseja deletar esta peça?")) {
        pecas = pecas.filter(p => p.id !== id);
        salvarDadosLocais();
        renderizarTabelaPecas();
        renderizarDashboard();
        mostrarToast("✅ Peça deletada com sucesso!", "success");
    }
}

// ==================== HISTÓRICO ==================== 

function renderizarHistorico() {
    const tabelaHistorico = document.getElementById("tabelaHistoricoCorpo");

    if (historicoAlertas.length === 0) {
        tabelaHistorico.innerHTML = '<tr><td colspan="5" class="px-4 py-6 text-center text-gray-500">Nenhum registro de envio ainda.</td></tr>';
        return;
    }

    tabelaHistorico.innerHTML = historicoAlertas.map(log => {
        const statusBadge = log.status === "Sucesso" 
            ? '<span class="status-badge status-fornecida">✅ Sucesso</span>'
            : '<span class="status-badge status-nao-fornecida">❌ Falha</span>';

        return `
            <tr>
                <td class="px-4 py-3">${log.dataHora}</td>
                <td class="px-4 py-3">${log.peca}</td>
                <td class="px-4 py-3">${log.fornecedor}</td>
                <td class="px-4 py-3">${log.emailDestino}</td>
                <td class="px-4 py-3">${statusBadge}</td>
            </tr>
        `;
    }).join("");
}

// ==================== INTEGRAÇÃO COM POWER AUTOMATE ==================== 

async function dispararEmailIndividual(id) {
    const peca = pecas.find(p => p.id === id);
    if (!peca || peca.status === "Fornecida") return;

    const botao = event.target.closest("button");
    const originalText = botao.innerHTML;
    botao.innerHTML = '<span class="spinner"></span>';
    botao.disabled = true;

    try {
        const response = await fetch(POWER_AUTOMATE_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nomePeca: peca.nome,
                codigoPeca: peca.codigo,
                fornecedor: peca.fornecedor,
                emailFornecedor: peca.email,
                dataEnvio: new Date().toISOString()
            })
        });

        if (response.ok) {
            mostrarToast(`📧 E-mail de cobrança enviado com sucesso para ${peca.email}!`, "success");
            adicionarAoHistorico(peca, "Sucesso");
        } else {
            mostrarToast(`❌ Erro ao enviar e-mail. Status: ${response.status}`, "error");
            adicionarAoHistorico(peca, "Falha");
        }
    } catch (erro) {
        console.error("❌ Erro na requisição:", erro);
        mostrarToast("❌ Erro ao conectar com Power Automate. Verifique a URL do webhook.", "error");
        adicionarAoHistorico(peca, "Falha");
    }

    botao.innerHTML = originalText;
    botao.disabled = false;
    atualizarUltimaSincronizacao();
}

async function notificarTodosPendentes() {
    const pecasNaoFornecidas = pecas.filter(p => p.status === "Não fornecida");

    if (pecasNaoFornecidas.length === 0) {
        mostrarToast("✅ Nenhuma peça pendente para notificar!", "info");
        fecharModalConfirmacao();
        return;
    }

    fecharModalConfirmacao();
    
    let sucessos = 0;
    let falhas = 0;

    for (const peca of pecasNaoFornecidas) {
        try {
            const response = await fetch(POWER_AUTOMATE_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nomePeca: peca.nome,
                    codigoPeca: peca.codigo,
                    fornecedor: peca.fornecedor,
                    emailFornecedor: peca.email,
                    dataEnvio: new Date().toISOString()
                })
            });

            if (response.ok) {
                sucessos++;
                adicionarAoHistorico(peca, "Sucesso");
            } else {
                falhas++;
                adicionarAoHistorico(peca, "Falha");
            }
        } catch (erro) {
            console.error("Erro ao notificar:", erro);
            falhas++;
            adicionarAoHistorico(peca, "Falha");
        }

        // Pequeno delay entre requisições
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    mostrarToast(`📧 Notificação em lote concluída! ${sucessos} sucesso(s), ${falhas} falha(s).`, "success");
    renderizarDashboard();
    atualizarUltimaSincronizacao();
}

function adicionarAoHistorico(peca, status) {
    const agora = new Date();
    const dataHora = agora.toLocaleString("pt-BR");

    historicoAlertas.push({
        dataHora,
        peca: peca.nome,
        fornecedor: peca.fornecedor,
        emailDestino: peca.email,
        status
    });

    // Manter apenas os últimos 100 registros
    if (historicoAlertas.length > 100) {
        historicoAlertas = historicoAlertas.slice(-100);
    }

    salvarDadosLocais();
}

// ==================== MODAIS DE CONFIRMAÇÃO ==================== 

function abrirModalConfirmacao() {
    const pecasNaoFornecidas = pecas.filter(p => p.status === "Não fornecida");
    const quantidade = pecasNaoFornecidas.length;

    if (quantidade === 0) {
        mostrarToast("✅ Nenhuma peça pendente para notificar!", "info");
        return;
    }

    document.getElementById("mensagemConfirmacao").textContent = 
        `Deseja disparar e-mail de cobrança para ${quantidade} fornecedor(es) com peças pendentes?`;
    
    document.getElementById("modalConfirmacao").classList.remove("hidden");
}

function fecharModalConfirmacao() {
    document.getElementById("modalConfirmacao").classList.add("hidden");
}

// ==================== UTILITÁRIOS ==================== 

function mostrarToast(mensagem, tipo = "success") {
    const toast = document.getElementById("toast");
    toast.textContent = mensagem;

    if (tipo === "error") {
        toast.classList.remove("bg-green-600");
        toast.classList.add("bg-red-600");
    } else if (tipo === "info") {
        toast.classList.remove("bg-green-600");
        toast.classList.add("bg-blue-600");
    } else {
        toast.classList.add("bg-green-600");
        toast.classList.remove("bg-red-600", "bg-blue-600");
    }

    toast.classList.remove("hidden");
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.add("hidden");
        toast.classList.remove("show");
    }, 4000);
}

function atualizarUltimaSincronizacao() {
    const agora = new Date();
    const horario = agora.toLocaleTimeString("pt-BR");
    document.getElementById("ultimaSincronizacao").textContent = horario;
}

function verificarConexao() {
    const statusIndicador = document.getElementById("statusIndicator");
    const statusTexto = document.getElementById("statusText");

    // Simular verificação de conexão
    const conectado = Math.random() > 0.1; // 90% de chance de estar conectado

    if (conectado) {
        statusIndicador.classList.remove("bg-red-500");
        statusIndicador.classList.add("bg-green-500");
        statusTexto.textContent = "Conectado";
    } else {
        statusIndicador.classList.remove("bg-green-500");
        statusIndicador.classList.add("bg-red-500");
        statusTexto.textContent = "Desconectado";
    }
}

// ==================== PERSISTÊNCIA DE DADOS (LocalStorage) ==================== 

function salvarDadosLocais() {
    localStorage.setItem("pecasData", JSON.stringify(pecas));
    localStorage.setItem("historicoData", JSON.stringify(historicoAlertas));
}

function carregarDadosLocais() {
    const pecasSalvas = localStorage.getItem("pecasData");
    const historicoSalvo = localStorage.getItem("historicoData");

    if (pecasSalvas) {
        pecas = JSON.parse(pecasSalvas);
    }

    if (historicoSalvo) {
        historicoAlertas = JSON.parse(historicoSalvo);
    }
}

// ==================== FUNÇÕES AUXILIARES ==================== 

function formatarData(data) {
    return new Date(data).toLocaleString("pt-BR");
}

console.log("✅ Sistema carregado com sucesso!");

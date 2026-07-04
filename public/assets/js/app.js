/**
 * Digital PMO - Núcleo compartilhado entre páginas
 *
 * Cada página HTML (dashboard, projetos, sprints...) carrega este arquivo
 * e chama PMO.iniciar('slug') para montar o menu e renderizar seu conteúdo.
 */
const PMO = (() => {
    /* ===== CONFIGURACAO DE MODULOS =====
       Cada módulo agora é uma página própria (href real, sem JS de rota) */
    const modulos = {
        dashboard: { nome: 'Dashboard', pagina: 'index.html', render: renderDashboard },
        projetos: { nome: 'Projetos', pagina: 'projetos.html', render: renderProjetos },
        sprints: { nome: 'Sprints', pagina: 'sprints.html', render: renderSprints },
        tarefas: { nome: 'Tarefas', pagina: 'tarefas.html', render: renderTarefas },
        kanban: { nome: 'Kanban', pagina: 'kanban.html', render: renderKanban },
    };

    /* ===== INICIALIZACAO ===== */

    /**
     * Monta o menu lateral e renderiza o módulo da página atual
     *
     * @param {string} slugAtivo - módulo desta página (ex: 'projetos')
     */
    function iniciar(slugAtivo) {
        const menu = document.getElementById('menu');
        Object.entries(modulos).forEach(([slug, { nome, pagina }]) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.textContent = nome;
            a.href = pagina;
            if (slug === slugAtivo) a.classList.add('ativo');
            li.appendChild(a);
            menu.appendChild(li);
        });

        document.getElementById('titulo').textContent = modulos[slugAtivo].nome;
        modulos[slugAtivo].render();
    }

    /* ===== "BANCO" LOCAL (localStorage) =====
       ponytail: sem servidor, dados ficam só neste navegador. Se precisar de
       banco compartilhado entre usuários, volte para api.php + MySQL. */
    const CHAVE_BANCO = 'pmo_banco';

    function bancoPadrao() {
        return {
            proximoId: { projeto: 2, sprint: 3, tarefa: 8 },
            projetos: [
                { ID: 1, Nome: 'Expansão Planta Industrial', Cliente: 'Cliente Alfa', Status: 'Em Andamento', Inicio: '2026-01-05' }
            ],
            sprints: [
                { ID: 1, Nome: 'Sprint 1', Objetivo: 'Levantamento e projeto elétrico', DataInicio: '2026-07-01', DataFim: '2026-07-14', Status: 'Concluído' },
                { ID: 2, Nome: 'Sprint 2', Objetivo: 'Projeto mecânico e revisão', DataInicio: '2026-07-15', DataFim: '2026-07-28', Status: 'Em Andamento' }
            ],
            tarefas: [
                { ID: 1, Titulo: 'Levantar cargas elétricas', Descricao: 'Mapear consumo dos motores', Tipo: 'Tarefa', Prioridade: 'Alta', Responsavel: 'Bruno Lima', Status: 'Concluído', DataInicio: '2026-07-01', DataFim: '2026-07-05', StoryPoints: 5, Horas: 16 },
                { ID: 2, Titulo: 'Revisar diagrama unifilar', Descricao: 'Atualizar diagrama com novas cargas', Tipo: 'Tarefa', Prioridade: 'Média', Responsavel: 'Bruno Lima', Status: 'Em Revisão', DataInicio: '2026-07-06', DataFim: '2026-07-10', StoryPoints: 3, Horas: 8 },
                { ID: 3, Titulo: 'Dimensionar esteira', Descricao: 'Calcular capacidade e motor', Tipo: 'Tarefa', Prioridade: 'Alta', Responsavel: 'Fernanda Alves', Status: 'Em Desenvolvimento', DataInicio: '2026-07-15', DataFim: '2026-07-22', StoryPoints: 8, Horas: 24 },
                { ID: 4, Titulo: 'Especificar rolamentos', Descricao: 'Selecionar componentes mecânicos', Tipo: 'Tarefa', Prioridade: 'Baixa', Responsavel: 'Fernanda Alves', Status: 'Pronto Sprint', DataInicio: '2026-07-20', DataFim: '2026-07-24', StoryPoints: 2, Horas: 6 },
                { ID: 5, Titulo: 'Validar fornecedor de painel', Descricao: 'Cotação e homologação', Tipo: 'Tarefa', Prioridade: 'Média', Responsavel: 'Bruno Lima', Status: 'Refinamento', DataInicio: null, DataFim: null, StoryPoints: 3, Horas: 10 },
                { ID: 6, Titulo: 'Testar protótipo de esteira', Descricao: 'Ensaio em bancada', Tipo: 'Tarefa', Prioridade: 'Alta', Responsavel: 'Fernanda Alves', Status: 'Backlog', DataInicio: null, DataFim: null, StoryPoints: 5, Horas: 20 },
                { ID: 7, Titulo: 'Ideia: sensor de vibração', Descricao: 'Avaliar viabilidade', Tipo: 'Ideia', Prioridade: 'Baixa', Responsavel: 'Carlos Mendes', Status: 'Novo', DataInicio: null, DataFim: null, StoryPoints: 1, Horas: 4 }
            ]
        };
    }

    function carregarBanco() {
        const salvo = localStorage.getItem(CHAVE_BANCO);
        if (salvo) return JSON.parse(salvo);
        const banco = bancoPadrao();
        salvarBanco(banco);
        return banco;
    }

    function salvarBanco(banco) {
        localStorage.setItem(CHAVE_BANCO, JSON.stringify(banco));
    }

    function contarAgrupado(lista, chave, rotuloVazio) {
        const grupos = {};
        lista.forEach(item => {
            const rotulo = item[chave] || rotuloVazio;
            grupos[rotulo] = (grupos[rotulo] || 0) + 1;
        });
        return Object.entries(grupos)
            .map(([label, total]) => ({ label, total }))
            .sort((a, b) => b.total - a.total);
    }

    const TABELAS = { projeto: 'projetos', sprint: 'sprints', tarefa: 'tarefas' };

    /**
     * Simula a API backend usando localStorage (sem servidor/PHP necessário)
     *
     * @param {string} endpoint - ação desejada (dashboard, projetos, etc)
     * @param {string} metodo - GET ou POST (mantido por compatibilidade)
     * @param {object} dados - dados da operação (inserir/atualizar/excluir)
     * @returns {Promise<object>} resposta no mesmo formato da antiga api.php
     */
    async function api(endpoint, metodo = 'GET', dados = null) {
        const banco = carregarBanco();

        switch (endpoint) {
            case 'dashboard':
                return {
                    totalProjetos: banco.projetos.length,
                    totalTarefas: banco.tarefas.length,
                    totalSprints: banco.sprints.length,
                    porStatus: contarAgrupado(banco.tarefas, 'Status', 'Sem status'),
                    porPrioridade: contarAgrupado(banco.tarefas, 'Prioridade', 'Sem prioridade'),
                    porResponsavel: contarAgrupado(banco.tarefas, 'Responsavel', 'Sem responsável'),
                    porSprint: [{ label: 'Sem sprint', total: banco.tarefas.length }],
                    porEntregavel: [{ label: 'Sem entregável', total: banco.tarefas.length }]
                };

            case 'projetos':
                return { projetos: [...banco.projetos].sort((a, b) => b.ID - a.ID) };

            case 'sprints':
                return { sprints: [...banco.sprints].sort((a, b) => b.ID - a.ID) };

            case 'tarefas':
                return { tarefas: [...banco.tarefas].sort((a, b) => b.ID - a.ID).slice(0, 100) };

            case 'inserir': {
                const tipo = dados.tipo;
                const tabela = TABELAS[tipo];
                if (!tabela) return { sucesso: false, erro: 'Tipo de inserção inválido' };

                const registro = montarRegistro(tipo, dados);
                if (registro.erro) return { sucesso: false, erro: registro.erro };

                registro.ID = banco.proximoId[tipo]++;
                banco[tabela].push(registro);
                salvarBanco(banco);
                return { sucesso: true };
            }

            case 'atualizar': {
                if (!dados.id) return { sucesso: false, erro: 'ID é obrigatório' };
                const tipo = dados.tipo;
                const tabela = TABELAS[tipo];
                if (!tabela) return { sucesso: false, erro: 'Tipo de atualização inválido' };

                const registro = montarRegistro(tipo, dados);
                if (registro.erro) return { sucesso: false, erro: registro.erro };

                const indice = banco[tabela].findIndex(r => r.ID == dados.id);
                if (indice === -1) return { sucesso: false, erro: 'Registro não encontrado' };

                registro.ID = banco[tabela][indice].ID;
                banco[tabela][indice] = registro;
                salvarBanco(banco);
                return { sucesso: true };
            }

            case 'excluir': {
                if (!dados.id) return { sucesso: false, erro: 'ID é obrigatório' };
                const tabela = TABELAS[dados.tipo];
                if (!tabela) return { sucesso: false, erro: 'Tipo de exclusão inválido' };

                banco[tabela] = banco[tabela].filter(r => r.ID != dados.id);
                salvarBanco(banco);
                return { sucesso: true };
            }

            default:
                return { erro: 'Ação não encontrada' };
        }
    }

    /**
     * Valida e monta o registro de projeto/sprint/tarefa a partir do payload do formulário
     */
    function montarRegistro(tipo, dados) {
        if (tipo === 'projeto') {
            if (!dados.nome || !dados.cliente) return { erro: 'Nome e cliente são obrigatórios' };
            return { Nome: dados.nome.trim(), Cliente: dados.cliente.trim(), Status: dados.status || 'Ativo', Inicio: new Date().toISOString().slice(0, 10) };
        }
        if (tipo === 'sprint') {
            if (!dados.nome || !dados.inicio || !dados.fim) return { erro: 'Nome, início e fim são obrigatórios' };
            return { Nome: dados.nome.trim(), Objetivo: (dados.objetivo || '').trim(), DataInicio: dados.inicio, DataFim: dados.fim, Status: dados.status || 'Ativa' };
        }
        if (tipo === 'tarefa') {
            if (!dados.titulo) return { erro: 'Título é obrigatório' };
            return {
                Titulo: dados.titulo.trim(),
                Descricao: (dados.descricao || '').trim(),
                Tipo: dados.tipoItem || 'Tarefa',
                Prioridade: dados.prioridade || null,
                Responsavel: (dados.responsavel || '').trim(),
                Status: dados.status || 'Novo',
                DataInicio: dados.dataInicio || null,
                DataFim: dados.dataFim || null,
                StoryPoints: dados.storyPoints || null,
                Horas: dados.horas || null
            };
        }
        return { erro: 'Tipo inválido' };
    }

    /* ===== RENDERIZADORES ===== */

    /**
     * Dashboard: mostra estatísticas gerais
     */
    async function renderDashboard() {
        const dados = await api('dashboard');
        if (dados.erro) {
            document.getElementById('conteudo').innerHTML = '<p>Erro ao carregar dashboard</p>';
            return;
        }

        document.getElementById('conteudo').innerHTML = `
            <ul class="cards">
                <li class="card">
                    <div class="card-valor">${dados.totalProjetos}</div>
                    <div class="card-label">Projetos</div>
                </li>
                <li class="card">
                    <div class="card-valor">${dados.totalTarefas}</div>
                    <div class="card-label">Tarefas</div>
                </li>
                <li class="card">
                    <div class="card-valor">${dados.totalSprints}</div>
                    <div class="card-label">Sprints</div>
                </li>
            </ul>
            <div class="dashboard-grid">
                ${renderBarChart('Tarefas por Entregável', dados.porEntregavel)}
                ${renderBarChart('Tarefas por Responsável', dados.porResponsavel)}
                ${renderBarChart('Tarefas por Sprint', dados.porSprint)}
                ${renderBarChart('Tarefas por Status', dados.porStatus)}
                ${renderBarChart('Tarefas por Prioridade', dados.porPrioridade)}
            </div>
        `;
    }

    /**
     * Monta um gráfico de barras horizontais em CSS puro a partir de [{label, total}]
     */
    function renderBarChart(titulo, itens) {
        if (!itens || itens.length === 0) {
            return `<div class="chart-panel"><h3>${titulo}</h3><p class="chart-vazio">Sem dados</p></div>`;
        }

        const maximo = Math.max(...itens.map(i => i.total));
        const cores = ['#2a78d6', '#1baf7a', '#eda100', '#008300', '#4a3aa7', '#e34948', '#e87ba4', '#eb6834'];

        const linhas = itens.map((item, i) => {
            const largura = maximo > 0 ? Math.round((item.total / maximo) * 100) : 0;
            const cor = cores[i % cores.length];
            return `
                <div class="bar-row">
                    <span class="bar-label" title="${escaparHtml(item.label)}">${escaparHtml(item.label)}</span>
                    <div class="bar-track">
                        <div class="bar-fill" style="width:${largura}%;background:${cor}"></div>
                    </div>
                    <span class="bar-valor">${item.total}</span>
                </div>
            `;
        }).join('');

        return `<div class="chart-panel"><h3>${titulo}</h3>${linhas}</div>`;
    }

    /**
     * Exclui um registro (com confirmação) e re-renderiza a lista
     */
    async function excluirRegistro(tipo, id, renderFn, msgConfirmacao) {
        if (!confirm(msgConfirmacao)) return;
        const res = await api('excluir', 'POST', { tipo, id });
        if (res.sucesso) {
            mostrarSucesso('Excluído com sucesso!');
            renderFn();
        } else {
            mostrarErro(res.erro || 'Erro ao excluir');
        }
    }

    /**
     * Projetos: lista e permite adicionar/editar/excluir projetos
     */
    async function renderProjetos() {
        const dados = await api('projetos');
        if (dados.erro) {
            document.getElementById('conteudo').innerHTML = '<p>Erro ao carregar projetos</p>';
            return;
        }

        let html = `
            <form id="formProjeto" class="form-cadastro">
                <input type="hidden" name="id">
                <label>Nome <input type="text" name="nome" required></label>
                <label>Cliente <input type="text" name="cliente" required></label>
                <label>Status
                    <select name="status">
                        <option>Ativo</option>
                        <option>Pausado</option>
                        <option>Concluído</option>
                        <option>Cancelado</option>
                    </select>
                </label>
                <button type="submit">Adicionar</button>
            </form>
            <table>
                <tr><th>ID</th><th>Nome</th><th>Cliente</th><th>Status</th><th>Início</th><th>Ações</th></tr>
        `;

        dados.projetos.forEach(p => {
            const data = new Date(p.Inicio).toLocaleDateString('pt-BR');
            html += `<tr><td>${p.ID}</td><td>${escaparHtml(p.Nome)}</td><td>${escaparHtml(p.Cliente)}</td><td><span class="badge badge-blue">${p.Status}</span></td><td>${data}</td>
                <td><button type="button" data-editar="${p.ID}">Editar</button> <button type="button" data-excluir="${p.ID}">Excluir</button></td></tr>`;
        });

        html += '</table>';
        document.getElementById('conteudo').innerHTML = html;

        const form = document.getElementById('formProjeto');
        form.onsubmit = async (e) => {
            e.preventDefault();
            const dadosForm = new FormData(form);
            const id = dadosForm.get('id');
            const payload = {
                tipo: 'projeto',
                nome: dadosForm.get('nome'),
                cliente: dadosForm.get('cliente'),
                status: dadosForm.get('status')
            };

            const res = id
                ? await api('atualizar', 'POST', { ...payload, id })
                : await api('inserir', 'POST', payload);

            if (res.sucesso) {
                mostrarSucesso(id ? 'Projeto atualizado com sucesso!' : 'Projeto adicionado com sucesso!');
                setTimeout(() => renderProjetos(), 1000);
            } else {
                mostrarErro(res.erro || 'Erro ao salvar projeto');
            }
        };

        dados.projetos.forEach(p => {
            document.querySelector(`[data-editar="${p.ID}"]`).onclick = () => {
                form.elements['id'].value = p.ID;
                form.elements['nome'].value = p.Nome;
                form.elements['cliente'].value = p.Cliente;
                form.elements['status'].value = p.Status;
                form.querySelector('button').textContent = 'Salvar edição';
            };
            document.querySelector(`[data-excluir="${p.ID}"]`).onclick = () =>
                excluirRegistro('projeto', p.ID, renderProjetos, `Excluir o projeto "${p.Nome}"?`);
        });
    }

    /**
     * Sprints: lista e permite adicionar/editar/excluir sprints
     */
    async function renderSprints() {
        const dados = await api('sprints');
        if (dados.erro) {
            document.getElementById('conteudo').innerHTML = '<p>Erro ao carregar sprints</p>';
            return;
        }

        let html = `
            <form id="formSprint" class="form-cadastro">
                <input type="hidden" name="id">
                <label>Nome <input type="text" name="nome" required></label>
                <label>Objetivo <input type="text" name="objetivo"></label>
                <label>Início <input type="date" name="inicio" required></label>
                <label>Fim <input type="date" name="fim" required></label>
                <label>Status
                    <select name="status">
                        <option>Ativa</option>
                        <option>Concluída</option>
                        <option>Cancelada</option>
                    </select>
                </label>
                <button type="submit">Adicionar</button>
            </form>
            <table>
                <tr><th>ID</th><th>Nome</th><th>Objetivo</th><th>Status</th><th>Início</th><th>Fim</th><th>Ações</th></tr>
        `;

        dados.sprints.forEach(s => {
            const dataInicio = new Date(s.DataInicio).toLocaleDateString('pt-BR');
            const dataFim = new Date(s.DataFim).toLocaleDateString('pt-BR');
            html += `<tr><td>${s.ID}</td><td>${escaparHtml(s.Nome)}</td><td>${escaparHtml(s.Objetivo || '-')}</td><td><span class="badge badge-green">${s.Status}</span></td><td>${dataInicio}</td><td>${dataFim}</td>
                <td><button type="button" data-editar="${s.ID}">Editar</button> <button type="button" data-excluir="${s.ID}">Excluir</button></td></tr>`;
        });

        html += '</table>';
        document.getElementById('conteudo').innerHTML = html;

        const form = document.getElementById('formSprint');
        form.onsubmit = async (e) => {
            e.preventDefault();
            const dadosForm = new FormData(form);
            const id = dadosForm.get('id');
            const payload = {
                tipo: 'sprint',
                nome: dadosForm.get('nome'),
                objetivo: dadosForm.get('objetivo'),
                inicio: dadosForm.get('inicio'),
                fim: dadosForm.get('fim'),
                status: dadosForm.get('status')
            };

            const res = id
                ? await api('atualizar', 'POST', { ...payload, id })
                : await api('inserir', 'POST', payload);

            if (res.sucesso) {
                mostrarSucesso(id ? 'Sprint atualizada com sucesso!' : 'Sprint adicionada com sucesso!');
                setTimeout(() => renderSprints(), 1000);
            } else {
                mostrarErro(res.erro || 'Erro ao salvar sprint');
            }
        };

        dados.sprints.forEach(s => {
            document.querySelector(`[data-editar="${s.ID}"]`).onclick = () => {
                form.elements['id'].value = s.ID;
                form.elements['nome'].value = s.Nome;
                form.elements['objetivo'].value = s.Objetivo || '';
                form.elements['inicio'].value = s.DataInicio;
                form.elements['fim'].value = s.DataFim;
                form.elements['status'].value = s.Status;
                form.querySelector('button').textContent = 'Salvar edição';
            };
            document.querySelector(`[data-excluir="${s.ID}"]`).onclick = () =>
                excluirRegistro('sprint', s.ID, renderSprints, `Excluir a sprint "${s.Nome}"?`);
        });
    }

    /**
     * Tarefas: lista e permite adicionar/editar/excluir tarefas
     */
    async function renderTarefas() {
        const dados = await api('tarefas');
        if (dados.erro) {
            document.getElementById('conteudo').innerHTML = '<p>Erro ao carregar tarefas</p>';
            return;
        }

        let html = `
            <form id="formTarefa" class="form-cadastro">
                <input type="hidden" name="id">
                <label class="campo-full">Título <input type="text" name="titulo" required></label>
                <label class="campo-full">Descrição <textarea name="descricao"></textarea></label>
                <label>Tipo
                    <select name="tipoItem">
                        <option>Tarefa</option>
                        <option>Ideia</option>
                        <option>Bug</option>
                    </select>
                </label>
                <label>Prioridade
                    <select name="prioridade">
                        <option>Baixa</option>
                        <option>Média</option>
                        <option>Alta</option>
                    </select>
                </label>
                <label>Responsável <input type="text" name="responsavel"></label>
                <label>Status
                    <select name="status">
                        <option>Novo</option>
                        <option>Backlog</option>
                        <option>Refinamento</option>
                        <option>Pronto Sprint</option>
                        <option>Em Desenvolvimento</option>
                        <option>Em Revisão</option>
                        <option>Concluído</option>
                        <option>Atrasado</option>
                    </select>
                </label>
                <label>Início <input type="date" name="dataInicio"></label>
                <label>Fim <input type="date" name="dataFim"></label>
                <label>Story Points <input type="number" name="storyPoints" min="0"></label>
                <label>Horas <input type="number" name="horas" min="0" step="0.5"></label>
                <button type="submit">Adicionar</button>
            </form>
            <table>
                <tr><th>ID</th><th>Título</th><th>Responsável</th><th>Status</th><th>Prioridade</th><th>Ações</th></tr>
        `;

        dados.tarefas.forEach(t => {
            const prioridade = t.Prioridade ? `<span class="badge badge-red">${t.Prioridade}</span>` : '-';
            html += `<tr><td>${t.ID}</td><td>${escaparHtml(t.Titulo)}</td><td>${escaparHtml(t.Responsavel || '-')}</td><td><span class="badge badge-blue">${t.Status}</span></td><td>${prioridade}</td>
                <td><button type="button" data-editar="${t.ID}">Editar</button> <button type="button" data-excluir="${t.ID}">Excluir</button></td></tr>`;
        });

        html += '</table>';
        document.getElementById('conteudo').innerHTML = html;

        const form = document.getElementById('formTarefa');
        form.onsubmit = async (e) => {
            e.preventDefault();
            const dadosForm = new FormData(form);
            const id = dadosForm.get('id');
            const payload = {
                tipo: 'tarefa',
                titulo: dadosForm.get('titulo'),
                descricao: dadosForm.get('descricao'),
                tipoItem: dadosForm.get('tipoItem'),
                prioridade: dadosForm.get('prioridade'),
                responsavel: dadosForm.get('responsavel'),
                status: dadosForm.get('status'),
                dataInicio: dadosForm.get('dataInicio'),
                dataFim: dadosForm.get('dataFim'),
                storyPoints: dadosForm.get('storyPoints'),
                horas: dadosForm.get('horas')
            };

            const res = id
                ? await api('atualizar', 'POST', { ...payload, id })
                : await api('inserir', 'POST', payload);

            if (res.sucesso) {
                mostrarSucesso(id ? 'Tarefa atualizada com sucesso!' : 'Tarefa adicionada com sucesso!');
                setTimeout(() => renderTarefas(), 1000);
            } else {
                mostrarErro(res.erro || 'Erro ao salvar tarefa');
            }
        };

        dados.tarefas.forEach(t => {
            document.querySelector(`[data-editar="${t.ID}"]`).onclick = () => {
                form.elements['id'].value = t.ID;
                form.elements['titulo'].value = t.Titulo;
                form.elements['descricao'].value = t.Descricao || '';
                form.elements['tipoItem'].value = t.Tipo || 'Tarefa';
                form.elements['prioridade'].value = t.Prioridade || 'Baixa';
                form.elements['responsavel'].value = t.Responsavel || '';
                form.elements['status'].value = t.Status || 'Novo';
                form.elements['dataInicio'].value = t.DataInicio || '';
                form.elements['dataFim'].value = t.DataFim || '';
                form.elements['storyPoints'].value = t.StoryPoints || '';
                form.elements['horas'].value = t.Horas || '';
                form.querySelector('button').textContent = 'Salvar edição';
            };
            document.querySelector(`[data-excluir="${t.ID}"]`).onclick = () =>
                excluirRegistro('tarefa', t.ID, renderTarefas, `Excluir a tarefa "${t.Titulo}"?`);
        });
    }

    /**
     * Kanban: visualização das tarefas por status
     */
    async function renderKanban() {
        const dados = await api('tarefas');
        if (dados.erro) {
            document.getElementById('conteudo').innerHTML = '<p>Erro ao carregar kanban</p>';
            return;
        }

        const porStatus = {};
        dados.tarefas.forEach(t => {
            if (!porStatus[t.Status]) porStatus[t.Status] = [];
            porStatus[t.Status].push(t);
        });

        let html = '<div class="kanban">';
        Object.entries(porStatus).forEach(([status, tarefas]) => {
            html += `<div class="kanban-coluna"><h3>${status} (${tarefas.length})</h3>`;
            tarefas.forEach(t => {
                html += `<div class="kanban-item">${escaparHtml(t.Titulo)}</div>`;
            });
            html += '</div>';
        });
        html += '</div>';

        document.getElementById('conteudo').innerHTML = html;
    }

    /* ===== UTILITARIOS ===== */

    /**
     * Escapa caracteres HTML para evitar injeção (XSS)
     */
    function escaparHtml(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }

    function mostrarErro(msg) {
        document.getElementById('alerta').innerHTML = `<div class="erro">${escaparHtml(msg)}</div>`;
    }

    function mostrarSucesso(msg) {
        document.getElementById('alerta').innerHTML = `<div class="sucesso">${escaparHtml(msg)}</div>`;
    }

    return { iniciar };
})();

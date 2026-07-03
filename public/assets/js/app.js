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

    /* ===== REQUISICOES API ===== */

    /**
     * Faz requisição para a API backend
     *
     * @param {string} endpoint - ação desejada (dashboard, projetos, etc)
     * @param {string} metodo - GET ou POST
     * @param {object} dados - dados para enviar (se POST)
     * @returns {Promise<object>} resposta JSON da API
     */
    async function api(endpoint, metodo = 'GET', dados = null) {
        const opcoes = {
            method: metodo,
            headers: { 'Content-Type': 'application/json' }
        };

        if (dados) {
            opcoes.body = JSON.stringify(dados);
        }

        try {
            const resposta = await fetch(`api.php?a=${endpoint}`, opcoes);
            if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);
            return resposta.json();
        } catch (erro) {
            mostrarErro('Erro ao conectar com servidor: ' + erro.message);
            return { erro: erro.message };
        }
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
        `;
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

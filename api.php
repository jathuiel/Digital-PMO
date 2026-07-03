<?php
/**
 * Digital PMO - API Backend
 *
 * Backend mínimo que retorna dados em JSON.
 * Todas as operações de banco de dados são aqui.
 *
 * @version 1.1
 * @author PMO Team
 */

// ===== Headers de resposta =====
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// ===== Configuração de banco de dados =====
$configuracaoBanco = require __DIR__ . '/config/database.php';

try {
    $conexao = new PDO(
        "mysql:host={$configuracaoBanco['host']};dbname={$configuracaoBanco['name']};charset=utf8mb4",
        $configuracaoBanco['user'],
        $configuracaoBanco['pass'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
} catch (PDOException $erro) {
    http_response_code(500);
    die(json_encode(['erro' => 'Erro ao conectar ao banco de dados']));
}

// ===== Validação de entrada =====
$acao = $_GET['a'] ?? null;
if (!$acao) {
    http_response_code(400);
    die(json_encode(['erro' => 'Ação não especificada']));
}

// ===== Processamento de ações =====
try {
    switch ($acao) {
        // ===== Dashboard: estatísticas gerais =====
        case 'dashboard':
            executarDashboard($conexao);
            break;

        // ===== Projetos: listar todos =====
        case 'projetos':
            executarProjetos($conexao);
            break;

        // ===== Sprints: listar todas =====
        case 'sprints':
            executarSprints($conexao);
            break;

        // ===== Tarefas: listar todas =====
        case 'tarefas':
            executarTarefas($conexao);
            break;

        // ===== Inserir: adicionar dados =====
        case 'inserir':
            executarInsercao($conexao);
            break;

        // ===== Atualizar: editar dados existentes =====
        case 'atualizar':
            executarAtualizacao($conexao);
            break;

        // ===== Excluir: remover registro =====
        case 'excluir':
            executarExclusao($conexao);
            break;

        default:
            http_response_code(404);
            echo json_encode(['erro' => 'Ação não encontrada']);
    }
} catch (Exception $erro) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao processar requisição: ' . $erro->getMessage()]);
}

/**
 * Busca estatísticas do dashboard
 */
function executarDashboard($conexao) {
    $totalProjetos = $conexao->query('SELECT COUNT(*) as c FROM Projeto')->fetch()['c'];
    $totalTarefas = $conexao->query('SELECT COUNT(*) as c FROM Tarefa')->fetch()['c'];
    $totalSprints = $conexao->query('SELECT COUNT(*) as c FROM Sprint')->fetch()['c'];

    echo json_encode([
        'totalProjetos' => (int) $totalProjetos,
        'totalTarefas' => (int) $totalTarefas,
        'totalSprints' => (int) $totalSprints,
    ]);
}

/**
 * Lista todos os projetos
 */
function executarProjetos($conexao) {
    $projetos = $conexao->query('SELECT *, ProjectID AS ID FROM Projeto ORDER BY ProjectID DESC')->fetchAll();
    echo json_encode(['projetos' => $projetos]);
}

/**
 * Lista todas as sprints
 */
function executarSprints($conexao) {
    $sprints = $conexao->query('SELECT *, SprintID AS ID FROM Sprint ORDER BY SprintID DESC')->fetchAll();
    echo json_encode(['sprints' => $sprints]);
}

/**
 * Lista todas as tarefas (limite 100)
 */
function executarTarefas($conexao) {
    $tarefas = $conexao->query('SELECT *, TaskID AS ID FROM Tarefa ORDER BY TaskID DESC LIMIT 100')->fetchAll();
    echo json_encode(['tarefas' => $tarefas]);
}

/**
 * Lê o corpo JSON da requisição
 */
function lerCorpoJson() {
    $dados = json_decode(file_get_contents('php://input'), true);
    if (!$dados) {
        http_response_code(400);
        die(json_encode(['sucesso' => false, 'erro' => 'JSON inválido']));
    }
    return $dados;
}

/**
 * Insere novo registro conforme tipo
 */
function executarInsercao($conexao) {
    $dados = lerCorpoJson();
    switch ($dados['tipo'] ?? null) {
        case 'projeto':
            inserirProjeto($conexao, $dados);
            break;
        case 'sprint':
            inserirSprint($conexao, $dados);
            break;
        case 'tarefa':
            inserirTarefa($conexao, $dados);
            break;
        default:
            http_response_code(400);
            echo json_encode(['sucesso' => false, 'erro' => 'Tipo de inserção inválido']);
    }
}

/**
 * Atualiza registro existente conforme tipo
 */
function executarAtualizacao($conexao) {
    $dados = lerCorpoJson();
    if (empty($dados['id'])) {
        http_response_code(400);
        die(json_encode(['sucesso' => false, 'erro' => 'ID é obrigatório']));
    }

    switch ($dados['tipo'] ?? null) {
        case 'projeto':
            atualizarProjeto($conexao, $dados);
            break;
        case 'sprint':
            atualizarSprint($conexao, $dados);
            break;
        case 'tarefa':
            atualizarTarefa($conexao, $dados);
            break;
        default:
            http_response_code(400);
            echo json_encode(['sucesso' => false, 'erro' => 'Tipo de atualização inválido']);
    }
}

/**
 * Exclui registro conforme tipo
 */
function executarExclusao($conexao) {
    $dados = lerCorpoJson();
    if (empty($dados['id'])) {
        http_response_code(400);
        die(json_encode(['sucesso' => false, 'erro' => 'ID é obrigatório']));
    }

    $tabelas = ['projeto' => 'Projeto', 'sprint' => 'Sprint', 'tarefa' => 'Tarefa'];
    $colunas = ['projeto' => 'ProjectID', 'sprint' => 'SprintID', 'tarefa' => 'TaskID'];
    $tipo = $dados['tipo'] ?? null;

    if (!isset($tabelas[$tipo])) {
        http_response_code(400);
        die(json_encode(['sucesso' => false, 'erro' => 'Tipo de exclusão inválido']));
    }

    $stmt = $conexao->prepare("DELETE FROM {$tabelas[$tipo]} WHERE {$colunas[$tipo]} = ?");
    $stmt->execute([$dados['id']]);

    echo json_encode(['sucesso' => true]);
}

/**
 * Insere novo projeto
 */
function inserirProjeto($conexao, $dados) {
    if (empty($dados['nome']) || empty($dados['cliente'])) {
        http_response_code(400);
        die(json_encode(['sucesso' => false, 'erro' => 'Nome e cliente são obrigatórios']));
    }

    $stmt = $conexao->prepare('INSERT INTO Projeto (Nome, Cliente, Status, Inicio) VALUES (?, ?, ?, NOW())');
    $stmt->execute([
        trim($dados['nome']),
        trim($dados['cliente']),
        trim($dados['status'] ?? '') ?: 'Ativo'
    ]);

    echo json_encode(['sucesso' => true]);
}

/**
 * Atualiza projeto existente
 */
function atualizarProjeto($conexao, $dados) {
    if (empty($dados['nome']) || empty($dados['cliente'])) {
        http_response_code(400);
        die(json_encode(['sucesso' => false, 'erro' => 'Nome e cliente são obrigatórios']));
    }

    $stmt = $conexao->prepare('UPDATE Projeto SET Nome = ?, Cliente = ?, Status = ? WHERE ProjectID = ?');
    $stmt->execute([
        trim($dados['nome']),
        trim($dados['cliente']),
        trim($dados['status'] ?? '') ?: 'Ativo',
        $dados['id']
    ]);

    echo json_encode(['sucesso' => true]);
}

/**
 * Insere nova sprint
 */
function inserirSprint($conexao, $dados) {
    if (empty($dados['nome']) || empty($dados['inicio']) || empty($dados['fim'])) {
        http_response_code(400);
        die(json_encode(['sucesso' => false, 'erro' => 'Nome, início e fim são obrigatórios']));
    }

    $stmt = $conexao->prepare('INSERT INTO Sprint (Nome, Objetivo, DataInicio, DataFim, Status) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([
        trim($dados['nome']),
        trim($dados['objetivo'] ?? ''),
        $dados['inicio'],
        $dados['fim'],
        trim($dados['status'] ?? '') ?: 'Ativa'
    ]);

    echo json_encode(['sucesso' => true]);
}

/**
 * Atualiza sprint existente
 */
function atualizarSprint($conexao, $dados) {
    if (empty($dados['nome']) || empty($dados['inicio']) || empty($dados['fim'])) {
        http_response_code(400);
        die(json_encode(['sucesso' => false, 'erro' => 'Nome, início e fim são obrigatórios']));
    }

    $stmt = $conexao->prepare('UPDATE Sprint SET Nome = ?, Objetivo = ?, DataInicio = ?, DataFim = ?, Status = ? WHERE SprintID = ?');
    $stmt->execute([
        trim($dados['nome']),
        trim($dados['objetivo'] ?? ''),
        $dados['inicio'],
        $dados['fim'],
        trim($dados['status'] ?? '') ?: 'Ativa',
        $dados['id']
    ]);

    echo json_encode(['sucesso' => true]);
}

/**
 * Insere nova tarefa
 */
function inserirTarefa($conexao, $dados) {
    if (empty($dados['titulo'])) {
        http_response_code(400);
        die(json_encode(['sucesso' => false, 'erro' => 'Título é obrigatório']));
    }

    $stmt = $conexao->prepare(
        'INSERT INTO Tarefa (Titulo, Descricao, Tipo, Prioridade, Responsavel, Status, DataInicio, DataFim, StoryPoints, Horas)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        trim($dados['titulo']),
        trim($dados['descricao'] ?? ''),
        trim($dados['tipoItem'] ?? '') ?: 'Tarefa',
        $dados['prioridade'] ?? null,
        trim($dados['responsavel'] ?? ''),
        trim($dados['status'] ?? '') ?: 'Novo',
        $dados['dataInicio'] ?: null,
        $dados['dataFim'] ?: null,
        $dados['storyPoints'] ?: null,
        $dados['horas'] ?: null
    ]);

    echo json_encode(['sucesso' => true]);
}

/**
 * Atualiza tarefa existente
 */
function atualizarTarefa($conexao, $dados) {
    if (empty($dados['titulo'])) {
        http_response_code(400);
        die(json_encode(['sucesso' => false, 'erro' => 'Título é obrigatório']));
    }

    $stmt = $conexao->prepare(
        'UPDATE Tarefa SET Titulo = ?, Descricao = ?, Tipo = ?, Prioridade = ?, Responsavel = ?, Status = ?, DataInicio = ?, DataFim = ?, StoryPoints = ?, Horas = ?
         WHERE TaskID = ?'
    );
    $stmt->execute([
        trim($dados['titulo']),
        trim($dados['descricao'] ?? ''),
        trim($dados['tipoItem'] ?? '') ?: 'Tarefa',
        $dados['prioridade'] ?? null,
        trim($dados['responsavel'] ?? ''),
        trim($dados['status'] ?? '') ?: 'Novo',
        $dados['dataInicio'] ?: null,
        $dados['dataFim'] ?: null,
        $dados['storyPoints'] ?: null,
        $dados['horas'] ?: null,
        $dados['id']
    ]);

    echo json_encode(['sucesso' => true]);
}
?>

# Guia de Padrões - Digital PMO

## 📋 Visão Geral

Este documento define os padrões de código para manutenção e adição de funcionalidades.

## 🔤 Nomenclatura

### JavaScript
```javascript
// ✅ Bom - camelCase em português
const meuDado = 'valor';
function buscarProjetos() { }
async function renderDashboard() { }

// ❌ Ruim
const MeuDado = 'valor';
const my_data = 'valor';
```

### PHP
```php
// ✅ Bom - camelCase ou snake_case, português
function inserirProjeto($conexao, $dados) { }
function buscar_dados($conexao) { }

// ❌ Ruim
function insertProject($connection, $data) { }
```

### CSS
```css
/* ✅ Bom - kebab-case */
.kanban-coluna { }
.card-valor { }
.form-cadastro { }

/* ❌ Ruim */
.kanbanColuna { }
.card_valor { }
```

## 💬 Comentários

### JavaScript

```javascript
/**
 * Descrição breve da função
 *
 * @param {tipo} nomParam - descrição do parâmetro
 * @returns {tipo} descrição do retorno
 */
async function renderDashboard() {
    // Comentário de linha para explicar o "por quê"
    const dados = await api('dashboard');
}
```

### PHP

```php
/**
 * Descrição breve da função
 *
 * @param PDO $conexao - conexão com banco
 * @param array $dados - dados a inserir
 */
function inserirProjeto($conexao, $dados) {
    // Validação de entrada
    if (empty($dados['nome'])) {
        // Retorna erro
    }
}
```

### CSS

```css
/* ===== SECAO PRINCIPAL ===== */

/* Componente específico */
.card {
    /* Propriedades agrupadas: layout, tipografia, cores */
}
```

## 🎨 Estilos CSS

### Ordem de propriedades
1. **Layout**: display, flex, grid, position
2. **Dimensões**: width, height, padding, margin
3. **Borders e bordas**: border, border-radius
4. **Tipografia**: font-family, font-size, font-weight
5. **Cores**: color, background
6. **Efeitos**: shadow, opacity, transform
7. **Transições**: transition

```css
.card {
    /* Layout */
    display: flex;
    flex-direction: column;

    /* Dimensões */
    width: 100%;
    padding: var(--space-3);
    margin-bottom: var(--space-4);

    /* Bordas */
    border: 1px solid var(--color-border);
    border-radius: var(--radius);

    /* Tipografia */
    font-size: var(--text-sm);
    font-weight: 600;

    /* Cores */
    background: var(--color-surface);
    color: var(--color-text);

    /* Efeitos */
    box-shadow: var(--shadow);
    transition: all 0.2s ease;
}
```

### Usar tokens CSS
```css
/* ✅ Bom */
padding: var(--space-3);
color: var(--color-primary);
font-size: var(--text-sm);

/* ❌ Ruim - valores hardcoded */
padding: 16px;
color: #3b82f6;
font-size: 14px;
```

## 🔐 Segurança

### SQL Injection - PHP

```php
// ✅ Bom - prepared statement
$stmt = $conexao->prepare('SELECT * FROM Projeto WHERE ID = ?');
$stmt->execute([$id]);

// ❌ Ruim - concatenação
$query = "SELECT * FROM Projeto WHERE ID = $id";
```

### XSS - JavaScript

```javascript
// ✅ Bom - escaping
function escaparHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

const html = `<td>${escaparHtml(projeto.nome)}</td>`;

// ❌ Ruim - sem escape
const html = `<td>${projeto.nome}</td>`; // Perigoso!
```

## 🧪 Validação

### JavaScript

```javascript
// ✅ Bom - valida antes de enviar
async function executarAcao() {
    const nome = form.get('nome');
    
    if (!nome || nome.trim() === '') {
        mostrarErro('Campo obrigatório');
        return;
    }
    
    const res = await api('inserir', 'POST', { nome });
}
```

### PHP

```php
// ✅ Bom - valida entrada
function inserirProjeto($conexao, $dados) {
    // Validação
    if (empty($dados['nome']) || empty($dados['cliente'])) {
        http_response_code(400);
        die(json_encode(['erro' => 'Campos obrigatórios']));
    }
    
    // Limpeza
    $nome = trim($dados['nome']);
    
    // Execução
    $stmt = $conexao->prepare('INSERT INTO Projeto ...');
    $stmt->execute([$nome, ...]);
}
```

## 🔄 Tratamento de Erros

### JavaScript

```javascript
try {
    const resposta = await fetch(url);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    return resposta.json();
} catch (erro) {
    mostrarErro('Erro ao conectar: ' + erro.message);
    return { erro: erro.message };
}
```

### PHP

```php
try {
    $stmt = $conexao->prepare('...');
    $stmt->execute($parametros);
} catch (PDOException $erro) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao processar']);
    // Log do erro em produção
    error_log($erro->getMessage());
}
```

## 📦 Estrutura de Funções

### Backend - organização padrão

```php
<?php
/**
 * [Descrição do arquivo]
 */

// ===== Headers e configuração =====

// ===== Validação de entrada =====

// ===== Processamento de ações =====

// ===== Funções específicas =====

/**
 * Nome da função
 */
function nome($parametro) {
    // Validação
    // Execução
    // Retorno
}
?>
```

### Frontend - organização padrão

```javascript
/**
 * [Descrição da aplicação]
 */

/* ===== CONFIGURACAO ===== */
const config = { };

/* ===== INICIALIZACAO ===== */
function init() { }

/* ===== FUNCOES PUBLICAS ===== */
async function acao() { }

/* ===== FUNCOES PRIVADAS ===== */
function _auxiliar() { }

/* ===== UTILITARIOS ===== */
function escaparHtml() { }
```

## 🎯 Adição de Novo Módulo

### Checklist

- [ ] Adicionar rota no `api.php`
- [ ] Implementar função de busca de dados
- [ ] Implementar função de inserção (se aplicável)
- [ ] Adicionar entrada em `modulos` no `index.html`
- [ ] Implementar `render[NomeModulo]()`
- [ ] Adicionar estilos em `style.css`
- [ ] Testar no navegador
- [ ] Documentar no `ESTRUTURA.md`

### Exemplo Completo

**1. api.php**
```php
case 'meumodulo':
    executarMeuModulo($conexao);
    break;

function executarMeuModulo($conexao) {
    $dados = $conexao->query('SELECT * FROM MinhaTabela')->fetchAll();
    echo json_encode(['dados' => $dados]);
}
```

**2. index.html**
```javascript
const modulos = {
    // ... existentes
    meumodulo: { nome: 'Meu Módulo', render: renderMeuModulo },
};

async function renderMeuModulo() {
    const dados = await api('meumodulo');
    if (dados.erro) return;

    let html = '<table>...';
    dados.dados.forEach(item => {
        html += `<tr><td>${escaparHtml(item.nome)}</td></tr>`;
    });
    html += '</table>';

    document.getElementById('conteudo').innerHTML = html;
}
```

**3. style.css**
```css
/* ===== MEU MODULO ===== */

.meumodulo-item {
    /* estilos */
}
```

## 🔍 Checklist de Código

Antes de fazer commit:

- [ ] Código compilado sem erros
- [ ] Sem avisos no console (F12)
- [ ] Nomes em português consistentes
- [ ] Comentários nas funções principais
- [ ] Validação de entrada
- [ ] Tratamento de erros
- [ ] Responsividade testada (mobile/desktop)
- [ ] Nenhum hardcode de valores
- [ ] Usa tokens CSS quando aplicável

## 📚 Recursos

- [MDN - JavaScript](https://developer.mozilla.org/pt-BR/)
- [PHP Manual](https://www.php.net/manual/pt_BR/)
- [CSS Tricks](https://css-tricks.com/)
- [OWASP - Segurança Web](https://owasp.org/www-project-top-ten/)

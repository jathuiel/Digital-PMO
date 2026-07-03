# Referência Rápida - Digital PMO

Guia de bolso para desenvolvedores. Para detalhes completos, veja os documentos específicos.

## 🚀 Iniciar Dev

```bash
# Configure as credenciais
export DB_HOST=localhost
export DB_NAME=digital_pmo
export DB_USER=root
export DB_PASS=sua_senha

# Inicie o servidor
php -S localhost:8000

# Acesse
http://localhost:8000
```

## 📁 Arquivos Principais

| Arquivo | Para quê |
|---------|----------|
| `index.html` | Interface (HTML + JavaScript) |
| `api.php` | Backend/Banco de dados |
| `public/assets/css/style.css` | Estilos |
| `config/database.php` | Conexão MySQL |

## 🔗 Adicionar Novo Módulo (5 min)

### 1. Backend - api.php
```php
case 'meumodulo':
    $dados = $conexao->query('SELECT * FROM MinhaTabela')->fetchAll();
    echo json_encode(['dados' => $dados]);
    break;
```

### 2. Frontend - index.html
```javascript
modulos.meumodulo = { nome: 'Meu Módulo', render: renderMeuModulo };

async function renderMeuModulo() {
    const dados = await api('meumodulo');
    const html = '<table>...</table>';
    document.getElementById('conteudo').innerHTML = html;
}
```

### 3. Estilos - style.css
```css
/* ===== MEU MODULO ===== */
.meumodulo-classe { }
```

## 🎨 Usar Tokens CSS

```css
/* ✅ Bom */
color: var(--color-primary);
padding: var(--space-3);
font-size: var(--text-lg);

/* ❌ Ruim */
color: #3b82f6;
padding: 16px;
```

## 🔒 Segurança

### PHP - SQL Injection
```php
// ✅ Bom
$stmt = $conexao->prepare('INSERT INTO Projeto (Nome) VALUES (?)');
$stmt->execute([$nome]);

// ❌ Ruim
$query = "INSERT INTO Projeto (Nome) VALUES ('$nome')";
```

### JavaScript - XSS
```javascript
// ✅ Bom
function escaparHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}
const html = `<td>${escaparHtml(nome)}</td>`;

// ❌ Ruim
const html = `<td>${nome}</td>`;
```

## 📝 Comentários

### JavaScript
```javascript
/**
 * Descrição breve
 * @param {tipo} param - descrição
 * @returns {tipo} descrição
 */
async function meuModulo() {
    // Comentário de linha
}
```

### PHP
```php
/**
 * Descrição breve
 * @param tipo $param descrição
 */
function meuModulo($param) {
    // Comentário de linha
}
```

## 🐛 Debug

### Console JavaScript (F12)
```javascript
console.log('valor:', objeto);
console.error('Erro:', erro);
```

### Ver requisições (F12 → Network)
- Clique na requisição
- Veja Response, Headers, etc.

### Log PHP
```php
error_log('Debug: ' . var_export($dados, true));
```

## 📱 Breakpoints (style.css)

```css
/* Mobile (padrão, até 640px) */

/* Tablet */
@media (max-width: 768px) { }

/* Celular */
@media (max-width: 480px) { }
```

## 🎯 Cores Quick Reference

```css
--color-primary: #3b82f6         /* Azul */
--color-green: #16a34a           /* Verde (sucesso) */
--color-red: #dc2626             /* Vermelho (erro) */
--color-text: #0f172a            /* Preto (texto) */
--color-text-muted: #64748b      /* Cinza (labels) */
```

## 💾 Espaçamento Quick Reference

```css
--space-2: 8px     /* Pequeno gap/padding */
--space-3: 16px    /* Padrão (mais usado) */
--space-4: 24px    /* Grande separação */
--space-5: 32px    /* Extra grande */
```

## 📊 Banco de Dados

### Tabelas principais
- `Projeto` (ID, Nome, Cliente, Status, Inicio, Fim)
- `Sprint` (ID, Nome, Objetivo, DataInicio, DataFim, Status)
- `Tarefa` (ID, DeliverableID, SprintID, Titulo, Status, Prioridade, ...)

### Query rápida
```php
$resultado = $conexao->query('SELECT * FROM Projeto')->fetchAll();
```

## 🔌 API Endpoints

```
GET  api.php?a=dashboard    → totais
GET  api.php?a=projetos     → lista de projetos
GET  api.php?a=sprints      → lista de sprints
GET  api.php?a=tarefas      → lista de tarefas
POST api.php?a=inserir      → inserir (type no body)
```

## 📦 Fetch API

```javascript
// GET
const dados = await fetch('api.php?a=projetos').then(r => r.json());

// POST
const res = await fetch('api.php?a=inserir', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tipo: 'projeto', nome: 'X', cliente: 'Y' })
}).then(r => r.json());
```

## ✨ Componentes Prontos

### Alert
```html
<div class="erro">Mensagem de erro</div>
<div class="sucesso">Sucesso!</div>
```

### Badge
```html
<span class="badge badge-green">Ativo</span>
<span class="badge badge-blue">Info</span>
<span class="badge badge-red">Crítico</span>
```

### Form
```html
<form class="form-cadastro">
    <label>Nome <input type="text" name="nome" required></label>
    <button type="submit">Enviar</button>
</form>
```

### Table
```html
<table>
    <tr><th>Coluna 1</th><th>Coluna 2</th></tr>
    <tr><td>Valor 1</td><td>Valor 2</td></tr>
</table>
```

### Cards
```html
<ul class="cards">
    <li class="card">
        <div class="card-valor">123</div>
        <div class="card-label">Projetos</div>
    </li>
</ul>
```

### Kanban
```html
<div class="kanban">
    <div class="kanban-coluna">
        <h3>Status</h3>
        <div class="kanban-item">Tarefa 1</div>
    </div>
</div>
```

## 🆘 Troubleshooting

| Problema | Solução |
|----------|---------|
| Estilos não carregam | Ctrl+Shift+R (limpar cache) |
| API retorna erro 500 | Verifique console.log em api.php |
| Módulo não aparece | Adicione em `modulos` e implemente `render*()` |
| XSS warning | Use `escaparHtml()` |
| SQL error | Verifique prepared statement com `?` |

## 📚 Documentação Completa

- `README.md` - Como usar
- `ESTRUTURA.md` - Arquitetura
- `PADRONIZACAO.md` - Padrões de código
- `TOKENS.md` - Design tokens
- `MELHORIAS.md` - O que foi feito

## ⌨️ Atalhos Úteis

| Ação | Atalho |
|------|--------|
| Developer Tools | F12 |
| Console JS | F12 → Console |
| Network | F12 → Network |
| Limpar cache | Ctrl+Shift+R |
| Format code | Ctrl+Shift+I (IDE) |

---

**Última atualização:** 03/07/2026  
**Versão:** 1.0

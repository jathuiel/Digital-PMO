# Digital PMO - Sistema de Gestão de Portfólio

Aplicação web para gerenciamento de portfólio de projetos em **HTML5** + **PHP** + **MySQL**.

**Características principais:**
- ✅ Interface moderna e responsiva
- ✅ Zero dependências externas (frameworks)
- ✅ Código simples e fácil de manter
- ✅ API REST mínima em JSON
- ✅ Design System com tokens CSS

## 🚀 Início Rápido

### 1. Pré-requisitos
- PHP 7.4+
- MySQL 5.7+ ou MariaDB
- Navegador moderno

### 2. Configure o Banco de Dados

Edite `config/database.php`:
```php
return [
    'host' => getenv('DB_HOST') ?: '127.0.0.1',
    'name' => getenv('DB_NAME') ?: 'digital_pmo',
    'user' => getenv('DB_USER') ?: 'root',
    'pass' => getenv('DB_PASS') ?: '',
];
```

Ou configure variáveis de ambiente:
```bash
export DB_HOST=localhost
export DB_NAME=digital_pmo
export DB_USER=seu_usuario
export DB_PASS=sua_senha
```

### 3. Inicie o Servidor PHP

**Windows:** dê duplo clique em `iniciar-servidor.bat` (ou rode `.\iniciar-servidor.bat` no terminal). Ele já sobe o servidor em `http://127.0.0.1:8000` a partir da pasta do projeto.

**Manual (qualquer SO):**
```bash
php -S localhost:8000
```

### 4. Acesse no Navegador
```
http://localhost:8000
```

## 📁 Estrutura do Projeto

```
PMO 2/
├── index.html                 # Interface frontend
├── api.php                    # Backend API
├── iniciar-servidor.bat       # Sobe o servidor PHP (Windows)
├── config/
│   └── database.php          # Configuração de banco
├── database/
│   ├── schema.sql            # Estrutura das tabelas
│   └── seed.sql              # Dados de exemplo
├── public/
│   └── assets/
│       ├── css/style.css     # Estilos unificados
│       └── js/app.js         # Lógica de frontend
├── docs/                      # Documentação complementar
│   ├── ESTRUTURA.md
│   ├── PADRONIZACAO.md
│   ├── MELHORIAS.md
│   ├── REFERENCIA-RAPIDA.md
│   └── arquitetura-do-projeto.md
└── README.md                 # Este arquivo
```

## 📚 Documentação

- **[docs/ESTRUTURA.md](./docs/ESTRUTURA.md)** - Estrutura técnica do projeto
- **[docs/PADRONIZACAO.md](./docs/PADRONIZACAO.md)** - Padrões de código e convenções
- **[docs/MELHORIAS.md](./docs/MELHORIAS.md)** - Melhorias propostas
- **[docs/REFERENCIA-RAPIDA.md](./docs/REFERENCIA-RAPIDA.md)** - Referência rápida
- **[docs/arquitetura-do-projeto.md](./docs/arquitetura-do-projeto.md)** - Arquitetura do projeto
- **[style.css](./public/assets/css/style.css)** - Tokens de design e componentes

## 🎯 Funcionalidades

### Dashboard
- Estatísticas gerais (projetos, tarefas, sprints)
- Visão consolidada do portfólio

### Projetos
- Listar todos os projetos
- Adicionar novo projeto
- Status e informações de cliente

### Sprints
- Gerenciar iterações de desenvolvimento
- Datas de início e fim
- Objetivos de sprint

### Tarefas
- Lista completa de tarefas
- Visualização kanban (status visual)
- Filtro por responsável e prioridade

## 🔧 Adicionar Novo Módulo

### 1. Backend (api.php)
```php
case 'seumodulo':
    executarSeuModulo($conexao);
    break;

/**
 * Busca dados de seu módulo
 */
function executarSeuModulo($conexao) {
    $dados = $conexao->query('SELECT * FROM SuaTabela')->fetchAll();
    echo json_encode(['dados' => $dados]);
}
```

### 2. Frontend (index.html)
```javascript
const modulos = {
    // ... existentes
    seumodulo: { nome: 'Seu Módulo', render: renderSeuModulo },
};

/**
 * Renderiza seu módulo
 */
async function renderSeuModulo() {
    const dados = await api('seumodulo');
    if (dados.erro) return;

    let html = '<table><tr><th>Coluna</th></tr>';
    dados.dados.forEach(item => {
        html += `<tr><td>${escaparHtml(item.coluna)}</td></tr>`;
    });
    html += '</table>';

    document.getElementById('conteudo').innerHTML = html;
}
```

### 3. Estilos (style.css)
```css
/* ===== SEU MODULO ===== */

.seumodulo-classe {
    /* seus estilos */
}
```

## 🎨 Design System

### Tokens CSS
Variáveis CSS definidas em `style.css` para manter consistência:

```css
/* Cores */
--color-primary: #3b82f6
--color-green: #16a34a
--color-red: #dc2626

/* Tipografia */
--text-sm: 0.875rem
--text-lg: 1.25rem

/* Espaçamento (8pt grid) */
--space-3: 16px
--space-4: 24px
```

### Breakpoints Responsivos
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 📊 Banco de Dados

### Tabelas Principais
- `Projeto` - Portfólio de projetos
- `Sprint` - Iterações de desenvolvimento
- `Tarefa` - Unidades de trabalho
- `Legado` - Sistemas legados
- `EntregaValor` - Entregas estratégicas
- `Entregavel` - Artefatos entregáveis
- `Backlog` - Ordenação de prioridades

## 🔐 Segurança

- ✅ **SQL Injection**: Prepared statements com placeholders
- ✅ **XSS**: Escape de HTML no JavaScript
- ✅ **Variáveis de Ambiente**: Credenciais seguras
- ✅ **CORS**: Controlado no backend

## 💻 Desenvolvimento

### Convenções de Código
- JavaScript: `camelCase` em português
- PHP: `camelCase` e `snake_case`
- CSS: `kebab-case`
- Comentários: Blocos `/** */` para funções

### Checklist de Qualidade
- [ ] Sem erros no console (F12)
- [ ] Validação de entrada
- [ ] Tratamento de erros
- [ ] Responsividade testada
- [ ] Usa tokens CSS
- [ ] Documentação atualizada

## 📱 Compatibilidade

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Tablets e mobile

## 🆘 Troubleshooting

### "Erro ao conectar ao banco de dados"
1. Verifique credenciais em `config/database.php`
2. Certifique-se que MySQL está rodando
3. Confirme que o banco existe

### "Página em branco"
1. Abra Developer Tools (F12)
2. Verifique console e aba Network
3. Veja se há erros PHP

### "Estilos não carregam"
1. Verifique caminho `public/assets/css/style.css`
2. Limpe cache do navegador (Ctrl+Shift+R)

## 📞 Suporte

Para problemas ou dúvidas:
1. Consulte [docs/ESTRUTURA.md](./docs/ESTRUTURA.md)
2. Verifique [docs/PADRONIZACAO.md](./docs/PADRONIZACAO.md)
3. Revise os comentários no código

## 📄 Licença

Projeto interno para uso do time PMO.

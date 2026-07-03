# Estrutura do Projeto Digital PMO

## 📁 Organização de Arquivos

```
PMO 2/
├── index.html                     # Interface frontend (HTML + JS)
├── api.php                        # Backend API (retorna JSON)
├── config/
│   └── database.php              # Configuração de banco de dados
├── public/
│   └── assets/
│       └── css/
│           └── style.css         # Estilos unificados (CSS + tokens de design)
├── database/                      # Backups/esquema do banco
├── README.md                      # Documentação geral
├── ESTRUTURA.md                   # Este arquivo
├── PADRONIZACAO.md               # Guia de padrões de código
├── composer.json                  # Dependências PHP (vendor)
└── .gitignore                     # Arquivos ignorados pelo Git
```

## 🎯 Camadas do Projeto

### Frontend (index.html)
- **HTML**: Estrutura semântica da página
- **CSS**: Carregado do `public/assets/css/style.css`
- **JavaScript**: Lógica de navegação e renderização de módulos

### Backend (api.php)
- Única porta de entrada para dados
- Retorna JSON para todas as requisições
- Validação e tratamento de erros centralizados

### Banco de Dados
- Conexão via `config/database.php`
- Suporta variáveis de ambiente para credenciais
- Compatível com MySQL/MariaDB

## 🔌 Fluxo de Dados

```
[index.html] 
    ↓ (fetch)
[api.php] 
    ↓ (query)
[MySQL Database]
    ↓ (resultado)
[api.php] 
    ↓ (JSON)
[index.html] 
    ↓ (renderiza)
[Navegador do usuário]
```

## 📝 Padrões de Código

### JavaScript
- **Comentários**: Blocos `/** */` para funções
- **Nomes**: camelCase em português
- **Segurança**: Escaping de HTML via `escaparHtml()`

### PHP
- **Comentários**: Blocos `/** */` e `//` para linhas
- **Estrutura**: Funções organizadas por responsabilidade
- **Banco**: Prepared statements (protege contra SQL injection)

### CSS
- **Organização**: Seções demarcadas com `/* ===== SECAO ===== */`
- **Tokens**: CSS custom properties (variáveis)
- **Responsividade**: Media queries organizadas por breakpoint

## 🎨 Tokens de Design

### Cores
- `--color-primary`: Azul principal (#3b82f6)
- `--color-primary-dark`: Azul escuro (#1d4ed8)
- `--color-bg`: Fundo cinza (#f8fafc)
- `--color-surface`: Branco (#ffffff)
- Status: green, blue, red (com backgrounds)

### Tipografia
- `--font-sans`: System fonts
- `--text-sm`: 0.875rem (14px)
- `--text-base`: 1rem (16px)
- `--text-lg`: 1.25rem (20px)
- `--text-xl`: 1.75rem (28px)

### Espaçamento (Grid 8pt)
- `--space-1`: 4px
- `--space-2`: 8px
- `--space-3`: 16px
- `--space-4`: 24px
- `--space-5`: 32px

### Componentes
- `--radius`: 8px (border-radius)
- `--shadow`: Sombra leve (0 1px 3px)

## 🚀 Adicionar Novos Módulos

### 1. Backend (api.php)

```php
case 'meumodulo':
    executarMeuModulo($conexao);
    break;

function executarMeuModulo($conexao) {
    // Sua lógica aqui
    echo json_encode(['dados' => ...]);
}
```

### 2. Frontend (index.html)

```javascript
const modulos = {
    // ... existentes
    meumodulo: { nome: 'Meu Módulo', render: renderMeuModulo },
};

async function renderMeuModulo() {
    const dados = await api('meumodulo');
    // Renderiza HTML
    document.getElementById('conteudo').innerHTML = html;
}
```

## 📊 Estrutura de Dados

### Tabelas principais
- `Projeto`: projetos do portfólio
- `Sprint`: iterações de desenvolvimento
- `Tarefa`: unidades de trabalho
- `Legado`: sistemas legados
- `EntregaValor`: entregas de negócio

## 🔐 Segurança

- **SQL Injection**: Prepared statements com placeholders `?`
- **XSS**: Escaping de HTML no JavaScript
- **CSRF**: Validação em desenvolvimento (pode ser adicionada)
- **Variáveis de Ambiente**: Credenciais via `.env`

## 📱 Responsividade

Breakpoints definidos em `style.css`:
- `--breakpoint-sm`: 640px (tablets)
- `--breakpoint-md`: 768px (tablets e mais)
- `--breakpoint-lg`: 1024px (desktops)

Layout adapta-se automaticamente para:
- Desktop (1024px+): layout com sidebar fixa
- Tablet (640-1024px): sidebar reduzida
- Mobile (até 640px): sidebar como abas horizontais

## 🎯 Prioridades de Manutenção

1. **Backend primeiro**: Mudanças no banco/regras de negócio
2. **Frontend depois**: Renderização reflete o backend
3. **Estilos por último**: CSS é independente da lógica

## 📚 Referências

- [PADRONIZACAO.md](./PADRONIZACAO.md) - Guia de padrões de código
- [README.md](../README.md) - Documentação de uso
- [style.css](../public/assets/css/style.css) - Documentação de tokens

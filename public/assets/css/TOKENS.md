# Design Tokens - Digital PMO

Referência completa dos tokens CSS utilizados no projeto.

## 🎨 Cores

### Paleta Primária
```css
--color-primary: #3b82f6         /* Azul principal */
--color-primary-dark: #1d4ed8    /* Azul escuro (hover/active) */
--color-primary-bg: #eff6ff      /* Azul bem claro (backgrounds) */
```

### Backgrounds & Surfaces
```css
--color-bg: #f8fafc              /* Fundo geral da página */
--color-surface: #ffffff          /* Superfícies principais (cards, modais) */
--color-border: #e2e8f0          /* Bordas padrão */
```

### Tipografia
```css
--color-text: #0f172a            /* Texto principal (alto contraste) */
--color-text-muted: #64748b      /* Texto secundário (labels, helpers) */
```

### Status - Verde
```css
--color-green: #16a34a           /* Texto verde */
--color-green-bg: #dcfce7        /* Fundo verde (sucesso, ativo) */
```

### Status - Azul
```css
--color-blue: #2563eb            /* Texto azul (info) */
--color-blue-bg: #dbeafe         /* Fundo azul claro */
```

### Status - Vermelho
```css
--color-red: #dc2626             /* Texto vermelho */
--color-red-bg: #fee2e2          /* Fundo vermelho (erro, alerta) */
```

### Status - Cinza
```css
--color-gray: #64748b            /* Texto cinza (desabilitado) */
--color-gray-bg: #f1f5f9         /* Fundo cinza (alternado) */
```

## 🔤 Tipografia

### Família de Fontes
```css
--font-sans: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif
```

**Fallback order:**
1. System fonts (-apple-system para macOS)
2. Segoe UI (Windows)
3. Roboto (Android)
4. Helvetica, Arial (fallback)
5. sans-serif (generic)

### Escala Tipográfica

| Token | Tamanho | Uso |
|-------|---------|-----|
| `--text-sm` | 0.875rem (14px) | Labels, helpers, pequenos textos |
| `--text-base` | 1rem (16px) | Corpo de texto padrão |
| `--text-lg` | 1.25rem (20px) | Títulos de seções |
| `--text-xl` | 1.75rem (28px) | Títulos principais (H1) |

### Peso das Fontes
- 400: Regular (padrão)
- 500: Medium (labels)
- 600: Semibold (títulos, buttons)
- 700: Bold (ênfase)

## 📏 Espaçamento (Grid 8pt)

Baseado em múltiplos de 8px para alinhamento vertical e horizontal.

```css
--space-1: 4px       /* Micro spacing */
--space-2: 8px       /* Pequeno padding/margin */
--space-3: 16px      /* Padrão (padding/gap) */
--space-4: 24px      /* Maior espaçamento */
--space-5: 32px      /* Extra large */
```

### Exemplos de Uso
```css
padding: var(--space-3);           /* 16px (padrão) */
margin-bottom: var(--space-4);     /* 24px (separação entre seções) */
gap: var(--space-2);               /* 8px (espaço entre itens) */
```

## 🎁 Componentes

### Border Radius
```css
--radius: 8px        /* Cantos arredondados padrão */
```

Mantém consistência visual em:
- Buttons
- Cards
- Inputs
- Modais

### Sombras
```css
--shadow: 0 1px 3px rgba(15, 23, 42, 0.08)
```

Aplicado em:
- Cards
- Buttons (hover)
- Modais
- Dropdowns

### Largura da Sidebar
```css
--sidebar-width: 220px
```

Mantém consistência do layout em desktops.

## 📱 Breakpoints Responsivos

Definidos como comentários para referência:

```css
/* Mobile first (default) */
/* --breakpoint-sm: 640px (tablets) */
/* --breakpoint-md: 768px (tablets maiores) */
/* --breakpoint-lg: 1024px (desktops) */
```

### Media Queries Padrão
```css
/* Tablets */
@media (max-width: 768px) { }

/* Celulares */
@media (max-width: 480px) { }
```

## 🎯 Padrões de Cores

### Badges de Status
```html
<span class="badge badge-green">Ativo</span>
<span class="badge badge-blue">Info</span>
<span class="badge badge-red">Crítico</span>
<span class="badge badge-gray">Inativo</span>
```

### Alertas
```html
<div class="erro">Mensagem de erro</div>
<div class="sucesso">Operação realizada com sucesso</div>
```

## 🔄 Transições

Padrão aplicado em componentes interativos:
```css
transition: all 0.2s ease;
```

Usado em:
- Hover de links
- Focus de inputs
- Mudança de estado de buttons
- Expansão de elementos

## ♿ Acessibilidade

### Contraste de Cores
Todos os tokens mantêm razão de contraste WCAG AA+:
- Texto principal vs background: 7.1:1
- Texto secundário vs background: 4.5:1

### Redução de Movimento
```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

### Respeito a Preferências
```css
@media (prefers-color-scheme: dark) {
    /* Implementar tema escuro conforme necessário */
}
```

## 📋 Checklist de Uso

Ao adicionar estilos:

- [ ] Usa tokens CSS (variáveis)
- [ ] Não hardcoda cores/tamanhos
- [ ] Mantém espaçamento em múltiplos de 8px
- [ ] Segue organização de propriedades
- [ ] Testado em mobile/tablet/desktop
- [ ] Mantém contraste de cores WCAG
- [ ] Usa classes BEM ou componentes

## 🚀 Estendendo Tokens

Para adicionar novo token:

1. **Defina em `:root`**
   ```css
   --novo-token: valor;
   ```

2. **Documente aqui** (TOKENS.md)

3. **Use em componentes**
   ```css
   .componente {
       propriedade: var(--novo-token);
   }
   ```

## 📚 Referências

- [CSS Custom Properties - MDN](https://developer.mozilla.org/pt-BR/docs/Web/CSS/--*)
- [Design System Tokens - Figma](https://www.figma.com/)
- [WCAG Contrast - WebAIM](https://webaim.org/resources/contrastchecker/)

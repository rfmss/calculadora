# Design Manual — rfmss projects

Sistema de design compartilhado por todos os projetos de Rafa Mass.
Baseado na paleta oficial da Anthropic (extraída de "The Complete Guide to Building Skills for Claude"),
adaptado para o iPad mini (iOS 9.3.5).

---

## Paleta Anthropic — cores base

Estas são as 7 cores extraídas diretamente do PDF oficial da Anthropic.
Cada app/jogo recebe uma cor como identidade visual (ícone sólido na tela inicial).

| Token        | Hex       | Referência no PDF       | App atribuído     |
|--------------|-----------|-------------------------|-------------------|
| `terra`      | `#cd7b5f` | Capa / terra cotta      | calculadora       |
| `olive`      | `#6e7a4e` | Cap 1 — Fundamentals    | (reservado)       |
| `rose`       | `#c4708a` | Cap 2 — Planning        | bijuled           |
| `lavender`   | `#9b8fc4` | Cap 3 — Testing         | caça-palavras (p) |
| `blue`       | `#6b9ab8` | Cap 4 — Distribution    | dirlizanu         |
| `sage`       | `#8fb3ae` | Cap 5 — Patterns        | bloco             |
| `sand`       | `#e0d8cc` | Cap 6 — Resources       | FernandaTowers    |

### Regra dos ícones PWA — cor sólida chapada
Cada app tem **um ícone de cor sólida, sem design** — só a cor Anthropic.
Isso cria uma identidade limpa e moderna na tela inicial, idêntica a apps nativos.

```
icon.png / icon-192.png / icon-512.png = retângulo 100% da cor do app, sem texto, sem logo
```

Geração do ícone (Python):
```python
from PIL import Image
img = Image.new('RGB', (512, 512), (205, 123, 95))  # terra #cd7b5f
img.save('icon-512.png')
```

---

## Paleta de interface

Cores usadas nos elementos de UI (não nos ícones):

| Nome        | Hex       | Uso                                         |
|-------------|-----------|---------------------------------------------|
| `bg`        | `#b2c9c3` | Background principal, theme-color, header   |
| `surface`   | `#f0ece4` | Superfícies (cards, editor, sheets)         |
| `ink`       | `#2a2a2a` | Texto principal, botões primários, FAB      |
| `ink-light` | `#4a5e58` | Textos secundários, subtítulos              |
| `border`    | `#8aada6` | Bordas sutis, separadores                   |
| `muted`     | `#ccc8c0` | Placeholders, datas, labels apagados        |
| `danger`    | `#c0392b` | Ações destrutivas (apagar, erro)            |
| `success`   | `#5a9e50` | Confirmação (salvo, ok)                     |

> **Nota:** O `bg` (#b2c9c3) é derivado do `sage` Anthropic (#8fb3ae) levemente clareado
> para maior legibilidade como fundo de tela completa.

### Variáveis CSS (copiar em todo projeto)
```css
:root {
  /* Interface */
  --bg:        #b2c9c3;
  --surface:   #f0ece4;
  --ink:       #2a2a2a;
  --ink-light: #4a5e58;
  --border:    #8aada6;
  --muted:     #ccc8c0;
  --danger:    #c0392b;
  --success:   #5a9e50;

  /* Paleta Anthropic (para ícones e acentos) */
  --terra:     #cd7b5f;
  --olive:     #6e7a4e;
  --rose:      #c4708a;
  --lavender:  #9b8fc4;
  --blue:      #6b9ab8;
  --sage:      #8fb3ae;
  --sand:      #e0d8cc;
}
```

---

## Tipografia

| Papel          | Família                          | Uso                                 |
|----------------|----------------------------------|-------------------------------------|
| Display/Título | `Georgia, 'Times New Roman', serif` | Títulos de app, títulos de nota  |
| UI/Código      | `'Courier New', Courier, monospace` | Labels, botões, datas, badges    |

### Escala tipográfica
| Token      | px  | Uso                          |
|------------|-----|------------------------------|
| `--t-app`  | 30px | Nome do app no header       |
| `--t-h1`   | 22px | Título principal da tela    |
| `--t-body` | 17px | Corpo de texto              |
| `--t-ui`   | 12px | Botões, labels de ação      |
| `--t-meta` | 10px | Badges, datas, meta-info    |
| `--t-tiny` |  9px | Datas em cards              |

---

## Espaçamento e raios

| Token         | Valor | Uso                                 |
|---------------|-------|-------------------------------------|
| `--r-card`    | 14px  | Cards bento, superfícies internas   |
| `--r-pill`    | 20px  | Botões pill (header, badges)        |
| `--r-sheet`   | 18px  | Bottom sheets                       |
| `--r-btn`     | 11px  | Botões de ação em sheets            |
| `--r-micro`   | 8px   | Botões do editor                    |
| `--gap-grid`  | 10px  | Gap entre cards bento               |
| `--pad-page`  | 14px  | Padding lateral das telas           |

---

## Componentes

### Header
```
┌─────────────────────────────────────┐
│  nome-app   n itens   [badge] [btn] │
└─────────────────────────────────────┘
```
- Fundo: sage (`#b2c9c3`)
- Título: Georgia 30px, bold, letter-spacing -0.8px
- Contador: Courier New 11px, uppercase, sage-dark
- Botões: `.hbtn` — pill, fundo rgba(0,0,0,0.12), Courier 10px uppercase
- Botão primário no header: `.hbtn.dark` — fundo chumbo, texto cream

### Bento grid
- 2 cards por linha, gaps iguais (10px)
- Todos os cards com altura fixa: **140px** (moleskine)
- Cards: fundo cream, border-radius 14px, box-shadow sutil
- Cada card é coluna flex (title → preview flex:1 → date)
- Tap feedback: `scale(0.97)` transition 0.14s

### FAB (botão de ação principal)
- 56×56px, circular, fundo chumbo
- Posição: fixed bottom:28px right:18px
- Ícone Phosphor SVG inline, 26×26px, fill currentColor
- Tap feedback: `scale(0.90)`
- Sombra: `0 4px 18px rgba(0,0,0,0.28)`

### Botões de ação

| Classe    | Aparência                            | Uso                    |
|-----------|--------------------------------------|------------------------|
| `.hbtn`   | Pill, rgba bg, Courier 10px          | Header actions         |
| `.hbtn.dark` | Pill, fundo chumbo, cream text    | Ação principal header  |
| `.ebtn`   | Borda sutil, radius 8px, Courier 10px | Editor bar buttons   |
| `.ebtn.save` | Fundo chumbo, texto cream         | Salvar no editor       |
| `.ebtn.del` | Borda vermelha, texto danger       | Apagar no editor       |
| `.sbtn`   | Radius 11px, padding 14px, flex center | Sheet buttons        |
| `.sbtn.primary` | Fundo chumbo, texto cream      | Ação principal sheet   |
| `.sbtn.danger`  | Fundo danger, texto cream      | Ação destrutiva        |
| `.sbtn.ghost`   | Sem fundo, borda sutil         | Ação secundária        |

Todos os botões têm `display: flex; align-items: center` e ícone Phosphor com `margin-right: 6px`.

### Ícones
- Biblioteca: **Phosphor Icons** (https://phosphoricons.com)
- Peso: **regular**
- Implementação: SVG inline (`xmlns`, `viewBox="0 0 256 256"`, `fill="currentColor"`)
- Tamanhos: 13px em botões pequenos, 15px em sheet buttons, 22-26px no FAB
- **Nunca usar CDN** — sempre inline no HTML (compatibilidade iOS 9)

### Sheets (bottom sheets)
- Overlay: `rgba(0,0,0,0.42)`, fecha ao tocar fora
- Sheet: fundo cream, `border-radius: 18px 18px 0 0`, padding 22px 18px 40px
- Título: Georgia 18px bold
- Subtítulo: Courier 11px, sage-dark
- Botões empilhados verticalmente, gap 10px

### Toast
- Fixed, bottom 90px, centralized
- Fundo chumbo, texto cream
- Courier 11px, uppercase, letter-spacing 0.1em
- Border-radius 40px (pill)
- Aparece com `opacity + translateY` transition

---

## PWA / Instalação

### Meta tags obrigatórias (todo projeto)
```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="nome-app">
<meta name="mobile-web-app-capable" content="yes">
<meta name="theme-color" content="#b2c9c3">
<link rel="manifest" href="manifest.json">
<link rel="apple-touch-icon-precomposed" sizes="180x180" href="icon.png">
<link rel="apple-touch-icon" sizes="180x180" href="icon.png">
```

### manifest.json mínimo
```json
{
  "name": "nome completo",
  "short_name": "nome",
  "start_url": "./",
  "display": "standalone",
  "background_color": "#b2c9c3",
  "theme_color": "#b2c9c3",
  "orientation": "portrait",
  "icons": [
    { "src": "icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

### Standalone padding
```css
@media all and (display-mode: standalone) { .header { padding-top: 40px; } }
body.standalone .header { padding-top: 40px; }
```
```javascript
if (window.navigator.standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches) {
  document.body.className = (document.body.className + ' standalone').trim();
}
```

---

## Regras de JavaScript (ES5 — iOS 9.3.5)

| Proibido              | Usar em vez disso              |
|-----------------------|--------------------------------|
| `const` / `let`       | `var`                          |
| Arrow functions `=>`  | `function() {}`                |
| Template literals     | Concatenação com `+`           |
| Destructuring         | Atribuições individuais        |
| Spread `...`          | `Array.prototype.slice.call()` |
| Default params        | `param = param || default`     |
| `class`               | Funções construtoras           |
| CSS Grid              | Flexbox com `-webkit-` prefixes|
| `fetch()`             | `XMLHttpRequest`               |
| `Promise`             | Callbacks                      |
| Service Workers       | LocalStorage (dual-key)        |

### Flexbox — triplo prefixo obrigatório para iOS 9

iOS 9 Safari suporta flexbox mas exige os três prefixos. **Sem `-webkit-box-`**,
o conteúdo de botões vai para o canto superior esquerdo (bug crítico observado na calculadora).

```css
/* CORRETO — triplo prefixo para iOS 7/8/9 */
display: -webkit-box;       /* iOS 7 */
display: -webkit-flex;      /* iOS 8 */
display: flex;              /* moderno */

-webkit-box-orient: horizontal;   /* ou: vertical */
-webkit-box-direction: normal;
-webkit-flex-direction: row;      /* ou: column */
flex-direction: row;

-webkit-box-pack: center;         /* justify-content */
-webkit-justify-content: center;
justify-content: center;

-webkit-box-align: center;        /* align-items */
-webkit-align-items: center;
align-items: center;

-webkit-box-flex: 1;              /* flex-grow */
-webkit-flex: 1;
flex: 1;
```

> **Regra de ouro:** Se um botão ou container usa `flex` para centrar seu conteúdo,
> SEMPRE adicionar `-webkit-box-pack: center` e `-webkit-box-align: center`.
> A ausência desses prefixos é a causa mais comum de desalinhamento no iPad mini.

### LocalStorage — padrão dual-key
```javascript
var KEY_A = 'app_v1_a';
var KEY_B = 'app_v1_b';

function lsOk() {
  try { localStorage.setItem('__t','1'); localStorage.removeItem('__t'); return true; }
  catch(e) { return false; }
}
var LS = lsOk();

function persist(data) {
  if (!LS) return false;
  try {
    var j = JSON.stringify(data);
    localStorage.setItem(KEY_A, j);
    try { localStorage.setItem(KEY_B, j); } catch(e) {}
    return true;
  } catch(e) { return false; }
}

function load() {
  if (!LS) return null;
  try {
    var r = localStorage.getItem(KEY_A) || localStorage.getItem(KEY_B);
    return r ? JSON.parse(r) : null;
  } catch(e) { return null; }
}
```

---

## Acessibilidade — público 60+

O público-alvo real é 60+. Toda decisão visual deve favorecer a **legibilidade sem esforço**.

### Tamanhos mínimos de fonte

| Contexto                   | Mínimo | Recomendado |
|----------------------------|--------|-------------|
| Botão de ação principal    | 20px   | 28-32px     |
| Operador / símbolo         | 24px   | 34-36px     |
| Função (C, +/-, %)         | 16px   | 18-20px     |
| Label de campo             | 14px   | 16px        |
| Meta info (data, contador) | 10px   | 11px (ok)   |
| **Nunca abaixo de**        | **10px** para qualquer texto visível |

### Tamanhos mínimos de área tocável

- Botão: mínimo **44×44px** — preferencialmente **54px+**
- FAB: **56px** de diâmetro
- Cards clicáveis: altura mínima **80px**

### Contraste

- Texto principal sobre cream (#f0ece4): chumbo (#2a2a2a) — ratio 14:1 ✓
- Texto secundário sobre sage (#b2c9c3): sage-dark (#4a5e58) — ratio 4.5:1 ✓
- Nunca usar texto cinza claro sobre fundo claro

### Grid responsivo — bento

O grid de cards deve se adaptar à tela, nunca fixar o número de colunas no CSS.

```javascript
function calcLayout() {
  var w = window.innerWidth || 320;
  var padH = 28;    // 14px cada lado
  var gap  = 10;
  // Quantas colunas cabem com card mínimo de 150px
  var cols = Math.floor((w - padH + gap) / (150 + gap));
  if (cols < 2) cols = 2;
  if (cols > 4) cols = 4;
  var cardW = Math.floor((w - padH - gap * (cols - 1)) / cols);
  var cardH = Math.floor(cardW * 0.78); // proporção livro de notas
  return { cols: cols, cardW: cardW, cardH: cardH };
}
// Re-calcular ao mudar orientação
window.addEventListener('orientationchange', function() {
  setTimeout(renderList, 300);
}, false);
```

Resultado esperado por tela:
| Dispositivo | Largura | Colunas | Card width |
|-------------|---------|---------|------------|
| iPhone SE   | 375px   | 2 cols  | ~168px     |
| iPhone Pro  | 430px   | 2 cols  | ~196px     |
| iPad mini   | 768px   | 3 cols  | ~240px     |
| iPad Pro    | 1024px  | 4 cols  | ~240px     |

---

## Checklist de qualidade (todo projeto novo)

- [ ] ES5 puro (sem const/let/arrow/template literals)
- [ ] Flexbox TRIPLO prefixo: `-webkit-box-` + `-webkit-` + sem prefixo
- [ ] `-webkit-box-pack: center` e `-webkit-box-align: center` em todo flex container que centra
- [ ] Fonte mínima 20px em botões de ação, 32px+ em calculadoras/jogos
- [ ] Área tocável mínima 44×44px em qualquer elemento clicável
- [ ] Grid responsivo: calcLayout() com window.innerWidth, nunca colunas fixas no CSS
- [ ] Paleta sage/cream/chumbo aplicada
- [ ] Georgia para display, Courier New para UI
- [ ] Todos os botões com Phosphor SVG inline
- [ ] FAB com flex centering (não line-height)
- [ ] LocalStorage dual-key + lsOk()
- [ ] Meta tags PWA (apple-mobile-web-app-capable etc.)
- [ ] manifest.json com icons 192 + 512 (maskable)
- [ ] apple-touch-icon-precomposed (sem badge iOS)
- [ ] Standalone detection + padding-top: 40px
- [ ] Toast para feedback de ações
- [ ] tap feedback (scale transform) em elementos clicáveis
- [ ] -webkit-tap-highlight-color: transparent
- [ ] -webkit-text-size-adjust: 100%
- [ ] -webkit-overflow-scrolling: touch em scrolls
- [ ] UX writing em português brasileiro

---

*Manual mantido por Rafa Mass — atualizar conforme o sistema evolui.*

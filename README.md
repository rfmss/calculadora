# Calculadora

Calculadora local, acessível e sem dependências, com modos básico e científico e interface RafaMass Blueprint.

## Recursos

- operações básicas e porcentagem contextual;
- funções trigonométricas em graus ou radianos;
- raiz, quadrado, logaritmos, constantes e inverso;
- repetição da última operação com `=`;
- teclado físico;
- recuperação explícita após erros;
- PWA offline;
- nenhuma conta, nuvem ou biblioteca obrigatória;
- interface sem rolagem, adaptada ao `visualViewport`.

## Arquitetura

```text
index.html
assets/css/rafamass-blueprint.css
assets/css/app.css
assets/js/calculator-engine.js
assets/js/app.js
scripts/audit-calculator.js
docs/AUDITORIA-LOGICA.md
docs/DESIGN-BLUEPRINT.md
sw.js
manifest.json
```

`calculator-engine.js` não depende do DOM. `app.js` traduz eventos de interface e teclado para a engine. O sistema visual fica isolado nos arquivos CSS.

## Auditoria

```bash
node --check assets/js/calculator-engine.js
node --check assets/js/app.js
node --check sw.js
node scripts/audit-calculator.js
```

## Ícones

Ações de navegação e modo usam formas do Microsoft Fluent UI System Icons sob MIT. A atribuição está em `THIRD_PARTY_NOTICES.md`.

## Publicação

O projeto é estático e pode ser publicado diretamente pelo GitHub Pages.

## Licença

MIT.

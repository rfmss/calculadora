# Calculadora

Calculadora local, acessível e sem dependências, com modos básico e científico.

## Recursos

- operações básicas e porcentagem contextual;
- funções trigonométricas em graus ou radianos;
- raiz, quadrado, logaritmos, constantes e inverso;
- teclado físico;
- recuperação explícita após erros;
- PWA offline;
- nenhuma conta, nuvem ou biblioteca obrigatória.

## Arquitetura

```text
index.html
assets/css/app.css
assets/js/calculator-engine.js
assets/js/app.js
scripts/audit-calculator.js
sw.js
manifest.json
```

`calculator-engine.js` não depende do DOM. `app.js` traduz eventos de interface e teclado para a engine.

## Auditoria

```bash
node --check assets/js/calculator-engine.js
node --check assets/js/app.js
node --check sw.js
node scripts/audit-calculator.js
```

## Publicação

O projeto é estático e pode ser publicado diretamente pelo GitHub Pages.

## Licença

MIT.

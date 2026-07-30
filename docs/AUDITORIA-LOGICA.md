# Auditoria lógica da Calculadora

## Estado anterior

A implementação original concentrava interface, estilo e motor no `index.html`. A divisão por zero mostrava um aviso, mas devolvia `0`; funções científicas aceitavam domínios inválidos e deixavam `NaN` no estado; o limite de dígitos era conferido depois da concatenação; e não havia teste automatizado para porcentagem, repetição de `=` ou troca de operador.

## Decisões

- O motor é independente do DOM e exportável para Node.js.
- Divisão por zero e domínios inválidos entram em estado explícito de erro.
- Um novo dígito recupera a calculadora após erro; funções e operadores não operam sobre um estado inválido.
- A entrada é limitada a quinze algarismos antes de qualquer mutação.
- `=` repetido repete a última operação.
- Em soma e subtração, porcentagem é relativa ao acumulador: `200 + 10% = 220`.
- Em multiplicação e divisão, porcentagem vira fração: `200 × 10% = 20`.
- Trigonometria possui unidade explícita em graus ou radianos.
- Tangentes indefinidas, raiz negativa, logaritmo não positivo e inverso de zero são rejeitados.

## Auditor automatizado

Execute:

```bash
node scripts/audit-calculator.js
```

O script cobre precisão decimal, operações encadeadas, porcentagem contextual, repetição de igual, funções científicas, DEG/RAD, limites, recuperação e erros de domínio.

## Escopo preservado

A fundação continua local, sem dependências, sem conta e utilizável por toque ou teclado físico.

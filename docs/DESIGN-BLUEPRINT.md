# RafaMass Blueprint — Calculadora

## Direção

A calculadora usa a assinatura RafaMass Blueprint sem copiar o tabuleiro do Dirlizanu. O visor é o objeto principal; o teclado funciona como conjunto de blocos físicos; cyan organiza funções e operadores; o preto encerra a operação. Nenhum botão usa vermelhão como chamada principal.

## Hierarquia

1. resultado;
2. expressão em andamento;
3. teclado numérico;
4. operadores;
5. funções científicas;
6. metadados e navegação.

## Cor

- palco: `--rm-stage-deep`;
- papel: `--rm-paper` e `--rm-paper-high`;
- tinta: `--rm-ink`;
- construção: `--rm-cyan-strong` e `--rm-cyan-pale`;
- vermelho: somente erro ou registro excepcional.

## Responsividade

A página não rola durante o uso. `assets/js/app.js` mede o `visualViewport` e publica `--app-height`. Antes de reduzir os alvos de toque, a interface:

- remove a barra técnica;
- reduz metadados;
- oculta o rodapé;
- muda para duas colunas em paisagem baixa;
- mantém o visor e todas as teclas dentro da área útil.

Largura mínima: 320 px. Os alvos principais permanecem com pelo menos 42 px; em telas excepcionalmente baixas, o mínimo visual cai apenas para preservar todas as funções sem rolagem.

## Ícones

Ações de navegação e mudança de modo usam Microsoft Fluent UI System Icons incorporados localmente. Números, operadores e símbolos matemáticos permanecem tipográficos porque são o próprio conteúdo da tecla.

## Acessibilidade

- HTML semântico;
- `output` com atualização anunciada;
- mensagens de erro em região de status;
- nomes acessíveis para funções científicas;
- foco visível;
- teclado físico;
- movimento reduzido respeitado;
- zoom do navegador permitido.

## Manutenção

O motor não deve importar classes ou IDs da interface. Mudanças visuais ficam em `assets/css/`; regras matemáticas ficam em `assets/js/calculator-engine.js` e precisam de cobertura em `scripts/audit-calculator.js`.

'use strict';

var assert = require('assert');
var CalculatorEngine = require('../assets/js/calculator-engine.js');

function run(keys, options) {
  var engine = new CalculatorEngine(options || {});
  keys.forEach(function (key) { engine.press(key); });
  return engine;
}

function number(engine) {
  return Number(engine.snapshot().display);
}

assert.strictEqual(number(run(['0', '.', '1', '+', '0', '.', '2', '='])), 0.3, '0,1 + 0,2 deve resultar em 0,3');
assert.strictEqual(number(run(['5', '+', '2', '=', '='])), 9, 'igual repetido deve repetir a última operação');
assert.strictEqual(number(run(['2', '0', '0', '+', '1', '0', '%', '='])), 220, 'porcentagem em soma deve ser relativa ao acumulador');
assert.strictEqual(number(run(['2', '0', '0', '*', '1', '0', '%', '='])), 20, 'porcentagem em multiplicação deve ser fração decimal');
assert.strictEqual(number(run(['9', 'sqrt'])), 3, 'raiz de 9 deve ser 3');
assert.strictEqual(number(run(['3', '0', 'sin'], { angleMode: 'deg' })), 0.5, 'seno de 30 graus deve ser 0,5');

var rad = new CalculatorEngine({ angleMode: 'rad' });
rad.press('pi');
rad.press('/');
rad.press('2');
rad.press('=');
rad.press('sin');
assert.ok(Math.abs(number(rad) - 1) < 1e-12, 'seno de pi/2 radianos deve ser 1');

var division = run(['8', '/', '0', '=']).snapshot();
assert.strictEqual(division.display, 'Erro', 'divisão por zero deve produzir estado de erro');
assert.strictEqual(division.error, 'divisão por zero');

var domain = run(['9', 'sign', 'sqrt']).snapshot();
assert.strictEqual(domain.display, 'Erro', 'raiz negativa deve produzir estado de erro');

var limit = new CalculatorEngine();
'12345678901234567890'.split('').forEach(function (digit) { limit.press(digit); });
assert.strictEqual(limit.snapshot().display.replace(/[-.]/g, '').length, 15, 'entrada deve respeitar 15 dígitos sem mutação oculta');

var replaceOperator = run(['8', '+', '*', '2', '=']);
assert.strictEqual(number(replaceOperator), 16, 'o operador mais recente deve substituir o anterior');

var recover = run(['1', '/', '0', '=', '7']);
assert.strictEqual(number(recover), 7, 'um dígito deve recuperar a calculadora após erro');

var backspace = run(['1', '2', '3', 'CE']);
assert.strictEqual(number(backspace), 12, 'backspace deve apagar somente o último dígito');

console.log('AUDITORIA APROVADA');
console.log('- operações básicas e precisão decimal: ok');
console.log('- porcentagem contextual: ok');
console.log('- funções científicas e modos angulares: ok');
console.log('- domínios inválidos e divisão por zero: ok');
console.log('- repetição de igual, limite de dígitos e recuperação: ok');

(function (root, factory) {
  'use strict';
  var CalculatorEngine = factory();
  if (typeof module === 'object' && module.exports) module.exports = CalculatorEngine;
  else root.CalculatorEngine = CalculatorEngine;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var DIGIT_LIMIT = 15;
  var OPERATORS = ['+', '-', '*', '/'];

  function CalculatorEngine(options) {
    options = options || {};
    this.onChange = typeof options.onChange === 'function' ? options.onChange : function () {};
    this.angleMode = options.angleMode === 'rad' ? 'rad' : 'deg';
    this.reset(false);
  }

  CalculatorEngine.prototype.reset = function (notify) {
    this.input = '0';
    this.accumulator = null;
    this.operator = null;
    this.waitingForOperand = false;
    this.justEvaluated = false;
    this.lastOperator = null;
    this.lastOperand = null;
    this.expression = '';
    this.error = null;
    if (notify !== false) this.emit();
  };

  CalculatorEngine.prototype.snapshot = function () {
    return {
      display: this.input,
      expression: this.expression,
      accumulator: this.accumulator,
      operator: this.operator,
      waitingForOperand: this.waitingForOperand,
      justEvaluated: this.justEvaluated,
      angleMode: this.angleMode,
      error: this.error
    };
  };

  CalculatorEngine.prototype.emit = function () {
    this.onChange(this.snapshot());
  };

  CalculatorEngine.prototype.setAngleMode = function (mode) {
    this.angleMode = mode === 'rad' ? 'rad' : 'deg';
    this.emit();
  };

  CalculatorEngine.prototype.press = function (key) {
    key = String(key);

    if (this.error && key !== 'C') {
      if (/^[0-9.]$/.test(key) || key === 'pi' || key === 'e') this.reset(false);
      else return this.snapshot();
    }

    if (key === 'C') this.reset(false);
    else if (key === 'CE' || key === 'backspace') this.backspace();
    else if (/^[0-9]$/.test(key)) this.inputDigit(key);
    else if (key === '.' || key === ',') this.inputDecimal();
    else if (key === 'sign') this.toggleSign();
    else if (key === '%') this.percent();
    else if (OPERATORS.indexOf(key) !== -1) this.chooseOperator(key);
    else if (key === '=') this.equals();
    else if (key === 'pi') this.constant(Math.PI, 'π');
    else if (key === 'e') this.constant(Math.E, 'e');
    else if (['sin', 'cos', 'tan', 'sqrt', 'pow2', 'log', 'ln', 'inv'].indexOf(key) !== -1) this.applyScientific(key);

    this.emit();
    return this.snapshot();
  };

  CalculatorEngine.prototype.inputDigit = function (digit) {
    if (this.waitingForOperand || this.justEvaluated) {
      this.input = digit;
      this.waitingForOperand = false;
      this.justEvaluated = false;
      if (!this.operator) this.expression = '';
      return;
    }

    var count = this.input.replace(/[-.]/g, '').length;
    if (count >= DIGIT_LIMIT) return;
    this.input = this.input === '0' ? digit : this.input + digit;
  };

  CalculatorEngine.prototype.inputDecimal = function () {
    if (this.waitingForOperand || this.justEvaluated) {
      this.input = '0.';
      this.waitingForOperand = false;
      this.justEvaluated = false;
      if (!this.operator) this.expression = '';
      return;
    }
    if (this.input.indexOf('.') === -1) this.input += '.';
  };

  CalculatorEngine.prototype.toggleSign = function () {
    if (this.input === '0' || this.input === 'Erro') return;
    this.input = this.input.charAt(0) === '-' ? this.input.slice(1) : '-' + this.input;
  };

  CalculatorEngine.prototype.backspace = function () {
    if (this.waitingForOperand || this.justEvaluated) return;
    if (this.input.length <= 1 || (this.input.charAt(0) === '-' && this.input.length === 2)) this.input = '0';
    else this.input = this.input.slice(0, -1);
  };

  CalculatorEngine.prototype.chooseOperator = function (nextOperator) {
    var value = this.currentNumber();
    if (value === null) return;

    if (this.operator && !this.waitingForOperand) {
      var chained = this.calculate(this.accumulator, this.operator, value);
      if (chained === null) return;
      this.accumulator = chained;
      this.input = this.format(chained);
    } else if (this.accumulator === null || this.justEvaluated) {
      this.accumulator = value;
    }

    this.operator = nextOperator;
    this.waitingForOperand = true;
    this.justEvaluated = false;
    this.lastOperator = null;
    this.lastOperand = null;
    this.expression = this.format(this.accumulator) + ' ' + this.operatorLabel(nextOperator);
  };

  CalculatorEngine.prototype.equals = function () {
    if (!this.operator) {
      if (!this.justEvaluated || !this.lastOperator || this.lastOperand === null) return;
      var repeated = this.calculate(this.currentNumber(), this.lastOperator, this.lastOperand);
      if (repeated === null) return;
      this.expression = this.format(this.currentNumber()) + ' ' + this.operatorLabel(this.lastOperator) + ' ' + this.format(this.lastOperand);
      this.input = this.format(repeated);
      this.accumulator = repeated;
      return;
    }

    var right = this.waitingForOperand ? this.accumulator : this.currentNumber();
    var left = this.accumulator;
    var result = this.calculate(left, this.operator, right);
    if (result === null) return;

    this.expression = this.format(left) + ' ' + this.operatorLabel(this.operator) + ' ' + this.format(right);
    this.lastOperator = this.operator;
    this.lastOperand = right;
    this.operator = null;
    this.waitingForOperand = false;
    this.justEvaluated = true;
    this.accumulator = result;
    this.input = this.format(result);
  };

  CalculatorEngine.prototype.percent = function () {
    var current = this.currentNumber();
    if (current === null) return;

    if (this.operator && this.accumulator !== null) {
      if (this.operator === '+' || this.operator === '-') current = this.accumulator * current / 100;
      else current = current / 100;
    } else {
      current = current / 100;
    }

    this.input = this.format(current);
    this.waitingForOperand = false;
    this.justEvaluated = false;
  };

  CalculatorEngine.prototype.constant = function (value, label) {
    this.input = this.format(value);
    this.waitingForOperand = false;
    this.justEvaluated = false;
    this.expression = this.operator ? this.expression : label;
  };

  CalculatorEngine.prototype.applyScientific = function (kind) {
    var value = this.currentNumber();
    if (value === null) return;
    var result;
    var label;

    if (kind === 'sqrt') {
      if (value < 0) return this.fail('raiz de número negativo');
      result = Math.sqrt(value);
      label = '√(' + this.format(value) + ')';
    } else if (kind === 'pow2') {
      result = value * value;
      label = '(' + this.format(value) + ')²';
    } else if (kind === 'log') {
      if (value <= 0) return this.fail('log exige número positivo');
      result = Math.log(value) / Math.LN10;
      label = 'log(' + this.format(value) + ')';
    } else if (kind === 'ln') {
      if (value <= 0) return this.fail('ln exige número positivo');
      result = Math.log(value);
      label = 'ln(' + this.format(value) + ')';
    } else if (kind === 'inv') {
      if (value === 0) return this.fail('divisão por zero');
      result = 1 / value;
      label = '1 ÷ ' + this.format(value);
    } else {
      var radians = this.angleMode === 'deg' ? value * Math.PI / 180 : value;
      if (kind === 'tan' && Math.abs(Math.cos(radians)) < 1e-12) return this.fail('tangente indefinida');
      result = Math[kind](radians);
      label = kind + '(' + this.format(value) + ' ' + this.angleMode.toUpperCase() + ')';
    }

    if (!Number.isFinite(result)) return this.fail('resultado fora do limite');
    this.input = this.format(result);
    this.waitingForOperand = false;
    this.justEvaluated = false;
    this.expression = label;
  };

  CalculatorEngine.prototype.calculate = function (left, operator, right) {
    var result;
    if (operator === '+') result = left + right;
    else if (operator === '-') result = left - right;
    else if (operator === '*') result = left * right;
    else if (operator === '/') {
      if (right === 0) {
        this.fail('divisão por zero');
        return null;
      }
      result = left / right;
    } else result = right;

    if (!Number.isFinite(result)) {
      this.fail('resultado fora do limite');
      return null;
    }
    return result;
  };

  CalculatorEngine.prototype.currentNumber = function () {
    var value = Number(this.input);
    if (!Number.isFinite(value)) {
      this.fail('entrada inválida');
      return null;
    }
    return value;
  };

  CalculatorEngine.prototype.format = function (number) {
    if (!Number.isFinite(number)) return 'Erro';
    if (Object.is(number, -0) || Math.abs(number) < 1e-15) number = 0;
    var absolute = Math.abs(number);
    if (absolute >= 1e15 || (absolute > 0 && absolute < 1e-10)) return number.toExponential(8).replace(/\.0+e/, 'e');
    return Number(number.toPrecision(14)).toString();
  };

  CalculatorEngine.prototype.operatorLabel = function (operator) {
    if (operator === '*') return '×';
    if (operator === '/') return '÷';
    if (operator === '-') return '−';
    return operator;
  };

  CalculatorEngine.prototype.fail = function (message) {
    this.input = 'Erro';
    this.expression = message;
    this.error = message;
    this.accumulator = null;
    this.operator = null;
    this.waitingForOperand = false;
    this.justEvaluated = false;
    this.lastOperator = null;
    this.lastOperand = null;
    return null;
  };

  return CalculatorEngine;
}));

(function () {
  'use strict';

  var body = document.body;
  var display = document.getElementById('display-main');
  var expression = document.getElementById('display-expression');
  var status = document.getElementById('calculator-status');
  var basicPanel = document.getElementById('basic-panel');
  var scientificPanel = document.getElementById('scientific-panel');
  var modeButton = document.getElementById('mode-toggle');
  var angleButton = document.getElementById('angle-toggle');
  var viewportTimer = null;
  var scientific = false;

  var engine = new CalculatorEngine({
    angleMode: loadAngleMode(),
    onChange: render
  });

  render(engine.snapshot());
  registerEvents();
  syncViewport();
  registerServiceWorker();

  function render(snapshot) {
    display.textContent = localizeNumber(snapshot.display);
    expression.textContent = snapshot.expression || 'pronta para calcular';
    status.textContent = snapshot.error ? 'Erro: ' + snapshot.error : 'Calculadora pronta';
    body.dataset.error = snapshot.error ? 'true' : 'false';
    body.dataset.mode = scientific ? 'scientific' : 'basic';
    angleButton.textContent = snapshot.angleMode.toUpperCase();
    angleButton.setAttribute('aria-label', 'Unidade angular: ' + (snapshot.angleMode === 'deg' ? 'graus' : 'radianos'));
    angleButton.setAttribute('aria-pressed', snapshot.angleMode === 'rad' ? 'true' : 'false');
    display.className = 'display-main';
    var length = snapshot.display.length;
    if (length > 16) display.classList.add('display-compact');
    else if (length > 11) display.classList.add('display-medium');
  }

  function localizeNumber(value) {
    return String(value).replace('.', ',');
  }

  function press(key) {
    engine.press(key);
  }

  function toggleMode() {
    scientific = !scientific;
    basicPanel.hidden = scientific;
    scientificPanel.hidden = !scientific;
    modeButton.setAttribute('aria-pressed', scientific ? 'true' : 'false');
    modeButton.querySelector('.button-label').textContent = scientific ? 'Básica' : 'Científica';
    body.dataset.mode = scientific ? 'scientific' : 'basic';
  }

  function toggleAngleMode() {
    var next = engine.angleMode === 'deg' ? 'rad' : 'deg';
    engine.setAngleMode(next);
    try { localStorage.setItem('calculadora_angle_v1', next); } catch (error) {}
  }

  function loadAngleMode() {
    try { return localStorage.getItem('calculadora_angle_v1') === 'rad' ? 'rad' : 'deg'; }
    catch (error) { return 'deg'; }
  }

  function registerEvents() {
    document.addEventListener('click', function (event) {
      var keyButton = event.target.closest('[data-key]');
      if (keyButton) {
        press(keyButton.getAttribute('data-key'));
        return;
      }
      if (event.target.closest('#mode-toggle')) toggleMode();
      else if (event.target.closest('#angle-toggle')) toggleAngleMode();
    });

    document.addEventListener('keydown', function (event) {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      var key = event.key;
      var mapped = null;
      if (/^[0-9]$/.test(key)) mapped = key;
      else if (['+', '-', '*', '/', '%'].indexOf(key) !== -1) mapped = key;
      else if (key === '.' || key === ',') mapped = '.';
      else if (key === 'Enter' || key === '=') mapped = '=';
      else if (key === 'Escape' || key === 'Delete') mapped = 'C';
      else if (key === 'Backspace') mapped = 'CE';
      if (mapped) {
        event.preventDefault();
        press(mapped);
      }
    });

    window.addEventListener('resize', queueViewportSync);
    window.addEventListener('orientationchange', queueViewportSync);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', queueViewportSync);
      window.visualViewport.addEventListener('scroll', queueViewportSync);
    }
  }

  function queueViewportSync() {
    window.clearTimeout(viewportTimer);
    viewportTimer = window.setTimeout(syncViewport, 50);
  }

  function syncViewport() {
    var height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    var width = window.visualViewport ? window.visualViewport.width : window.innerWidth;
    document.documentElement.style.setProperty('--app-height', Math.round(height) + 'px');
    document.documentElement.style.setProperty('--app-width', Math.round(width) + 'px');
    body.dataset.viewport = height < 620 ? 'short' : 'regular';
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('./sw.js').catch(function () {});
      });
    }
  }
}());

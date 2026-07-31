import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const server = spawn('python3', ['-m', 'http.server', '4173'], { stdio: 'ignore' });
const viewports = [
  { width: 320, height: 568 },
  { width: 360, height: 640 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 720 },
  { width: 1366, height: 600 }
];

function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

try {
  await wait(700);
  const browser = await chromium.launch({ headless: true });

  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });

    for (const mode of ['basic', 'scientific']) {
      if (mode === 'scientific') await page.click('#mode-toggle');
      await page.waitForTimeout(80);

      const audit = await page.evaluate(() => {
        const visible = element => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
        };
        const controls = Array.from(document.querySelectorAll('.apparatus button, .apparatus a')).filter(visible);
        const outside = controls.filter(element => {
          const rect = element.getBoundingClientRect();
          return rect.left < -1 || rect.top < -1 || rect.right > innerWidth + 1 || rect.bottom > innerHeight + 1;
        }).map(element => ({ text: element.textContent.trim(), rect: element.getBoundingClientRect().toJSON() }));
        const display = document.querySelector('#display-main').getBoundingClientRect();
        return {
          outside,
          horizontalOverflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
          verticalOverflow: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - innerHeight,
          keyCount: Array.from(document.querySelectorAll('[data-key]')).filter(visible).length,
          displayVisible: display.width > 0 && display.height > 0 && display.bottom <= innerHeight + 1
        };
      });

      assert.ok(audit.horizontalOverflow <= 1, `${viewport.width}x${viewport.height} ${mode}: overflow horizontal ${audit.horizontalOverflow}`);
      assert.ok(audit.verticalOverflow <= 1, `${viewport.width}x${viewport.height} ${mode}: overflow vertical ${audit.verticalOverflow}`);
      assert.deepEqual(audit.outside, [], `${viewport.width}x${viewport.height} ${mode}: controles fora da tela`);
      assert.ok(audit.displayVisible, `${viewport.width}x${viewport.height} ${mode}: visor invisível`);
      assert.equal(audit.keyCount, mode === 'basic' ? 19 : 29, `${viewport.width}x${viewport.height} ${mode}: teclas ausentes`);
    }

    assert.deepEqual(errors, [], `${viewport.width}x${viewport.height}: erros de página`);
    await page.close();
  }

  const page = await browser.newPage({ viewport: { width: 375, height: 667 } });
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  await page.click('[data-key="1"]');
  await page.click('[data-key="+"]');
  await page.click('[data-key="2"]');
  await page.click('[data-key="="]');
  assert.equal(await page.textContent('#display-main'), '3');

  await page.click('[data-key="C"]');
  await page.click('[data-key="8"]');
  await page.click('[data-key="/"]');
  await page.click('[data-key="0"]');
  await page.click('[data-key="="]');
  assert.equal(await page.textContent('#display-main'), 'Erro');

  await page.click('#mode-toggle');
  await page.click('#angle-toggle');
  assert.ok(await page.$('#angle-toggle svg'), 'ícone Fluent do seletor angular deve permanecer');

  await browser.close();
  console.log('INTERFACE APROVADA');
  console.log('- 9 viewports × 2 modos sem rolagem ou controles cortados');
  console.log('- operações, erro e alternadores: ok');
} finally {
  server.kill('SIGTERM');
}

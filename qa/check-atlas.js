// Reusable with the Playwright browser_run_code tool (the supplied argument is page).
async (page) => {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('http://localhost:4377/?test=atlas');

  const endpoints = await page.evaluate(() => {
    const checks = [];
    for (let i = 0; i < sceneData.length; i++) {
      go(i, { instant: true });
      const fact = document.querySelector('#fact').getBoundingClientRect();
      const caption = document.querySelector('.lower-copy').getBoundingClientRect();
      checks.push({
        step: i + 1,
        horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
        copyOverlap: fact.bottom > caption.top - 8,
        footerVisible: document.querySelector('footer').getBoundingClientRect().bottom <= innerHeight + 1
      });
    }
    return checks;
  });
  assert(endpoints.length === 20, 'Expected 20 reading destinations.');
  assert(endpoints.every(step => !step.horizontalOverflow && !step.copyOverlap && step.footerVisible), 'Desktop layout regression.');

  await page.evaluate(() => go(5, { instant: true }));
  const screenTypes = await page.evaluate(() => [...document.querySelectorAll('[data-screen-kind]')].map(el => ({
    kind: el.dataset.screenKind,
    label: el.querySelector('.screen-kind-label').textContent,
    fits: (() => { const box = el.querySelector('.screen-kind-label').getBBox(); return box.x >= -48 && box.x + box.width <= 48; })()
  })));
  assert(screenTypes.map(screen => screen.kind).join(',') === 'content,content,question,content,question,content,content,question', 'Screens must interleave content and questions only.');
  assert(new Set(screenTypes.map(screen => screen.kind)).size === 2, 'Feedback belongs within questions, not a third screen type.');
  assert(screenTypes.every(screen => screen.label && screen.fits), 'Each screen needs a visible label that fits.');
  assert(await page.locator('[title], svg title, [role="tooltip"]').count() === 0, 'Hover must not show explanatory tooltips.');

  const counts = await page.evaluate(() => {
    const count = () => [...document.querySelectorAll('.mosaic-cell')]
      .filter(el => Number(getComputedStyle(el).opacity) > .5).length;
    go(9, { instant: true }); const screens = count();
    go(10, { instant: true }); const questions = count();
    return { screens, questions };
  });
  assert(counts.screens === 710 && counts.questions === 395, 'The diagram must represent the actual quantities.');

  const reversible = await page.evaluate(() => {
    go(2, { instant: true });
    const initial = document.querySelector('#module1').getAttribute('transform');
    go(11, { instant: true }); go(2, { instant: true });
    return initial === document.querySelector('#module1').getAttribute('transform');
  });
  assert(reversible, 'Backward seeking must preserve object poses.');

  await page.evaluate(() => go(0, { instant: true }));
  await page.locator('#next').click();
  await page.waitForFunction(() => travel && travel.progress() === 1);
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => travel && travel.progress() === 1);
  assert(await page.evaluate(() => current === 2), 'Keyboard navigation failed.');

  await page.evaluate(() => go(3));
  await page.locator('#pause').click();
  assert(await page.evaluate(() => travel.paused()), 'Pause must stop the playhead.');
  await page.locator('#pause').click();
  await page.waitForFunction(() => travel && travel.progress() === 1);

  await page.locator('#scrubber').fill('1000');
  await page.locator('#scrubber').dispatchEvent('input');
  assert(await page.evaluate(() => current === 19), 'Scrubbing must reach the final destination.');

  await page.locator('#guide-open').click();
  assert(await page.locator('#guide').evaluate(el => el.open), 'Notes did not open.');
  await page.keyboard.press('Escape');
  assert(await page.locator('#guide').evaluate(el => !el.open), 'Escape must close notes.');

  await page.evaluate(() => go(7, { instant: true }));
  await page.locator('[data-answer="wrong"]').click();
  assert(await page.locator('#feedback').evaluate(el => !el.hidden && el.classList.contains('wrong')), 'Wrong answer feedback missing.');
  await page.locator('[data-answer="correct"]').click();
  assert(await page.locator('#feedback').evaluate(el => !el.hidden && !el.classList.contains('wrong')), 'Correct answer feedback missing.');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(() => go(9));
  assert(await page.evaluate(() => master.time() === 9 * BEAT && !travel?.isActive()), 'Reduced motion must jump to the reading destination.');
  await page.emulateMedia({ reducedMotion: 'no-preference' });

  await page.setViewportSize({ width: 390, height: 844 });
  const mobile = await page.evaluate(() => {
    const checks = [];
    for (let i = 0; i < sceneData.length; i++) {
      go(i, { instant: true });
      checks.push(document.documentElement.scrollWidth <= innerWidth);
    }
    go(7, { instant: true });
    document.querySelector('[data-answer="correct"]').click();
    const phone = document.querySelector('#phone').getBoundingClientRect();
    const content = document.querySelector('#phone-interaction').getBoundingClientRect();
    return {
      noHorizontalOverflow: checks.every(Boolean),
      phoneContentFits: content.left >= phone.left && content.right <= phone.right && content.top >= phone.top && content.bottom <= phone.bottom
    };
  });
  assert(mobile.noHorizontalOverflow && mobile.phoneContentFits, 'Mobile layout regression.');
  assert(errors.length === 0, `Browser errors: ${errors.join(', ')}`);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => go(0, { instant: true }));
  return { passed: true, endpoints: endpoints.length, counts, reversible, mobile, browserErrors: errors };
}

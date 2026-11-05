// Run with the Playwright browser_run_code tool.
async (page) => {
  const assert = (ok, message) => { if (!ok) throw new Error(message); };
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:4377/?test=hover-v10');
  await page.evaluate(() => go(2, { instant: true }));
  const pose = await page.locator('#module1').getAttribute('transform');
  await page.locator('#module1').hover();
  await page.waitForFunction(() => new DOMMatrix(getComputedStyle(document.querySelector('#module1 > .hover-surface')).transform).m42 < -8.5);
  assert(pose === await page.locator('#module1').getAttribute('transform'), 'Hover changed the timeline pose.');
  await page.mouse.move(10, 10);
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#module1 > .hover-surface')).transform === 'none');

  await page.evaluate(() => go(3));
  assert(await page.locator('#experience').getAttribute('data-hover-ready') === 'false', 'Hover must be disabled during camera travel.');
  await page.waitForFunction(() => travel.progress() === 1);
  assert(await page.locator('#experience').getAttribute('data-hover-ready') === 'true', 'Hover did not resume at the destination.');

  await page.evaluate(() => go(11, { instant: true }));
  await page.locator('#cover').hover();
  await page.waitForFunction(() => new DOMMatrix(getComputedStyle(document.querySelector('#cover > .hover-surface')).transform).m42 < -9.5);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#cover > .hover-surface')).transform === 'none');

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.mouse.move(10, 10);
  await page.evaluate(() => go(0, { instant: true }));
  return { passed: true, folderLift: true, artworkLift: true, timelinePoseUnchanged: true, travelGuard: true, reducedMotion: true };
}

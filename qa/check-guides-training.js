// Run with the Playwright browser_run_code tool.
async (page) => {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('http://localhost:4377/?test=guide-training-v10');

  await page.evaluate(() => go(15, { instant: true }));
  await page.evaluate(() => go(16));
  await page.waitForFunction(() => travel && travel.progress() === 1);
  const guide = await page.evaluate(() => {
    const route = document.querySelector('#pdf-guide .pdf-route');
    return {
      scene: current,
      routeComplete: Number.parseFloat(getComputedStyle(route).strokeDashoffset) === 0,
      stepsVisible: [...document.querySelectorAll('#pdf-guide .pdf-step')].every(el => Number(getComputedStyle(el).opacity) === 1),
      ringsComplete: [...document.querySelectorAll('#pdf-guide .pdf-ring')].every(el => Number.parseFloat(getComputedStyle(el).strokeDashoffset) === 0),
      travelerX: Math.round(Number(gsap.getProperty('#pdf-guide .pdf-traveler', 'x'))),
      travelerHidden: getComputedStyle(document.querySelector('#pdf-guide .pdf-traveler')).visibility === 'hidden',
      coverX: Math.round(Number(gsap.getProperty('#pdf-guide .pdf-final-cover', 'x'))),
      approved: Number(getComputedStyle(document.querySelector('#pdf-guide .pdf-approved')).opacity) === 1
    };
  });
  assert(guide.scene === 16 && guide.routeComplete && guide.stepsVisible, 'The PDF production sequence did not finish.');
  assert(guide.ringsComplete && guide.travelerX === 285 && guide.travelerHidden, 'The PDF did not travel through all four stages.');
  assert(guide.coverX === 285 && guide.approved, 'The final PDF is not at the publishing stage.');

  await page.locator('#replay').click();
  await page.waitForFunction(() => travel && travel.progress() === 1);
  assert(await page.evaluate(() => Number(getComputedStyle(document.querySelector('#pdf-guide .pdf-approved')).opacity) === 1), 'PDF replay did not finish.');

  await page.evaluate(() => go(17));
  await page.waitForFunction(() => travel && travel.progress() === 1);
  const training = await page.evaluate(() => ({
    scene: current,
    linksComplete: [...document.querySelectorAll('#training .training-link')].every(el => Number.parseFloat(getComputedStyle(el).strokeDashoffset) === 0),
    peopleVisible: [...document.querySelectorAll('#training .training-person')].every(el => Number(getComputedStyle(el).opacity) === 1),
    topicsVisible: [...document.querySelectorAll('#training .training-topic')].every(el => Number(getComputedStyle(el).opacity) === 1),
    topicsY: [...document.querySelectorAll('#training .training-topic')].map(el => Math.round(Number(gsap.getProperty(el, 'y')))),
    facilitatorOverlap: (() => {
      const facilitator=document.querySelector('#training .training-facilitator').getBoundingClientRect();
      const topics=document.querySelector('#training .training-topics').getBoundingClientRect();
      return !(facilitator.bottom < topics.top || facilitator.top > topics.bottom || facilitator.right < topics.left || facilitator.left > topics.right);
    })(),
    pinX: Math.round(Number(gsap.getProperty('#training .temuco-pin', 'x'))),
    pinY: Math.round(Number(gsap.getProperty('#training .temuco-pin', 'y')))
  }));
  assert(training.scene === 17 && training.linksComplete && training.peopleVisible && training.topicsVisible, 'The training sequence did not finish.');
  assert(training.topicsY.every(y => y === 236) && !training.facilitatorOverlap, 'Training topics overlap the facilitator.');
  assert(training.pinX === -325 && training.pinY === -245, 'The Temuco marker moved away from its destination.');

  for (const viewport of [{ width: 1920, height: 1080 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    for (const scene of [16, 17]) {
      await page.evaluate(scene => go(scene, { instant: true }), scene);
      const fits = await page.evaluate(scene => {
        const visual = document.querySelector('.visual-space').getBoundingClientRect();
        const diagram = document.querySelector(scene === 16 ? '#pdf-guide' : '#training').getBoundingClientRect();
        return diagram.left >= visual.left - 1 && diagram.right <= visual.right + 1 && diagram.top >= visual.top - 1 && diagram.bottom <= visual.bottom + 1;
      }, scene);
      assert(fits, `Scene ${scene + 1} does not fit at ${viewport.width}×${viewport.height}.`);
    }
  }

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(() => go(16));
  assert(await page.evaluate(() => master.time() === 16 * BEAT && !travel?.isActive()), 'Reduced motion must jump to the PDF destination.');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => go(16, { instant: true }));
  return { passed: true, guide, training };
}

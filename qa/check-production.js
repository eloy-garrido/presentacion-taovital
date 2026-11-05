// Run with the Playwright browser_run_code tool.
async (page) => {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  await page.goto('http://localhost:4377/?test=production');
  const layouts=[];
  for (const viewport of [{width:1366,height:768},{width:1879,height:1047},{width:1920,height:1080}]) {
    await page.setViewportSize(viewport);
    await page.evaluate(() => go(12, {instant:true}));
    const layout=await page.evaluate(() => {
      const description=document.querySelector('#description').getBoundingClientRect();
      const fact=document.querySelector('#fact').getBoundingClientRect();
      const path=document.querySelector('#process-link3');
      const endpoint=path.getPointAtLength(path.getTotalLength()).matrixTransform(path.getScreenCTM());
      const circle=document.querySelector('#process4 circle');
      const center=new DOMPoint(0,0).matrixTransform(circle.getScreenCTM());
      return {
        textGap:fact.top-description.bottom,
        reviewConnectionDistance:Math.hypot(endpoint.x-center.x,endpoint.y-center.y),
        connectors:[...document.querySelectorAll('#process-line path')].map(el=>Number.parseFloat(getComputedStyle(el).strokeDashoffset))
      };
    });
    assert(layout.textGap>=20,'Process description overlaps its fact.');
    assert(layout.reviewConnectionDistance<1,'The final connector does not reach Review.');
    assert(layout.connectors.length===4 && layout.connectors.every(offset=>offset===0),'A process connector is unfinished.');
    layouts.push({...viewport,...layout});
  }
  const production=await page.evaluate(() => productionBoards.map(board => {
    go(board.scene,{instant:true});
    const root=document.getElementById(board.id);
    const artifact=root.querySelector('.work-traveler');
    return {
      expected:board.count,
      counter:Number(root.querySelector('.work-counter').textContent),
      pieces:root.querySelectorAll('.work-piece').length,
      batchesVisible:[...root.querySelectorAll('.work-batch')].every(el=>Number(getComputedStyle(el).opacity)===1),
      approvalVisible:Number(getComputedStyle(root.querySelector('.work-approved')).opacity)===1,
      finalPosition:Number(gsap.getProperty(artifact,'x'))
    };
  }));
  assert(production.every(board=>board.counter===board.expected && board.pieces===board.expected),'A production quantity does not match the proposal.');
  assert(production.every(board=>board.batchesVisible && board.approvalVisible && board.finalPosition===285),'A production sequence did not finish.');
  await page.evaluate(() => go(13,{instant:true}));
  await page.locator('#replay').click();
  await page.waitForFunction(() => travel.progress()===1);
  assert(await page.locator('#work-questions .work-counter').textContent()==='395','Replay did not restore the counter.');
  await page.setViewportSize({width:1440,height:900});
  await page.evaluate(() => go(12,{instant:true}));
  return {passed:true,layouts,production};
}

// Real browser test for widget layout and local persistence; requires Playwright/Chromium.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const os=require('node:os');
const root=path.resolve(__dirname,'../ruhe-tab');
const artifacts=fs.mkdtempSync(path.join(os.tmpdir(),'ruhe-tab-widget-tests-'));
const KEY='ruhe-tab-widget-sizes-v1';
const ids=['tasks','greeting','clock','goal','links'];
(async()=>{
 const manifest=JSON.parse(fs.readFileSync(root+'/manifest.json'));
 const server=http.createServer((req,res)=>{const name=req.url.slice(1)||'newtab.html';if(!['newtab.html','newtab.js','appearance.js','widget-sizes.js','styles.css'].includes(name)){res.writeHead(404);res.end();return}res.writeHead(200,{'Content-Type':name.endsWith('.html')?'text/html':name.endsWith('.css')?'text/css':'text/javascript','Content-Security-Policy':manifest.content_security_policy.extension_pages});res.end(fs.readFileSync(root+'/'+name))});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||chromium.executablePath(),headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-crashpad','--no-zygote']});
 try {
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const errors=[],external=[];
 context.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
 context.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith('http://127.0.0.1:'))external.push(r.url())});
 const page=await context.newPage();const url=`http://127.0.0.1:${server.address().port}/newtab.html`;
 await page.goto(url);await page.waitForFunction(()=>document.body.dataset.background==='forest');
 await page.locator('summary').click();await page.locator('#name-input').fill('Alex');await page.locator('#name-form button').click();
 await page.locator('#task-input').fill('Eine wichtige Aufgabe erledigen');await page.locator('#task-form button').click();
 await page.locator('#goal-input').fill('Zeit für das Wesentliche nehmen');await page.locator('#goal-form button').click();
 await page.locator('#add-shortcut').click();await page.locator('#shortcut-name').fill('Wikipedia');await page.locator('#shortcut-url').fill('de.wikipedia.org');await page.locator('#shortcut-form button[type=submit]').click();
 const appState=await page.evaluate(()=>localStorage.getItem('ruhe-tab-v1'));
 const target={tasks:'.tasks-panel',greeting:'.greeting-widget',clock:'.clock-widget',goal:'.goal-section',links:'.shortcut-icon'};
 const font={tasks:'.task-list label span',greeting:'#greeting',clock:'#clock',goal:'#goal-input',links:'.shortcut-label'};
 const box=async name=>await page.locator(target[name]).boundingBox();
 const size=async name=>await page.locator(font[name]).evaluate(el=>parseFloat(getComputedStyle(el).fontSize));
 const defaults=Object.fromEntries(await Promise.all(ids.map(async name=>[name,{box:await box(name),font:await size(name)}])));
 await page.locator('summary').click();
 const panelFont=await page.locator('#widget-size-title').evaluate(el=>getComputedStyle(el).fontSize);
 async function set(name,value,commit=true){await page.locator('#size-'+name).evaluate((el,args)=>{el.value=String(args.value);el.dispatchEvent(new Event('input',{bubbles:true}));if(args.commit)el.dispatchEvent(new Event('change',{bubbles:true}));},{value,commit})}
 // Preview must change layout without writing to storage on each pointer movement.
 await set('tasks',150,false);
 assert.equal(await page.evaluate(key=>localStorage.getItem(key),KEY),null);
 assert((await box('tasks')).width>defaults.tasks.box.width*1.4);
 assert((await size('tasks'))>defaults.tasks.font*1.4);
 await set('tasks',150);
 assert.equal(JSON.parse(await page.evaluate(key=>localStorage.getItem(key),KEY)).tasks,150);
 assert.equal(await page.locator('#size-tasks-value').innerText(),'150 %');
 assert.equal(await size('greeting'),defaults.greeting.font);
 for(const name of ['greeting','clock','goal','links']) {
  await set(name,150);
  assert((await size(name))>defaults[name].font*1.2,`${name} font grows`);
  assert((await box(name)).height>defaults[name].box.height,`${name} height grows`);
 }
 assert.equal(await page.locator('#widget-size-title').evaluate(el=>getComputedStyle(el).fontSize),panelFont);
 await page.locator('#close-appearance').click();
 await page.screenshot({path:path.join(artifacts,'large.png'),fullPage:true});
 await page.reload();await page.waitForFunction(()=>document.body.dataset.background==='forest');
 for(const name of ids)assert.equal(await page.locator('#size-'+name).inputValue(),'150');
 assert.equal(await page.evaluate(()=>localStorage.getItem('ruhe-tab-v1')),appState);
 await page.locator('summary').click();
 // Keyboard controls use native range behavior, and save immediately per arrow key.
 await page.locator('#size-greeting').focus();await page.keyboard.press('ArrowLeft');
 assert.equal(await page.locator('#size-greeting').inputValue(),'145');
 assert.equal(JSON.parse(await page.evaluate(key=>localStorage.getItem(key),KEY)).greeting,145);
 const second=await context.newPage();await second.goto(url);
 await second.locator('summary').click();await second.locator('#size-tasks').evaluate(el=>{el.value='75';el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));});
 await page.waitForFunction(()=>document.getElementById('size-tasks').value==='75');
 assert.equal(await page.locator('#size-greeting').inputValue(),'145');
 assert((await box('tasks')).width<defaults.tasks.box.width*.8);
 // Sizes must reflow without overlap or horizontal scrolling at narrow and intermediate widths.
 await page.locator('#close-appearance').click();
 for(const width of [320,390,800,1000,1100,1440]) {
  await page.setViewportSize({width,height:900});
  for(const value of [75,150]) {
   for(const name of ids)await set(name,value);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`horizontal overflow at ${width}px/${value}%`);
   const layout=await page.evaluate(()=>{
    const a=document.querySelector('.focus').getBoundingClientRect(),b=document.querySelector('.tasks-panel').getBoundingClientRect(),c=document.querySelector('.shortcuts').getBoundingClientRect();
    const apart=(a,b)=>a.right<=b.left+.5||b.right<=a.left+.5||a.bottom<=b.top+.5||b.bottom<=a.top+.5;
    return apart(a,b)&&apart(a,c)&&apart(b,c);
   });assert(layout,`overlapping widgets at ${width}px/${value}%`);
  }
 }
 await page.setViewportSize({width:390,height:844});await page.locator('summary').click();
 for(const name of ids){await page.locator('#size-'+name).scrollIntoViewIfNeeded();assert(await page.locator('#size-'+name).isVisible());}
 await page.locator('#reset-widget-sizes').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(artifacts,'mobile-settings.png'),fullPage:true});
 await page.locator('#reset-widget-sizes').click();
 for(const name of ids)assert.equal(await page.locator('#size-'+name).inputValue(),'100');
 assert.equal(await page.evaluate(key=>localStorage.getItem(key),KEY),null);
 await second.waitForFunction(()=>document.getElementById('size-tasks').value==='100');await second.close();
 assert.equal(await page.evaluate(()=>localStorage.getItem('ruhe-tab-v1')),appState);
 await page.evaluate(key=>localStorage.setItem(key,'{kaputt'),KEY);await page.reload();await page.locator('summary').click();assert.match(await page.locator('#widget-size-status').innerText(),/nicht gelesen/);for(const name of ids)assert.equal(await page.locator('#size-'+name).inputValue(),'100');
 await page.locator('#reset-widget-sizes').click();
 await page.evaluate(key=>localStorage.setItem(key,JSON.stringify({tasks:999,greeting:-10,clock:'999; color:red',goal:null,links:132})),KEY);await page.reload();
 assert.equal(await page.locator('#size-tasks').inputValue(),'150');assert.equal(await page.locator('#size-greeting').inputValue(),'75');assert.equal(await page.locator('#size-clock').inputValue(),'100');assert.equal(await page.locator('#size-goal').inputValue(),'100');assert.equal(await page.locator('#size-links').inputValue(),'130');
 await page.locator('summary').click();await page.locator('#reset-widget-sizes').click();
 await page.evaluate(()=>{window.realSet=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key==='ruhe-tab-widget-sizes-v1')throw new DOMException('Test','QuotaExceededError');return window.realSet.call(this,key,value)}});
 await set('tasks',150);assert.match(await page.locator('#widget-size-status').innerText(),/nicht gespeichert/);assert.equal(await page.locator('#size-tasks').inputValue(),'100');assert.equal(await page.evaluate(key=>localStorage.getItem(key),KEY),null);
 await page.evaluate(()=>{Storage.prototype.setItem=window.realSet});
 await context.setOffline(true);await set('greeting',125);assert.equal(JSON.parse(await page.evaluate(key=>localStorage.getItem(key),KEY)).greeting,125);await context.setOffline(false);
 assert.deepEqual(external,[]);assert.deepEqual(errors,[]);
 await page.setViewportSize({width:1440,height:1000});await page.locator('#reset-widget-sizes').click();await page.locator('#close-appearance').click();await page.screenshot({path:path.join(artifacts,'default.png'),fullPage:true});
 const results=['Independent live sizing for all five widgets changes rendered dimensions and typography.','Preview does not persist until change; reopening and reloading preserve saved sizes.','Native keyboard controls, cross-tab synchronization and independent field merging work.','75% and 150% layouts fit 320, 390, 800, 1000, 1100 and 1440px without widget overlap or horizontal scrolling.','Customization controls stay unscaled and scrollable; reset affects sizes only.','Malformed settings, out-of-range values and failed storage writes are handled.','Name, goal, tasks and links survive all size changes; offline operation has no external requests or runtime errors.'];
 console.log(JSON.stringify({results,artifacts},null,2));fs.writeFileSync(path.join(artifacts,'results.json'),JSON.stringify(results,null,2));
 }finally{await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});

// Native pointer/keyboard interaction and real local storage in Chromium.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const os=require('node:os');
const root=path.resolve(__dirname,'../ruhe-tab');
const artifacts=fs.mkdtempSync(path.join(os.tmpdir(),'ruhe-tab-layout-tests-'));
const KEY='ruhe-tab-widget-layout-v1';
const names=['clock','greeting','goal','tasks','links','calendar'];
(async()=>{
 const manifest=JSON.parse(fs.readFileSync(root+'/manifest.json'));
 const server=http.createServer((req,res)=>{const file=req.url.slice(1)||'newtab.html';if(!['newtab.html','styles.css','newtab.js','appearance.js','widget-sizes.js','widget-layout.js','calendar.mjs','calendar-model.mjs'].includes(file)){res.writeHead(404);res.end();return}res.writeHead(200,{'Content-Type':file.endsWith('.html')?'text/html':file.endsWith('.css')?'text/css':'text/javascript','Content-Security-Policy':manifest.content_security_policy.extension_pages});res.end(fs.readFileSync(root+'/'+file))});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||chromium.executablePath(),headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-crashpad','--no-zygote']});
 try {
 const context=await browser.newContext({viewport:{width:1440,height:1000}}), errors=[],external=[];
 context.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
 context.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith('http://127.0.0.1:'))external.push(r.url())});
 const url=`http://127.0.0.1:${server.address().port}/newtab.html`;
 const page=await context.newPage();await page.goto(url);await page.waitForFunction(()=>document.body.dataset.background==='forest');
 await page.locator('summary').click();await page.locator('#name-input').fill('Alex');await page.locator('#name-form button').click();
 await page.locator('#task-input').fill('Eine Aufgabe');await page.locator('#task-form button').click();
 await page.locator('#goal-input').fill('Ein Ziel');await page.locator('#goal-form button').click();
 await page.locator('#add-shortcut').click();await page.locator('#shortcut-name').fill('Wikipedia');await page.locator('#shortcut-url').fill('de.wikipedia.org');await page.locator('#shortcut-form button[type=submit]').click();
 const appState=await page.evaluate(()=>localStorage.getItem('ruhe-tab-v1'));
 assert.equal(await page.locator('.layout-frame').count(),0);
 async function edit(p=page){await p.bringToFront();await p.locator('summary').click();await p.locator('#edit-widget-layout').click();await p.waitForFunction(()=>document.body.classList.contains('layout-editing'));await p.evaluate(()=>new Promise(requestAnimationFrame));}
 const frame=(name,p=page)=>p.locator('.layout-frame[data-widget="'+name+'"]');
 const handle=(name,p=page)=>frame(name,p).locator('.layout-handle');
 const saved=async(p=page)=>JSON.parse(await p.evaluate(key=>localStorage.getItem(key),KEY));
 async function matches(layout,p=page){await p.waitForFunction(expected=>{const area=document.querySelector('main');return Object.entries(expected.positions).every(([name,point])=>{const el=document.querySelector('.layout-frame[data-widget="'+name+'"]');if(!el)return false;const x=Math.max(0,Math.min(area.clientWidth-el.offsetWidth,point.x*area.clientWidth)),y=Math.max(0,Math.min(area.clientHeight-el.offsetHeight,point.y*area.clientHeight));return Math.abs(parseFloat(el.style.left)-x)<1&&Math.abs(parseFloat(el.style.top)-y)<1})},layout)}

 const pos=async name=>await frame(name).evaluate(el=>({x:parseFloat(el.style.left),y:parseFloat(el.style.top)}));
 async function bounded(p=page){return p.evaluate(()=>{const area=document.querySelector('main').getBoundingClientRect();return [...document.querySelectorAll('.layout-frame')].every(el=>{const r=el.getBoundingClientRect();return r.left>=area.left-1&&r.top>=area.top-1&&r.right<=area.right+1&&r.bottom<=area.bottom+1&&r.bottom<=innerHeight&&r.right<=innerWidth})})}
 async function dragTo(name,x,y,p=page){await handle(name,p).focus();const r=await handle(name,p).boundingBox();await p.mouse.move(r.x+Math.min(25,r.width/2),r.y+r.height/2);await p.mouse.down();await p.mouse.move(x,y,{steps:8});await p.mouse.up();}
 await edit();assert.equal(await page.locator('.layout-frame').count(),6);assert(await bounded());
 // Put the target at an accessible non-edge position using actual pointer capture.
 let h=await handle('tasks').boundingBox();await dragTo('tasks',h.x+25-170,h.y+h.height/2+100);
 let after=await saved();assert(after.positions.tasks.x>=0&&after.positions.tasks.y>=0);assert(await bounded());
 const stable=await saved();
 // Pointer movement is a preview; cancelling with Escape restores the saved position.
 h=await handle('tasks').boundingBox();await handle('tasks').focus();const beforeCancel=await pos('tasks');
 await page.mouse.move(h.x+25,h.y+15);await page.mouse.down();await page.mouse.move(h.x+100,h.y+60,{steps:4});assert.deepEqual(await saved(),stable);await page.keyboard.press('Escape');await page.mouse.up();assert.deepEqual(await saved(),stable);assert.deepEqual(await pos('tasks'),beforeCancel);
 // All six widgets support precise keyboard movement.
 for(const name of names){await handle(name).focus();const old=await pos(name);await page.keyboard.press('ArrowRight');const right=await pos(name);assert(right.x>=old.x);await page.keyboard.down('Shift');await page.keyboard.press('ArrowLeft');await page.keyboard.up('Shift');const fine=await pos(name);assert(Math.abs(fine.x-Math.max(0,right.x-1))<1.1)}
 const placed=await saved();
 await page.locator('#finish-widget-layout').click();assert.equal(await page.locator('#finish-widget-layout').isVisible(),false);assert(await page.locator('body').evaluate(el=>el.classList.contains('layout-free')));
 for(const name of names)assert(await handle(name).isHidden());
 await page.reload();await page.waitForFunction(()=>document.querySelectorAll('.layout-frame').length===6);assert.deepEqual(await saved(),placed);await matches(placed);assert(await bounded());assert.equal(await page.locator('body').evaluate(el=>el.classList.contains('layout-editing')),false);
 // Ordinary form and link actions still work after the DOM nodes were moved into frames.
 await page.locator('#task-input').fill('Weitere Aufgabe');await page.locator('#task-form button').click();assert.equal(await page.locator('#task-list li').count(),2);assert.equal(await page.locator('#shortcut-list a').getAttribute('href'),'https://de.wikipedia.org/');
 await edit();
 await dragTo('clock',-200,-200);assert(await bounded());assert.equal((await pos('clock')).x,0);assert.equal((await pos('clock')).y,0);
 await dragTo('links',2000,2000);assert(await bounded());
 // Resizing the window clamps display positions without overwriting the stored layout.
 const beforeResize=await saved();await page.locator('#finish-widget-layout').click();
 for(const viewport of [{width:390,height:844},{width:320,height:568},{width:800,height:600},{width:1440,height:1000}]){
  await page.setViewportSize(viewport);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));assert(await bounded(),JSON.stringify(viewport));assert.deepEqual(await saved(),beforeResize);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 // Existing size controls resize the freely positioned frames and keep them within the stage.
 await page.locator('summary').click();
 for(const name of ['tasks','greeting','clock','goal','links'])await page.locator('#size-'+name).evaluate(el=>{el.value='150';el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));});
 await page.locator('#close-appearance').click();await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));assert(await bounded());assert.deepEqual(await saved(),beforeResize);
 // More task content must remain scrollable, without pushing a frame outside the viewport.
 for(let i=0;i<10;i++){await handle('tasks').evaluate(el=>el.parentElement.style.zIndex='500');await page.locator('#task-input').fill('Aufgabe '+i);await page.locator('#task-form button').click()}
 await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));assert(await bounded());
 const second=await context.newPage();await second.goto(url);await second.waitForFunction(()=>document.querySelectorAll('.layout-frame').length===6);await edit(second);await handle('greeting',second).focus();await second.keyboard.press('ArrowLeft');const changed=await saved(second);await page.waitForFunction(expected=>localStorage.getItem('ruhe-tab-widget-layout-v1')===expected,JSON.stringify(changed));await matches(changed);assert(await bounded());
 // Failed writes restore the last saved arrangement.
 await edit();await handle('goal').focus();const beforeFailure=await saved();await page.evaluate(()=>{window.originalSet=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key==='ruhe-tab-widget-layout-v1')throw new DOMException('Test','QuotaExceededError');return window.originalSet.call(this,key,value)}});await page.keyboard.press('ArrowRight');assert.deepEqual(await saved(),beforeFailure);assert.match(await page.locator('#layout-status').textContent(),/nicht gespeichert/);assert(await page.locator('#layout-feedback').isVisible());await page.evaluate(()=>Storage.prototype.setItem=window.originalSet);
 await page.locator('#finish-widget-layout').click();await page.locator('summary').click();await page.locator('#reset-widget-layout').click();assert.equal(await page.locator('.layout-frame').count(),0);assert.equal(await saved(),null);await second.waitForFunction(()=>!document.body.classList.contains('layout-free'));await second.close();
 assert.equal(await page.locator('#task-list li').count(),12);for(const name of ['tasks','greeting','clock','goal','links'])assert.equal(await page.locator('#size-'+name).inputValue(),'150');assert.match(await page.locator('#greeting').innerText(),/Alex/);assert.equal(await page.locator('#goal-input').inputValue(),'Ein Ziel');assert.equal(await page.locator('#shortcut-list a').count(),1);
 await page.locator('#reset-widget-sizes').click();await page.locator('#close-appearance').click();
 // Corrupt position data must never create arbitrary CSS or hide the recovery controls.
 await page.evaluate(key=>localStorage.setItem(key,'{"version":1,"positions":{"clock":{"x":"bad","y":0}}}'),KEY);await page.reload();assert.equal(await page.locator('.layout-frame').count(),0);assert.match(await page.locator('#layout-status').textContent(),/nicht gelesen/);await page.locator('summary').click();await page.locator('#reset-widget-layout').click();await page.locator('#close-appearance').click();
 // Reset keeps the actual user content, including changes made while in free layout.
 assert.equal(await page.locator('#task-list li').count(),12);assert.equal(JSON.parse(appState).name,'Alex');
 await edit();await context.setOffline(true);await handle('clock').focus();await page.keyboard.press('ArrowRight');assert(await saved());await context.setOffline(false);await page.locator('#finish-widget-layout').click();
 await page.screenshot({path:path.join(artifacts,'free-layout.png'),fullPage:true});await edit();await page.screenshot({path:path.join(artifacts,'editing.png'),fullPage:true});await page.setViewportSize({width:390,height:844});await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));assert(await bounded());await page.screenshot({path:path.join(artifacts,'mobile.png'),fullPage:true});
 const touch=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
 await touch.addInitScript(()=>localStorage.setItem('ruhe-tab-widget-layout-v1',JSON.stringify({version:1,positions:Object.fromEntries(['clock','greeting','goal','tasks','links'].map(name=>[name,{x:0,y:0}]))})));
 const mobile=await touch.newPage();await mobile.goto(url);await mobile.waitForFunction(()=>document.querySelectorAll('.layout-frame').length===6);await edit(mobile);await handle('tasks',mobile).focus();const grip=await handle('tasks',mobile).boundingBox();const cdp=await touch.newCDPSession(mobile);const point={x:grip.x+25,y:grip.y+15};
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:point.x+20,y:point.y+50}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});const touchState=await saved(mobile);assert(touchState.positions.tasks.x>0&&touchState.positions.tasks.y>0);assert(await bounded(mobile));await touch.close();
 await page.bringToFront();await page.evaluate(()=>{window.layoutFrames=0;const fn=requestAnimationFrame;window.requestAnimationFrame=(...args)=>{window.layoutFrames++;return fn(...args)}});await page.waitForTimeout(100);const idleCount=await page.evaluate(()=>window.layoutFrames);await page.waitForTimeout(250);assert.equal(await page.evaluate(()=>window.layoutFrames),idleCount,'No continuously running animation loop');
 assert.deepEqual(external,[]);assert.deepEqual(errors,[]);
 const results=['Six widgets move independently using real pointer events and keyboard controls.','Dragging previews without writes; Escape cancels; dropping persists; edit mode ends without moving content.','Stored layout survives reload; ordinary tasks, text fields and links remain usable.','All frames stay within the workspace across 320–1440px windows, size changes and growing task content.','Window resizing does not overwrite saved positions.','Cross-tab changes and reset are applied; reset preserves sizes, tasks, greeting, goal and links.','Failed writes and corrupt layout records recover without false success.','Touch dragging works; layout schedules no continuous animation loop while idle.','Offline operation, no external requests and no unhandled page errors.'];console.log(JSON.stringify({results,artifacts},null,2));fs.writeFileSync(path.join(artifacts,'results.json'),JSON.stringify(results,null,2));
 }finally{await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});

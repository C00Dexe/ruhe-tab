// UI integration test in Chromium, with a test-only browser.storage.local adapter.
// It does not replace the still-required native Firefox installation test.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const root=path.resolve(__dirname,'../ruhe-tab-firefox');
(async()=>{
 const policy=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'))).content_security_policy.extension_pages;
 const server=http.createServer((req,res)=>{
  const name=req.url.slice(1)||'index.html';
  if(!['index.html','style.css','app.mjs','model.mjs','storage.mjs'].includes(name)){res.writeHead(404);res.end();return;}
  res.writeHead(200,{'Content-Security-Policy':policy,'Content-Type':name.endsWith('.html')?'text/html':name.endsWith('.css')?'text/css':'text/javascript'});
  res.end(fs.readFileSync(path.join(root,name)));
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/lib/chromium/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-crashpad','--no-zygote']});
 try{
  const context=await browser.newContext({viewport:{width:1360,height:900}});
  await context.addInitScript(()=>{
   const listeners=[];
   const read=()=>JSON.parse(localStorage.getItem('__firefox_mock__')||'{}');
   const notify=changes=>listeners.forEach(fn=>fn(changes,'local'));
   window.browser={storage:{local:{async get(){return read()},async set(values){const s=read(),changes={};for(const [key,value]of Object.entries(values)){changes[key]={oldValue:s[key],newValue:value};s[key]=value}localStorage.setItem('__firefox_mock__',JSON.stringify(s));notify(changes)},async remove(key){const s=read(),changes={[key]:{oldValue:s[key]}};delete s[key];localStorage.setItem('__firefox_mock__',JSON.stringify(s));notify(changes)}},onChanged:{addListener(fn){listeners.push(fn)}}}};
   window.addEventListener('storage',event=>{if(event.key==='__firefox_mock__'){const a=JSON.parse(event.oldValue||'{}'),b=JSON.parse(event.newValue||'{}'),changes={};for(const key of new Set([...Object.keys(a),...Object.keys(b)]))if(JSON.stringify(a[key])!==JSON.stringify(b[key]))changes[key]={oldValue:a[key],newValue:b[key]};notify(changes)}});
  });
  const page=await context.newPage(),errors=[],external=[];
  page.on('pageerror',e=>errors.push(e.message));
  context.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith('http://127.0.0.1:'))external.push(r.url())});
  const url=`http://127.0.0.1:${server.address().port}/index.html`;
  await page.goto(url);await page.waitForFunction(()=>!document.getElementById('content').inert);
  assert.match(await page.locator('#clock').innerText(),/^\d{2}:\d{2}$/);
  const box=await page.locator('main').boundingBox();await page.locator('summary').click();assert.deepEqual(await page.locator('main').boundingBox(),box);
  await page.locator('#name-input').fill('Alex');await page.locator('#name-form button').click();await page.waitForFunction(()=>document.getElementById('greeting').textContent.includes('Alex'));
  await page.locator('#goal-input').fill('Firefox neu bauen');await page.locator('#goal-form button').click();await page.locator('#goal-check').check();
  await page.locator('#task-input').fill('Ein Buch lesen');await page.locator('#task-form button').click();await page.locator('#task-list input').check();
  await page.locator('#add-link').click();await page.locator('#link-name').fill('Wikipedia');await page.locator('#link-url').fill('de.wikipedia.org');await page.locator('#link-form [type=submit]').click();
  await page.waitForFunction(()=>document.querySelectorAll('#link-list a').length===1);
  assert.equal(await page.locator('#link-list a').getAttribute('href'),'https://de.wikipedia.org/');
  await page.reload();await page.waitForFunction(()=>!document.getElementById('content').inert);
  assert.match(await page.locator('#greeting').innerText(),/Alex/);assert.equal(await page.locator('#goal-input').inputValue(),'Firefox neu bauen');assert(await page.locator('#goal-check').isChecked());assert(await page.locator('#task-list input').isChecked());assert.equal(await page.locator('#link-list a').count(),1);
  const second=await context.newPage();await second.goto(url);await second.waitForFunction(()=>!document.getElementById('content').inert);
  await second.locator('#task-input').fill('Zweiter Tab');await second.locator('#task-form button').click();await page.waitForFunction(()=>document.querySelectorAll('#task-list li').length===2);
  // An unrelated update must not erase the unfinished goal draft.
  await page.locator('#goal-input').fill('Noch nicht gespeichert');await second.locator('#add-link').click();await second.locator('#link-name').fill('GitHub');await second.locator('#link-url').fill('github.com');await second.locator('#link-form [type=submit]').click();await page.waitForFunction(()=>document.querySelectorAll('#link-list a').length===2);assert.equal(await page.locator('#goal-input').inputValue(),'Noch nicht gespeichert');await second.close();
  await page.locator('#task-list button').first().click();await page.waitForFunction(()=>document.querySelectorAll('#task-list li').length===1);
  await page.locator('#edit-links').click();await page.locator('#link-list button').last().click();await page.waitForFunction(()=>document.querySelectorAll('#link-list a').length===1);await page.locator('#edit-links').click();
  await page.locator('#add-link').click();await page.locator('#link-name').fill('Unsicher');await page.locator('#link-url').fill('javascript:alert(1)');await page.locator('#link-form [type=submit]').click();assert(await page.locator('#link-dialog').isVisible());assert.match(await page.locator('#link-error').innerText(),/gültige/);await page.keyboard.press('Escape');
  await context.setOffline(true);await page.locator('#task-input').fill('Offline');await page.locator('#task-form button').click();await page.waitForFunction(()=>document.querySelectorAll('#task-list li').length===2);await context.setOffline(false);
  assert.deepEqual(external,[]);assert.deepEqual(errors,[]);
  await page.locator('h1').click();await page.screenshot({path:path.resolve(__dirname,'../desktop-test.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.resolve(__dirname,'../mobile-test.png'),fullPage:true});
  await page.evaluate(async()=>{
    const old=await browser.storage.local.get(null),values={};
    const taskCount=Object.keys(old).filter(k=>k.startsWith('ruhe2.task.')).length;
    const linkCount=Object.keys(old).filter(k=>k.startsWith('ruhe2.link.')).length;
    for(let i=taskCount;i<50;i++)values['ruhe2.task.limit-'+i]={text:'Grenze '+i,done:false,order:i};
    for(let i=linkCount;i<12;i++)values['ruhe2.link.limit-'+i]={name:'Seite '+i,url:'https://example.org/'+i,order:i};
    await browser.storage.local.set(values);
  });
  await page.waitForFunction(()=>document.querySelectorAll('#task-list li').length===50 && document.querySelectorAll('#link-list li').length===12);
  assert(await page.locator('#task-input').isDisabled());assert(await page.locator('#add-link').isHidden());
  await page.locator('#task-list button').first().click();await page.waitForFunction(()=>!document.getElementById('task-input').disabled);
  await page.locator('#edit-links').click();await page.locator('#link-list button').first().click();await page.waitForFunction(()=>!document.getElementById('add-link').hidden);
  await page.locator('summary').click();await page.keyboard.press('Escape');assert.equal(await page.locator('#settings').getAttribute('open'),null);
  await page.evaluate(()=>{browser.storage.local.set=async()=>{throw Error('simulated storage failure')}});
  await page.locator('#goal-input').fill('Nicht gespeichert');await page.locator('#goal-form button').click();
  await page.waitForFunction(()=>document.getElementById('status').textContent.includes('fehlgeschlagen'));
  assert.equal(await page.locator('#goal-input').inputValue(),'Nicht gespeichert');
  console.log('PASS: Grenzen 50/12, Löschen gibt Platz frei, Escape schließt Einstellungen, Speicherfehler bleibt sichtbar und erhält Eingabe.');
  console.log('PASS: UI, Speichern/Neuladen, Aufgaben, Links, Dialogvalidierung, zwei Tabs, ungespeicherte Entwürfe, Offline-Bedienung, 390px, keine externen Anfragen oder Laufzeitfehler.');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1});

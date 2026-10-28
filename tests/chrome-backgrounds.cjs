// Browser integration tests for real IndexedDB; requires Playwright and Chromium.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const os=require('node:os');
const root=path.resolve(__dirname,'../ruhe-tab');
const artifacts=fs.mkdtempSync(path.join(os.tmpdir(),'ruhe-tab-background-tests-'));
const results=[];
async function record(page){return page.evaluate(()=>new Promise((resolve,reject)=>{const r=indexedDB.open('ruhe-tab-backgrounds',1);r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,tx=db.transaction('appearance','readonly');let value;const q=tx.objectStore('appearance').get('current');q.onsuccess=()=>{const v=q.result;value=v.kind==='image'?{kind:v.kind,width:v.width,height:v.height,type:v.blob.type,size:v.blob.size,isBlob:v.blob instanceof Blob}:v};tx.oncomplete=()=>{db.close();resolve(value)};tx.onabort=()=>reject(tx.error)}}))}
(async()=>{
 const manifest=JSON.parse(fs.readFileSync(root+'/manifest.json'));
 const server=http.createServer((req,res)=>{const name=req.url.slice(1);if(!['newtab.html','newtab.js','appearance.js','styles.css'].includes(name)){res.writeHead(404);res.end();return}res.writeHead(200,{'Content-Type':name.endsWith('.html')?'text/html':name.endsWith('.css')?'text/css':'text/javascript','Content-Security-Policy':manifest.content_security_policy.extension_pages});res.end(fs.readFileSync(root+'/'+name))});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||chromium.executablePath(),headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-crashpad','--no-zygote']});
 try{
 const context=await browser.newContext({viewport:{width:1360,height:900}});
 const errors=[],external=[];
 context.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
 context.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith('http://127.0.0.1:'))external.push(r.url())});
 const page=await context.newPage();
 const url=`http://127.0.0.1:${server.address().port}/newtab.html`;
 await page.goto(url);await page.waitForFunction(()=>document.body.dataset.background==='forest');
 await context.addInitScript(()=>{window.bitmapsDecoded=0;const fn=window.createImageBitmap;window.createImageBitmap=(...args)=>{window.bitmapsDecoded++;return fn(...args)}});
 await page.reload();await page.waitForFunction(()=>document.body.dataset.background==='forest');
 const customize=page.locator('#personalization summary');
 async function theme(name){await page.locator('button[data-background="'+name+'"]').click();await page.waitForFunction(kind=>document.body.dataset.background===kind,name)}
 await customize.click();await theme('night');await page.reload();await page.waitForFunction(()=>document.body.dataset.background==='night');await customize.click();
 assert.deepEqual(await record(page),{kind:'night'});
 results.push('Farbverläufe bleiben nach Neuladen erhalten; Einstellungen werden in IndexedDB gespeichert.');
 async function image(width,height,noisy=false){const data=await page.evaluate(({width,height,noisy})=>{const c=document.createElement('canvas');c.width=width;c.height=height;const ctx=c.getContext('2d');if(noisy){const pixels=ctx.createImageData(width,height);let seed=123;for(let i=0;i<pixels.data.length;i+=4){seed=(1664525*seed+1013904223)>>>0;pixels.data[i]=seed&255;pixels.data[i+1]=(seed>>>8)&255;pixels.data[i+2]=(seed>>>16)&255;pixels.data[i+3]=255}ctx.putImageData(pixels,0,0)}else{ctx.fillStyle='#315078';ctx.fillRect(0,0,width,height)}return c.toDataURL('image/png')},{width,height,noisy});return Buffer.from(data.split(',')[1],'base64')}
 async function upload(buffer,name='bild.png',mimeType='image/png'){await page.locator('#background-file').setInputFiles({name,mimeType,buffer});await page.waitForFunction(()=>/gespeichert|Bitte wähle|konnte|viele Pixel/.test(document.getElementById('appearance-status').textContent))}
 const large=await image(1800,1000,true);assert(large.length>1024*1024 && large.length<10*1024*1024);
 await upload(large);assert.equal((await record(page)).kind,'image');assert.equal((await record(page)).isBlob,true);assert.equal((await record(page)).type,'image/webp');assert.equal((await record(page)).width,1800);assert.equal((await record(page)).height,1000);
 assert.match(await page.locator('body').getAttribute('style'),/blob:/);
 assert.equal(await page.evaluate(()=>localStorage.getItem('ruhe-tab-appearance-v1')),null);
 await upload(await image(4000,2000));let current=await record(page);assert.equal(current.width,2560);assert.equal(current.height,1280);
 results.push('Gültige PNG-Datei über 1 MB wird angenommen und als WebP-Blob gespeichert. 4000 × 2000 Pixel werden proportional auf 2560 × 1280 Pixel verkleinert.');
 await upload(await image(1000,3000));current=await record(page);assert.equal(current.width,480);assert.equal(current.height,1440);
 await upload(await image(80,40));current=await record(page);assert.equal(current.width,80);assert.equal(current.height,40);
 results.push('Hochformat bleibt proportional; kleine Bilder werden nicht vergrößert.');
 await page.reload();await page.waitForFunction(()=>document.body.dataset.background==='image');assert.equal(await page.evaluate(()=>window.bitmapsDecoded),0);assert.deepEqual(await record(page),current);
 await customize.click();
 results.push('Neuladen liest nur das vorbereitete Bild: keine erneute Größenanpassung oder Kodierung.');
 await upload(Buffer.alloc(10*1024*1024+1));assert.match(await page.locator('#appearance-status').innerText(),/höchstens 10 MB/);assert.deepEqual(await record(page),current);
 await upload(Buffer.from('<svg/>'),'falsch.svg','image/svg+xml');assert.match(await page.locator('#appearance-status').innerText(),/Bitte wähle/);
 await upload(Buffer.from('kaputt'));assert.match(await page.locator('#appearance-status').innerText(),/nicht gelesen/);assert.deepEqual(await record(page),current);
 results.push('Dateien über 10 MB, SVG und beschädigte Bilder werden abgewiesen; das bisherige Bild bleibt gespeichert.');
 await page.evaluate(()=>{window.originalPut=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(...args){const r=window.originalPut.apply(this,args);this.transaction.abort();return r}});
 await page.locator('button[data-background="slate"]').click();await page.waitForFunction(()=>document.getElementById('appearance-status').textContent.includes('nicht gespeichert'));assert.deepEqual(await record(page),current);assert.equal(await page.locator('body').getAttribute('data-background'),'image');
 await page.evaluate(()=>{IDBObjectStore.prototype.put=window.originalPut});
 results.push('Abgebrochene IndexedDB-Transaktion bestätigt keinen Erfolg und erhält das bisherige Bild.');
 const second=await context.newPage();await second.goto(url);await second.waitForFunction(()=>document.body.dataset.background==='image');
 await page.locator('button[data-background="slate"]').click();await page.waitForFunction(()=>document.body.dataset.background==='slate');await second.waitForFunction(()=>document.body.dataset.background==='slate');assert.deepEqual(await record(page),{kind:'slate'});await second.close();
 assert.equal(await page.locator('body').evaluate(el=>el.style.getPropertyValue('--user-image')),'');
 results.push('Andere Tabs übernehmen Änderungen. Wechsel zum Farbverlauf ersetzt den gespeicherten Blob und entfernt die Bild-URL.');
 // A newer preset must win over an earlier image job that has not finished decoding yet.
 await page.evaluate(()=>{const original=window.createImageBitmap;window.createImageBitmap=async(...args)=>{await new Promise(r=>setTimeout(r,300));return original(...args)}});
 await page.locator('#background-file').setInputFiles({name:'pending.png',mimeType:'image/png',buffer:await image(800,600)});await theme('night');await page.waitForTimeout(500);assert.deepEqual(await record(page),{kind:'night'});
 results.push('Eine neuere Hintergrundauswahl gewinnt gegen eine noch laufende Bildverarbeitung.');
 await context.setOffline(true);await theme('forest');assert.equal((await record(page)).kind,'forest');await context.setOffline(false);
 assert.deepEqual(external,[]);assert.deepEqual(errors,[]);
 await page.locator('#close-appearance').click();await page.screenshot({path:path.join(artifacts,'desktop.png'),fullPage:true});
 await page.setViewportSize({width:390,height:844});await customize.click();const box=await page.locator('.settings-panel').boundingBox();assert(box.x>=0 && box.x+box.width<=390 && box.y>=0 && box.y+box.height<=844);
 await page.screenshot({path:path.join(artifacts,'mobile.png'),fullPage:true});
 results.push('Offline-Bedienung und schmale Ansicht erfolgreich; keine externen Anfragen oder unbehandelten JavaScript-Fehler.');
 const legacyBuffer=await image(40,40);
 const migration=await browser.newContext();
 await migration.addInitScript(data=>{localStorage.setItem('ruhe-tab-appearance-v1',JSON.stringify({kind:'image',data}));localStorage.setItem('ruhe-tab-v1',JSON.stringify({name:'Alt',day:'2000-01-01',tasks:[{text:'Bleibt',done:false}],shortcuts:[]}))},'data:image/png;base64,'+legacyBuffer.toString('base64'));
 const oldPage=await migration.newPage();await oldPage.goto(url);await oldPage.waitForFunction(()=>document.body.dataset.background==='image');
 assert.equal((await record(oldPage)).width,40);assert.equal(await oldPage.evaluate(()=>localStorage.getItem('ruhe-tab-appearance-v1')),null);assert.match(await oldPage.locator('#greeting').innerText(),/Alt/);assert.equal(await oldPage.locator('#task-list li').count(),1);
 await migration.close();results.push('Vorhandenes Base64-Bild aus Version 1.2 wird nach erfolgreicher IndexedDB-Übernahme entfernt; Name und Aufgaben bleiben erhalten.');
 const failure=await browser.newContext();await failure.addInitScript(()=>{indexedDB.open=()=>{throw new DOMException('Test','SecurityError')}});const failed=await failure.newPage();await failed.goto(url);await failed.waitForFunction(()=>document.getElementById('appearance-status').textContent.includes('nicht verfügbar'));await failure.close();
 results.push('Nicht verfügbarer Datenbankspeicher wird sichtbar gemeldet, ohne Erfolg vorzutäuschen.');
 console.log(JSON.stringify(results,null,2));fs.writeFileSync(path.join(artifacts,'results.json'),JSON.stringify(results,null,2));
 }finally{await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});

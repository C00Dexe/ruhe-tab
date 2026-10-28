import test from 'node:test';
import assert from 'node:assert/strict';
import {PREFIX,dayKey,webUrl,decode,migrate} from '../ruhe-tab-firefox/model.mjs';
import {createStore} from '../ruhe-tab-firefox/storage.mjs';
function fakeApi(initial={}) {
  const records=structuredClone(initial);
  return {records,async get(){return structuredClone(records)},async set(values){Object.assign(records,structuredClone(values))},async remove(key){delete records[key]}};
}
test('Lokales Datum und Tageswechsel ohne Aufgabenverlust',()=>{
 assert.equal(dayKey(new Date(2026,9,28,0,5)),'2026-10-28');
 const records=migrate(JSON.stringify({name:' Alex ',day:'2026-10-27',goal:'Alt',goalDone:true,tasks:[{text:'Bleibt',done:false}]}));
 const state=decode(records,'2026-10-28');
 assert.equal(state.name,'Alex');assert.equal(state.goal,'');assert.equal(state.goalDone,false);assert.equal(state.tasks[0].text,'Bleibt');
});
test('Nur gültige HTTP(S)-Ziele, ohne Zugangsdaten, Leerzeichen oder Backslashes',()=>{
 assert.equal(webUrl('example.org'),'https://example.org/');
 assert.equal(webUrl('example.org:8080/path'),'https://example.org:8080/path');
 assert.equal(webUrl('http://localhost:8000/'),'http://localhost:8000/');
 for(const value of ['javascript:alert(1)','data:text/html,test','file:///etc/passwd','ftp://example.org','https://a:b@example.org','https://ex ample.org','https:\\example.org','', 'x'.repeat(2049)]) assert.equal(webUrl(value),null,value);
});
test('Alte Daten werden einmal übernommen und bleiben unangetastet',async()=>{
 const raw=JSON.stringify({name:'Alex',day:'2026-10-28',goal:'Test',goalDone:true,tasks:[{text:'Lesen',done:true}],shortcuts:[{name:'Wiki',url:'de.wikipedia.org'}]});
 const api=fakeApi(),store=createStore(api);
 await store.initialize(()=>raw);
 let state=await store.read('2026-10-28');
 assert.equal(state.name,'Alex');assert.equal(state.goalDone,true);assert.equal(state.tasks.length,1);assert.equal(state.links[0].url,'https://de.wikipedia.org/');
 await store.name('Neu');await store.initialize(()=>raw);state=await store.read('2026-10-28');assert.equal(state.name,'Neu');
});
test('Beschädigte Altdaten werden weder überschrieben noch als erfolgreich migriert markiert',async()=>{
 const api=fakeApi(),store=createStore(api);
 await assert.rejects(store.initialize(()=>'{kaputt'));
 assert.deepEqual(api.records,{});
});
test('Zwei Tabs schreiben unterschiedliche Aufgaben unabhängig voneinander',async()=>{
 const api=fakeApi(),a=createStore(api),b=createStore(api);
 await a.initialize(()=>null);
 await Promise.all([a.put('task','id-a',{text:'A',done:false,order:1}),b.put('task','id-b',{text:'B',done:false,order:2})]);
 await a.name('Alex');await b.goal('2026-10-28','Ziel',true);
 await a.put('task','id-a',{text:'A',done:true,order:1});
 let s=await b.read('2026-10-28');assert.equal(s.tasks.length,2);assert.equal(s.tasks[0].done,true);assert.equal(s.name,'Alex');assert.equal(s.goal,'Ziel');
 await b.remove('task','id-b');s=await a.read();assert.equal(s.tasks.length,1);
});
test('Fehlgeschlagene Firefox-Speicherung wird nicht als Erfolg gemeldet',async()=>{
 const api=fakeApi();api.set=async()=>{throw Error('quota')};
 const store=createStore(api);await assert.rejects(store.name('Alex'),/quota/);
});
test('Schadhafte Speicherschlüssel und defekte Einträge werden abgefangen',async()=>{
 const api=fakeApi(),store=createStore(api);await assert.rejects(store.put('evil','id',{}));await assert.rejects(store.remove('task','../id'));
 const s=decode({[PREFIX+'task.good']:{text:'<img onerror=alert(1)>',done:'yes',order:0},[PREFIX+'link.bad']:{name:'X',url:'javascript:alert(1)'},[PREFIX+'goal']:{day:'2026-10-28',text:'',done:true}},'2026-10-28');
 assert.equal(s.tasks[0].text,'<img onerror=alert(1)>');assert.equal(s.tasks[0].done,false);assert.equal(s.links.length,0);assert.equal(s.goalDone,false);
});

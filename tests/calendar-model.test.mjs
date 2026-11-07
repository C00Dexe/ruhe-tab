import test from 'node:test';
import assert from 'node:assert/strict';
import {parseDay,civilDate,monthRows,shiftDay,shiftMonth,normalizeEvent,upcoming,sortEvents,localDay} from '../ruhe-tab/calendar-model.mjs';
test('Gültige bürgerliche Daten einschließlich Schaltjahren',()=>{
 for(const value of ['2024-02-29','2000-02-29','0001-01-01','9999-12-31'])assert(parseDay(value));
 for(const value of ['2025-02-29','1900-02-29','2026-04-31','2026-00-12','0000-01-01','2026-1-01','2026-11-07T00:00:00Z'])assert.equal(parseDay(value),null);
 assert.equal(civilDate('0001-01-01').getUTCFullYear(),1);
});
test('Montag als Wochenanfang, passende Monatslänge',()=>{
 const feb=monthRows('2024-02-10');assert.equal(feb[0][0],null);assert.equal(feb[0][3],'2024-02-01');assert.equal(feb.flat().filter(Boolean).length,29);assert(feb.every(row=>row.length===7));
 const march=monthRows('2021-03-01');assert.equal(march[0][0],'2021-03-01');
});
test('Tages- und Monatsnavigation über Jahresgrenzen ohne Datumsüberlauf',()=>{
 assert.equal(shiftDay('2026-12-31',1),'2027-01-01');assert.equal(shiftDay('2024-03-01',-1),'2024-02-29');assert.equal(shiftDay('0001-01-01',-1),'0001-01-01');assert.equal(shiftDay('9999-12-31',1),'9999-12-31');
 assert.equal(shiftMonth('2025-01-31',1),'2025-02-28');assert.equal(shiftMonth('2024-01-31',1),'2024-02-29');assert.equal(shiftMonth('2026-12-10',1),'2027-01-10');assert.equal(shiftMonth('0001-01-01',-1),'0001-01-01');
});
test('Terminprüfung für Titel, Datum und optionale Uhrzeit',()=>{
 const event={id:'id-1',title:'  Treffen  ',date:'2026-11-07',time:''};assert.equal(normalizeEvent(event).title,'Treffen');assert(normalizeEvent({...event,time:'23:59'}));
 for(const time of ['24:00','9:00','12:60','no'])assert.equal(normalizeEvent({...event,time}),null);
 assert.equal(normalizeEvent({...event,title:'  '}),null);assert.equal(normalizeEvent({...event,date:'2026-02-30'}),null);assert.equal(normalizeEvent({...event,id:'../bad'}),null);
 assert.equal(normalizeEvent({...event,title:'<script>x</script>'}).title,'<script>x</script>');
});
test('Chronologische Reihenfolge, ganztägige Termine zuerst',()=>{
 const events=[{id:'b',title:'B',date:'2026-11-08',time:''},{id:'a',title:'A',date:'2026-11-07',time:'12:00'},{id:'c',title:'C',date:'2026-11-07',time:''}];
 assert.deepEqual(sortEvents(events).map(e=>e.id),['c','a','b']);assert.equal(events[0].id,'b');
});
test('Nächste Termine nach lokaler Zeit, ganztägig bleibt heute sichtbar',()=>{
 const now=new Date(2026,10,7,12,30),date=localDay(now);
 const events=[{id:'past',title:'A',date,time:'12:29'},{id:'now',title:'B',date,time:'12:30'},{id:'all',title:'C',date,time:''},{id:'later',title:'D',date:'2026-11-08',time:''},{id:'old',title:'E',date:'2026-11-06',time:''}];
 assert.deepEqual(upcoming(events,now).map(e=>e.id),['all','now','later']);
});

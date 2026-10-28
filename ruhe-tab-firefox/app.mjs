import {PREFIX, MAX_TASKS, MAX_LINKS, text, dayKey, webUrl} from './model.mjs';
import {createStore} from './storage.mjs';

const $ = id => document.getElementById(id);
const store = createStore(browser.storage.local);
const timeFormat = new Intl.DateTimeFormat('de-DE',{hour:'2-digit',minute:'2-digit'});
const dateFormat = new Intl.DateTimeFormat('de-DE',{weekday:'long',day:'numeric',month:'long'});
const dirty = new Set();
let state = {name:'',goal:'',goalDone:false,tasks:[],links:[]};
let editing = false, timer, currentDay = dayKey(), readVersion = 0;
const status = message => { $('status').textContent = message; };
const failure = error => { console.error('Ruhe Tab:', error); status('Speichern oder Laden fehlgeschlagen. Deine letzten Eingaben wurden nicht bestätigt. Bitte erneut versuchen.'); };

function greet(now = new Date()) {
  const hour = now.getHours();
  const greeting = hour < 5 ? 'Gute Nacht' : hour < 11 ? 'Guten Morgen' : hour < 18 ? 'Guten Tag' : 'Guten Abend';
  $('greeting').textContent = greeting + (state.name ? ', '+state.name : '') + '.';
}
function clock() {
  clearTimeout(timer);
  if (document.hidden) return;
  const now = new Date();
  $('clock').textContent = timeFormat.format(now);
  $('clock').dateTime = now.toISOString();
  $('date').textContent = dateFormat.format(now);
  greet(now);
  if (currentDay !== dayKey(now)) {
    currentDay = dayKey(now);
    dirty.delete('goal-input');
    sync().catch(failure);
  }
  timer = setTimeout(clock,60000-Date.now()%60000);
}
async function sync() {
  const revision = ++readVersion;
  const fresh = await store.read();
  if (revision !== readVersion) return;
  state = fresh;
  render();
}
async function action(button, operation, success) {
  if (button.disabled) return;
  button.disabled = true;
  try { await operation(); await sync(); status(success); }
  catch (error) { failure(error); }
  finally { button.disabled = false; }
}
function preserveFocus(list, build, fallback) {
  const active = list.contains(document.activeElement) ? document.activeElement.dataset.focus : null;
  list.replaceChildren();
  build();
  if (active) {
    const next = Array.from(list.querySelectorAll('[data-focus]')).find(el=>el.dataset.focus===active);
    (next || fallback()).focus();
  }
}
function goalAppearance() {
  const draft = dirty.has('goal-input') && text($('goal-input').value,160)!==state.goal;
  $('goal-input').classList.toggle('completed',state.goalDone && !draft);
  $('goal-check-label').hidden = !state.goal || draft;
  $('goal-check').checked = state.goalDone;
}
function render() {
  greet();
  if (!dirty.has('name-input')) $('name-input').value = state.name;
  if (!dirty.has('goal-input')) $('goal-input').value = state.goal;
  goalAppearance();
  $('task-input').disabled=state.tasks.length>=MAX_TASKS;
  preserveFocus($('task-list'),()=>{
    for (const task of state.tasks) {
      const li = document.createElement('li');
      const label = document.createElement('label');
      const check = document.createElement('input');
      check.type='checkbox'; check.checked=task.done; check.dataset.focus='check-'+task.id;
      const span = document.createElement('span'); span.textContent=task.text;
      check.addEventListener('change', async()=>{
        const done = check.checked;
        check.disabled=true;
        try { await store.put('task',task.id,{text:task.text,order:task.order,done}); await sync(); status(''); }
        catch(error) { failure(error); check.checked=task.done; }
        finally { check.disabled=false; }
      });
      const remove = document.createElement('button');
      remove.type='button'; remove.textContent='×'; remove.dataset.focus='delete-'+task.id;
      remove.setAttribute('aria-label','Aufgabe löschen: '+task.text);
      remove.addEventListener('click',()=>action(remove,()=>store.remove('task',task.id),'Aufgabe gelöscht.'));
      label.append(check,span); li.append(label,remove); $('task-list').append(li);
    }
  },()=>$('task-input'));
  $('task-count').textContent=state.tasks.filter(task=>!task.done).length+' offen';
  $('task-empty').hidden=state.tasks.length>0;
  $('task-limit').hidden=state.tasks.length<MAX_TASKS;
  $('task-input').disabled=state.tasks.length>=MAX_TASKS;
  if (!state.links.length) editing=false;
  $('edit-links').hidden=!state.links.length;
  $('edit-links').textContent=editing?'Fertig':'Bearbeiten';
  $('edit-links').setAttribute('aria-pressed',String(editing));
  $('add-link').hidden=state.links.length>=MAX_LINKS;
  $('link-limit').hidden=state.links.length<MAX_LINKS;
  preserveFocus($('link-list'),()=>{
    for(const link of state.links) {
      const li=document.createElement('li'), a=document.createElement('a');
      a.href=link.url; a.rel='noreferrer noopener'; a.referrerPolicy='no-referrer'; a.title=link.name+' – '+link.url;
      a.dataset.focus='link-'+link.id;
      const icon=document.createElement('span'); icon.className='link-icon'; icon.textContent=Array.from(link.name)[0].toLocaleUpperCase('de-DE'); icon.setAttribute('aria-hidden','true');
      const label=document.createElement('span'); label.className='link-label'; label.textContent=link.name;
      a.append(icon,label);
      const remove=document.createElement('button'); remove.type='button'; remove.textContent='×'; remove.className='remove-link'; remove.hidden=!editing; remove.dataset.focus='remove-'+link.id;
      remove.setAttribute('aria-label','Verknüpfung löschen: '+link.name);
      remove.addEventListener('click',()=>action(remove,()=>store.remove('link',link.id),'Verknüpfung gelöscht.'));
      li.append(a,remove); $('link-list').append(li);
    }
  },()=>$('edit-links').hidden ? $('add-link') : $('edit-links'));
}
for(const id of ['name-input','goal-input']) $(id).addEventListener('input',()=>{ dirty.add(id); if(id==='goal-input') goalAppearance(); });
$('name-form').addEventListener('submit',event=>{
  event.preventDefault();
  const value=text($('name-input').value,40);
  action(event.submitter || $('name-form').querySelector('button'),async()=>{
    await store.name(value); if(text($('name-input').value,40)===value) dirty.delete('name-input'); $('settings').open=false; $('settings').querySelector('summary').focus();
  },'Name gespeichert.');
});
$('goal-form').addEventListener('submit',event=>{
  event.preventDefault();
  const value=text($('goal-input').value,160), day=dayKey();
  action(event.submitter || $('goal-form').querySelector('button'),async()=>{
    const latest=await store.read(day);
    await store.goal(day,value,value===latest.goal && latest.goalDone); if(text($('goal-input').value,160)===value) dirty.delete('goal-input');
  },'Tagesziel gespeichert.');
});
$('goal-check').addEventListener('change',async()=>{
  const check=$('goal-check'), done=check.checked;
  check.disabled=true;
  try {
    const day=dayKey(), latest=await store.read(day);
    if(latest.goal) await store.goal(day,latest.goal,done);
    await sync(); status('');
  } catch(error) { failure(error); check.checked=state.goalDone; }
  finally { check.disabled=false; }
});
$('task-form').addEventListener('submit',event=>{
  event.preventDefault();
  const value=text($('task-input').value,160);
  if(!value) { status('Bitte gib einen Aufgabentext ein.'); return; }
  action(event.submitter || $('task-form').querySelector('button'),async()=>{
    if((await store.read()).tasks.length>=MAX_TASKS) throw Error('Aufgabenliste voll');
    await store.put('task',crypto.randomUUID(),{text:value,done:false,order:Date.now()}); if(text($('task-input').value,160)===value) $('task-input').value='';
  },'Aufgabe gespeichert.');
});
$('edit-links').addEventListener('click',()=>{ editing=!editing; render(); });
$('add-link').addEventListener('click',()=>{ $('link-form').reset(); $('link-error').textContent=''; $('link-dialog').showModal(); });
$('cancel-link').addEventListener('click',()=>$('link-dialog').close());
$('link-form').addEventListener('submit',event=>{
  event.preventDefault();
  const name=text($('link-name').value,32), url=webUrl($('link-url').value);
  if(!name || !url) { $('link-error').textContent='Bitte gib einen Namen und eine gültige HTTP(S)-Adresse ohne Zugangsdaten oder Leerzeichen ein.'; return; }
  const button=event.submitter || $('link-form').querySelector('[type=submit]');
  action(button,async()=>{
    if((await store.read()).links.length>=MAX_LINKS) throw Error('Verknüpfungsliste voll');
    await store.put('link',crypto.randomUUID(),{name,url,order:Date.now()}); $('link-dialog').close();
  },'Verknüpfung gespeichert.');
});
document.addEventListener('click',event=>{ if(!$('settings').contains(event.target)) $('settings').open=false; });
document.addEventListener('keydown',event=>{ if(event.key==='Escape' && $('settings').open) { $('settings').open=false; $('settings').querySelector('summary').focus(); } });
document.addEventListener('visibilitychange',clock);
window.addEventListener('pagehide',()=>clearTimeout(timer));
window.addEventListener('pageshow',clock);
$('retry').addEventListener('click',()=>location.reload());
clock();
try {
  await store.initialize(()=>localStorage.getItem('ruhe-tab-v1'));
  browser.storage.onChanged.addListener((changes,area)=>{
    if(area==='local' && Object.keys(changes).some(key=>key.startsWith(PREFIX))) sync().catch(failure);
  });
  await sync();
  $('content').inert=false; $('footer').inert=false; status('');
} catch(error) {
  console.error('Ruhe Tab konnte nicht starten:',error);
  status('Lokale Daten konnten nicht geöffnet werden. Es wurde keine erfolgreiche Speicherung bestätigt. Bitte erneut laden.');
  $('retry').hidden=false;
}

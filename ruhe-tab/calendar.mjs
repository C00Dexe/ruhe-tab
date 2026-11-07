import {PREFIX, MAX_EVENTS, localDay, parseDay, civilDate, shiftDay, shiftMonth, monthRows, normalizeEvent, sortEvents, upcoming} from './calendar-model.mjs';

const $ = id => document.getElementById(id);
const widget = document.querySelector('.calendar-widget');
const dayFormat = new Intl.DateTimeFormat('de-DE',{timeZone:'UTC',weekday:'long',day:'numeric',month:'long',year:'numeric'});
const shortFormat = new Intl.DateTimeFormat('de-DE',{timeZone:'UTC',day:'numeric',month:'short',year:'numeric'});
const monthFormat = new Intl.DateTimeFormat('de-DE',{timeZone:'UTC',month:'long',year:'numeric'});
let today = localDay(), selected = today, events = [], editingId = null, readable = true, warning = '';
const status = message => { $('calendar-status').textContent = message; };

function load() {
  try {
    const values = [];
    warning = '';
    for(let index=0;index<localStorage.length;index++) {
      const key=localStorage.key(index);
      if(!key?.startsWith(PREFIX))continue;
      try {
        const event=normalizeEvent(JSON.parse(localStorage.getItem(key)),key.slice(PREFIX.length));
        if(event)values.push(event); else warning='Einige gespeicherte Termine konnten nicht gelesen werden. Die betroffenen Daten wurden nicht gelöscht.';
      } catch { warning='Einige gespeicherte Termine konnten nicht gelesen werden. Die betroffenen Daten wurden nicht gelöscht.'; }
    }
    events=sortEvents(values);readable=true;return true;
  } catch {
    readable=false;warning='Termine konnten nicht geladen werden. Bitte lade den Tab erneut.';return false;
  }
}
function focusDay(value) { widget.querySelector(`[data-calendar-day="${value}"]`)?.focus(); }
function choose(value, focus = false) {
  selected=value;render();if(focus)focusDay(value);
}
function eventRow(event, scope) {
  const li=document.createElement('li'), button=document.createElement('button');
  button.type='button';button.title='Termin bearbeiten';button.dataset.calendarFocus=scope+'-'+event.id;
  button.setAttribute('aria-label',`${event.title}, ${dayFormat.format(civilDate(event.date))}, ${event.time || 'ganztägig'}. Termin bearbeiten`);
  const title=document.createElement('span');title.className='calendar-event-title';title.textContent=event.title;
  const when=document.createElement('span');when.className='calendar-event-when';when.textContent=(scope==='next'?shortFormat.format(civilDate(event.date))+' · ':'')+(event.time || 'Ganztägig');
  button.append(title,when);button.addEventListener('click',()=>open(event));li.append(button);return li;
}
function render() {
  const active=widget.contains(document.activeElement) ? document.activeElement.dataset.calendarFocus : null;
  $('calendar-month-title').textContent=monthFormat.format(civilDate(selected));
  $('calendar-selected-label').textContent=shortFormat.format(civilDate(selected));
  const month=selected.slice(0,7), counts=new Map();
  for(const event of events)counts.set(event.date,(counts.get(event.date)||0)+1);
  const body=$('calendar-days');body.replaceChildren();
  for(const row of monthRows(selected)) {
    const tr=document.createElement('tr');
    for(const value of row) {
      const td=document.createElement('td');
      if(value) {
        const button=document.createElement('button');button.type='button';button.textContent=String(parseDay(value).day);
        button.dataset.calendarDay=value;button.dataset.calendarFocus='day-'+value;button.tabIndex=value===selected?0:-1;
        button.setAttribute('aria-pressed',String(value===selected));
        const count=counts.get(value)||0;button.setAttribute('aria-label',dayFormat.format(civilDate(value))+(count?`, ${count} ${count===1?'Termin':'Termine'}`:''));
        if(value===today)button.setAttribute('aria-current','date');
        if(count){const dot=document.createElement('span');dot.className='calendar-dot';dot.setAttribute('aria-hidden','true');button.append(dot)}
        button.addEventListener('click',()=>choose(value,true));
        button.addEventListener('keydown',event=>{
          let next;
          const directions={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7};
          if(event.key in directions)next=shiftDay(value,directions[event.key]);
          if(event.key==='PageUp')next=shiftMonth(value,-1);
          if(event.key==='PageDown')next=shiftMonth(value,1);
          if(event.key==='Home')next=shiftDay(value,-((civilDate(value).getUTCDay()+6)%7));
          if(event.key==='End')next=shiftDay(value,6-((civilDate(value).getUTCDay()+6)%7));
          if(next){event.preventDefault();choose(next,true)}
        });
        td.append(button);
      }
      tr.append(td);
    }
    body.append(tr);
  }
  $('calendar-previous').disabled=month==='0001-01';$('calendar-next').disabled=month==='9999-12';
  const selectedEvents=events.filter(event=>event.date===selected);
  const nextEvents=upcoming(events).slice(0,5);
  $('calendar-day-events').replaceChildren(...selectedEvents.map(event=>eventRow(event,'selected')));
  $('calendar-upcoming').replaceChildren(...nextEvents.map(event=>eventRow(event,'next')));
  $('calendar-day-empty').hidden=selectedEvents.length>0;
  $('calendar-upcoming-empty').hidden=nextEvents.length>0;
  $('calendar-day-empty').textContent=readable?'Keine Termine an diesem Tag.':'Termine konnten nicht geladen werden.';
  $('calendar-upcoming-empty').textContent=readable?'Keine anstehenden Termine.':'Termine konnten nicht geladen werden.';
  $('calendar-add').disabled=!readable || events.length>=MAX_EVENTS;
  if(warning)status(warning);
  else if(events.length>=MAX_EVENTS)status('500 Termine gespeichert. Lösche einen Termin, um Platz zu schaffen.');
  if(active)Array.from(widget.querySelectorAll('[data-calendar-focus]')).find(el=>el.dataset.calendarFocus===active)?.focus();
}
function open(event = null) {
  editingId=event?.id || null;
  $('appointment-dialog-title').textContent=event?'Termin bearbeiten':'Termin hinzufügen';
  $('appointment-title').value=event?.title || '';
  $('appointment-date').value=event?.date || selected;
  $('appointment-time').value=event?.time || '';
  $('appointment-delete').hidden=!event;
  $('appointment-error').textContent='';$('appointment-dialog').showModal();
}
function close() { $('appointment-dialog').close();($('calendar-add').disabled ? $('calendar-today') : $('calendar-add')).focus(); }
$('calendar-add').addEventListener('click',()=>open());
$('calendar-previous').addEventListener('click',()=>choose(shiftMonth(selected,-1)));
$('calendar-next').addEventListener('click',()=>choose(shiftMonth(selected,1)));
$('calendar-today').addEventListener('click',()=>choose(localDay()));
$('appointment-cancel').addEventListener('click',close);
$('appointment-form').addEventListener('submit',event=>{
  event.preventDefault();
  const value=normalizeEvent({id:editingId || crypto.randomUUID(),title:$('appointment-title').value,date:$('appointment-date').value,time:$('appointment-time').value});
  if(!value){$('appointment-error').textContent='Bitte gib einen Titel, ein gültiges Datum und optional eine gültige Uhrzeit ein.';return}
  if(!load()){$('appointment-error').textContent=warning;return}
  if(editingId && !events.some(item=>item.id===editingId)){$('appointment-error').textContent='Dieser Termin wurde in einem anderen Tab gelöscht. Schließe das Feld und lege bei Bedarf einen neuen Termin an.';render();return}
  if(!editingId && events.length>=MAX_EVENTS){$('appointment-error').textContent='500 Termine gespeichert. Lösche zuerst einen Termin.';return}
  try {
    localStorage.setItem(PREFIX+value.id,JSON.stringify(value));
    selected=value.date;load();status('Termin lokal gespeichert.');render();close();
  } catch { $('appointment-error').textContent='Der Termin konnte nicht gespeichert werden. Deine Eingaben bleiben im Feld. Bitte versuche es erneut.'; }
});
$('appointment-delete').addEventListener('click',()=>{
  if(!editingId)return;
  try {localStorage.removeItem(PREFIX+editingId);load();status('Termin gelöscht.');render();close()}
  catch { $('appointment-error').textContent='Der Termin konnte nicht gelöscht werden. Bitte versuche es erneut.'; }
});
window.addEventListener('storage',event=>{
  if(event.key!==null && !event.key.startsWith(PREFIX))return;
  status('');load();render();
});
document.addEventListener('ruhe-tab-time-change',()=>{
  const next=localDay();
  if(next!==today) {if(selected===today)selected=next;today=next;}
  render();
});
load();render();

export const PREFIX = 'ruhe2.';
export const MAX_TASKS = 50;
export const MAX_LINKS = 12;
export const text = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';
export function dayKey(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
}
export function webUrl(value) {
  const raw = text(value, 2049);
  if (!raw || raw.length > 2048 || /[\s\\]/u.test(raw)) return null;
  const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(raw);
  const hostPort = /^[a-z\d.-]+:\d+(?:[/?#]|$)/i.test(raw);
  try {
    const url = new URL(!hasScheme || hostPort ? `https://${raw}` : raw);
    return ['http:', 'https:'].includes(url.protocol) && url.hostname && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}
export function validId(id) { return /^[a-z\d-]{1,80}$/i.test(id); }
export function decode(records, today = dayKey()) {
  const goal = records[PREFIX+'goal'];
  const state = { name:text(records[PREFIX+'name'],40), goal:'', goalDone:false, tasks:[], links:[] };
  if (goal?.day === today) {
    state.goal = text(goal.text,160);
    state.goalDone = !!state.goal && goal.done === true;
  }
  for (const [key, value] of Object.entries(records)) {
    if (!value || typeof value !== 'object') continue;
    for (const [kind, list] of [['task',state.tasks],['link',state.links]]) {
      if (!key.startsWith(PREFIX+kind+'.')) continue;
      const id = key.slice((PREFIX+kind+'.').length);
      if (!validId(id)) continue;
      const order = Number.isFinite(value.order) ? value.order : 0;
      if (kind === 'task' && text(value.text,160)) list.push({id, text:text(value.text,160), done:value.done === true, order});
      if (kind === 'link' && text(value.name,32) && webUrl(value.url)) list.push({id, name:text(value.name,32), url:webUrl(value.url), order});
    }
  }
  for (const list of [state.tasks,state.links]) list.sort((a,b)=>a.order-b.order || a.id.localeCompare(b.id));
  return state;
}
export function migrate(raw) {
  const records = {[PREFIX+'ready']:true};
  if (!raw) return records;
  const old = JSON.parse(raw);
  if (!old || typeof old !== 'object' || Array.isArray(old)) throw Error('Ungültiger alter Speicher');
  records[PREFIX+'name'] = text(old.name,40);
  records[PREFIX+'goal'] = {day:text(old.day,10), text:text(old.goal,160), done:old.goalDone === true};
  (Array.isArray(old.tasks) ? old.tasks : []).slice(0,MAX_TASKS).forEach((task,i)=>{
    if (text(task?.text,160)) records[PREFIX+'task.old-'+i]={text:text(task.text,160), done:task.done === true, order:i};
  });
  (Array.isArray(old.shortcuts) ? old.shortcuts : []).slice(0,MAX_LINKS).forEach((link,i)=>{
    if (text(link?.name,32) && webUrl(link.url)) records[PREFIX+'link.old-'+i]={name:text(link.name,32), url:webUrl(link.url), order:i};
  });
  return records;
}

export const PREFIX = 'ruhe-tab-calendar-event.';
export const MAX_EVENTS = 500;
export const localDay = (now = new Date()) => `${String(now.getFullYear()).padStart(4,'0')}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
export function monthDays(year, month) {
  if (month === 2) return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
  return [4,6,9,11].includes(month) ? 30 : 31;
}
export function parseDay(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  return year >= 1 && year <= 9999 && month >= 1 && month <= 12 && day >= 1 && day <= monthDays(year, month) ? {year,month,day} : null;
}
export function civilDate(value) {
  const parts = parseDay(value);
  if (!parts) throw Error('Ungültiges Datum');
  const date = new Date(0);
  date.setUTCFullYear(parts.year,parts.month-1,parts.day);
  date.setUTCHours(12,0,0,0);
  return date;
}
export function dayString(year,month,day) { return `${String(year).padStart(4,'0')}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`; }
export function shiftDay(value, delta) {
  const date = civilDate(value);
  date.setUTCDate(date.getUTCDate()+delta);
  return date.getUTCFullYear() < 1 || date.getUTCFullYear() > 9999 ? value : dayString(date.getUTCFullYear(),date.getUTCMonth()+1,date.getUTCDate());
}
export function shiftMonth(value, delta) {
  const {year,month,day} = parseDay(value);
  const index = (year-1)*12 + month-1 + delta;
  if (index < 0 || index >= 9999*12) return value;
  const nextYear = Math.floor(index/12)+1, nextMonth = index%12+1;
  return dayString(nextYear,nextMonth,Math.min(day,monthDays(nextYear,nextMonth)));
}
export function monthRows(value) {
  const {year,month} = parseDay(value);
  const start = (civilDate(dayString(year,month,1)).getUTCDay()+6)%7;
  const cells = Array(start).fill(null);
  for(let day=1;day<=monthDays(year,month);day++)cells.push(dayString(year,month,day));
  while(cells.length%7)cells.push(null);
  return Array.from({length:cells.length/7},(_,index)=>cells.slice(index*7,index*7+7));
}
export function normalizeEvent(value, id = value?.id) {
  if (!value || typeof value !== 'object' || typeof id !== 'string' || !/^[a-z\d-]{1,80}$/i.test(id)) return null;
  const title = typeof value.title === 'string' ? value.title.trim().slice(0,120) : '';
  if (!title || !parseDay(value.date) || typeof value.time !== 'string' || (value.time !== '' && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value.time))) return null;
  return {id,title,date:value.date,time:value.time};
}
export const sortEvents = events => [...events].sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time)||a.title.localeCompare(b.title,'de')||a.id.localeCompare(b.id));
export function upcoming(events, now = new Date()) {
  const today = localDay(now), time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  return sortEvents(events.filter(event=>event.date>today || (event.date===today && (!event.time || event.time>=time))));
}

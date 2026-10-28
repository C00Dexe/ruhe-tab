import {PREFIX, decode, migrate, validId} from './model.mjs';

// The adapter is injected to make the actual storage operations testable.
export function createStore(api) {
  return {
    async initialize(readLegacy) {
      const existing = await api.get(null);
      if (!existing[PREFIX+'ready']) {
        let records;
        try { records = migrate(readLegacy()); }
        catch { throw Error('Alte Daten konnten nicht gelesen werden. Sie wurden nicht verändert.'); }
        await api.set(records);
      }
    },
    async read(today) { return decode(await api.get(null), today); },
    async name(value) { await api.set({[PREFIX+'name']:value}); },
    async goal(day, value, done) { await api.set({[PREFIX+'goal']:{day, text:value, done}}); },
    async put(kind, id, value) {
      if (!['task','link'].includes(kind) || !validId(id)) throw Error('Ungültiger Speicherschlüssel');
      await api.set({[PREFIX+kind+'.'+id]:value});
    },
    async remove(kind, id) {
      if (!['task','link'].includes(kind) || !validId(id)) throw Error('Ungültiger Speicherschlüssel');
      await api.remove(PREFIX+kind+'.'+id);
    }
  };
}

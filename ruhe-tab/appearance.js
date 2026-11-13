"use strict";

(() => {
  const LEGACY_KEY = "ruhe-tab-appearance-v1";
  const MAX_BYTES = 10 * 1024 * 1024;
  const MAX_WIDTH = 2560, MAX_HEIGHT = 1440;
  const presets = ["forest","night","slate","ocean","lavender","ember","sand","rose","graphite"];
  const types = ["image/jpeg", "image/png", "image/webp"];
  const buttons = Array.from(document.querySelectorAll("button[data-background]"));
  const input = document.getElementById("background-file");
  const panel = document.getElementById("personalization");
  const message = text => { document.getElementById("appearance-status").textContent = text; };
  let dbPromise, channel, objectUrl;
  let operation = 0, renderVersion = 0, active = true;

  function database() {
    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open("ruhe-tab-backgrounds", 1);
        request.onupgradeneeded = () => request.result.createObjectStore("appearance");
        request.onerror = () => { dbPromise = null; reject(request.error); };
        request.onblocked = () => { dbPromise = null; reject(new Error("Datenbank blockiert")); };
        request.onsuccess = () => {
          const db = request.result;
          db.onversionchange = () => { db.close(); dbPromise = null; };
          resolve(db);
        };
      });
    }
    return dbPromise;
  }
  async function transaction(mode, work) {
    const db = await database();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("appearance", mode);
      let result;
      tx.oncomplete = () => resolve(result);
      tx.onabort = () => reject(tx.error || new Error("Speicherung abgebrochen"));
      tx.onerror = () => {}; // A failed request aborts the transaction; only completion means success.
      try { work(tx.objectStore("appearance"), value => { result = value; }); }
      catch (error) { tx.abort(); reject(error); }
    });
  }
  const read = () => transaction("readonly", (store, done) => {
    const request = store.get("current");
    request.onsuccess = () => done(request.result);
  });
  function normalize(value) {
    if (value && presets.includes(value.kind)) return {kind:value.kind};
    if (value?.kind === "image" && value.blob instanceof Blob && types.includes(value.blob.type) && value.blob.size <= MAX_BYTES) return value;
    return {kind:"forest"};
  }
  async function prepareImage(file) {
    if (!types.includes(file.type) || file.size > MAX_BYTES || !file.size) throw new Error("Bitte wähle JPG, PNG oder WebP mit höchstens 10 MB.");
    let bitmap;
    const canvas = document.createElement("canvas");
    try {
      bitmap = await createImageBitmap(file, {imageOrientation:"from-image"});
      if (!bitmap.width || !bitmap.height || bitmap.width > 16384 || bitmap.height > 16384 || bitmap.width * bitmap.height > 64000000) {
        throw new Error("Das Bild hat zu viele Pixel. Bitte wähle ein Bild bis 64 Megapixel und höchstens 16384 Pixel pro Seite.");
      }
      const scale = Math.min(1, MAX_WIDTH / bitmap.width, MAX_HEIGHT / bitmap.height);
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Bildverarbeitung ist nicht verfügbar.");
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close(); bitmap = null;
      const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/webp", 0.86));
      if (!blob) throw new Error("Bild konnte nicht verkleinert werden.");
      return {kind:"image", blob, width:canvas.width, height:canvas.height};
    } finally {
      if (bitmap) bitmap.close();
      canvas.width = 0; canvas.height = 0;
    }
  }
  async function legacyValue(raw) {
    const old = JSON.parse(raw);
    if (old && presets.includes(old.kind)) return {kind:old.kind};
    if (old?.kind !== "image" || typeof old.data !== "string" || old.data.length > 1500000 || !/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(old.data)) throw new Error("Alte Bildauswahl ungültig");
    const [header, content] = old.data.split(",");
    const binary = atob(content);
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    return prepareImage(new Blob([bytes], {type:header.slice(5, header.indexOf(";"))}));
  }
  async function initialize() {
    if (await read() !== undefined) return;
    let value = {kind:"forest"}, raw, migrated = false;
    try {
      raw = localStorage.getItem(LEGACY_KEY);
      if (raw) { value = await legacyValue(raw); migrated = true; }
    } catch {
      message("Die bisherige Hintergrundauswahl konnte nicht übernommen werden. Wähle sie bitte erneut; die alten Daten wurden nicht gelöscht.");
    }
    // Two tabs can start together. Never overwrite a choice committed by the other tab.
    await transaction("readwrite", store => {
      const request = store.get("current");
      request.onsuccess = () => { if (request.result === undefined) store.put(value, "current"); };
    });
    if (migrated) {
      try { localStorage.removeItem(LEGACY_KEY); } catch { /* The IndexedDB record remains authoritative. */ }
    }
  }
  function render(value) {
    value = normalize(value);
    const previous = objectUrl;
    objectUrl = value.kind === "image" ? URL.createObjectURL(value.blob) : null;
    document.body.dataset.background = value.kind;
    if (objectUrl) document.body.style.setProperty("--user-image", `url("${objectUrl}")`);
    else document.body.style.removeProperty("--user-image");
    for (const button of buttons) button.setAttribute("aria-pressed", String(button.dataset.background === value.kind));
    if (previous) URL.revokeObjectURL(previous);
  }
  const ready = initialize();
  async function refresh() {
    const revision = ++renderVersion;
    await ready;
    const value = await read();
    if (active && revision === renderVersion) render(value);
  }
  function unavailable() {
    message("Der Hintergrundspeicher ist nicht verfügbar. Bitte schließe andere Ruhe-Tabs und lade die Seite erneut. Deine bisherigen Daten wurden nicht als erfolgreich ersetzt bestätigt.");
  }
  async function save(value, ticket) {
    try {
      await ready;
      if (ticket !== operation) return;
      await transaction("readwrite", store => store.put(value, "current"));
      await refresh();
      if (channel) channel.postMessage("changed");
      if (ticket !== operation) return;
      message(value.kind === "image" ? "Bild einmalig angepasst und lokal gespeichert." : "Hintergrund gespeichert.");
    } catch {
      if (ticket === operation) message("Hintergrund konnte nicht gespeichert werden. Der bisher gespeicherte Hintergrund bleibt erhalten. Bitte versuche es erneut.");
    }
  }
  for (const button of buttons) button.addEventListener("click", () => {
    const ticket = ++operation;
    save({kind:button.dataset.background}, ticket);
  });
  input.addEventListener("change", async () => {
    const file = input.files[0]; input.value = "";
    if (!file) return;
    const ticket = ++operation;
    message("Bild wird einmalig auf deinem Gerät angepasst …");
    try {
      const value = await prepareImage(file);
      if (ticket === operation) await save(value, ticket);
    } catch (error) {
      if (ticket === operation) message(error.message && /^(Bitte wähle|Das Bild hat)/.test(error.message) ? error.message : "Dieses Bild konnte nicht gelesen oder verarbeitet werden. Bitte wähle eine andere JPG-, PNG- oder WebP-Datei.");
    }
  });
  function connect() {
    if (channel) return;
    channel = new BroadcastChannel("ruhe-tab-background");
    channel.onmessage = () => refresh().catch(unavailable);
  }
  document.getElementById("close-appearance").addEventListener("click", () => {
    panel.open = false; panel.querySelector("summary").focus();
  });
  window.addEventListener("pageshow", () => { active = true; connect(); refresh().catch(unavailable); });
  window.addEventListener("pagehide", () => {
    active = false; ++operation; ++renderVersion;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = null;
    if (channel) channel.close();
    channel = null;
  });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) refresh().catch(unavailable); });
  connect();
  refresh().catch(unavailable);
})();

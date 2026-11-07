"use strict";

(() => {
  const KEY = "ruhe-tab-widget-sizes-v1";
  const names = ["tasks", "greeting", "clock", "goal", "links", "calendar"];
  const defaults = () => Object.fromEntries(names.map(name => [name, 100]));
  const inputs = Object.fromEntries(names.map(name => [name, document.getElementById(`size-${name}`)]));
  const status = message => { document.getElementById("widget-size-status").textContent = message; };
  const bounded = value => typeof value === "number" && Number.isFinite(value)
    ? Math.max(75, Math.min(150, Math.round(value / 5) * 5)) : 100;

  function read() {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved === null) return defaults();
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) throw new Error("Ungültige Widgetgrößen");
    return Object.fromEntries(names.map(name => [name, bounded(saved[name])]));
  }
  function render(values) {
    for (const name of names) {
      const value = bounded(values[name]);
      document.documentElement.style.setProperty(`--${name}-scale`, String(value / 100));
      inputs[name].value = String(value);
      document.getElementById(`size-${name}-value`).value = `${value} %`;
      inputs[name].setAttribute("aria-valuetext", `${value} Prozent`);
    }
    document.dispatchEvent(new Event("ruhe-widget-sizes-change"));
  }
  function restore() {
    try { render(read()); }
    catch {
      render(defaults());
      status("Gespeicherte Widgetgrößen konnten nicht gelesen werden. Die Standardgrößen werden angezeigt.");
    }
  }
  for (const name of names) {
    inputs[name].addEventListener("input", () => {
      const value = bounded(Number(inputs[name].value));
      document.documentElement.style.setProperty(`--${name}-scale`, String(value / 100));
      document.getElementById(`size-${name}-value`).value = `${value} %`;
      inputs[name].setAttribute("aria-valuetext", `${value} Prozent`);
      document.dispatchEvent(new Event("ruhe-widget-sizes-change"));
      status("Vorschau – beim Loslassen oder per Pfeiltaste speichern.");
    });
    inputs[name].addEventListener("change", () => {
      const value = bounded(Number(inputs[name].value));
      try {
        // Merge with the latest saved selection so unrelated changes in another tab survive.
        let latest;
        try { latest = read(); } catch { latest = defaults(); }
        latest[name] = value;
        localStorage.setItem(KEY, JSON.stringify(latest));
        render(latest);
        status("Widgetgröße lokal gespeichert.");
      } catch {
        restore();
        status("Die Größe konnte nicht gespeichert werden. Die zuletzt gespeicherten Größen werden angezeigt.");
      }
    });
  }
  document.getElementById("reset-widget-sizes").addEventListener("click", () => {
    try {
      localStorage.removeItem(KEY);
      render(defaults());
      status("Alle Widgetgrößen sind wieder auf 100 Prozent eingestellt.");
    } catch {
      restore();
      status("Die Größen konnten nicht zurückgesetzt werden. Bitte versuche es erneut.");
    }
  });
  window.addEventListener("storage", event => {
    if (event.key !== KEY && event.key !== null) return;
    status("");
    restore();
  });
  restore();
})();

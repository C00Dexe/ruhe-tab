"use strict";

(() => {
  const KEY = "ruhe-tab-v1";
  const MAX_TASKS = 50;
  const MAX_SHORTCUTS = 12;
  let editingShortcuts = false;
  const $ = (id) => document.getElementById(id);
  const localDay = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const cleanText = (value, length) => typeof value === "string" ? value.trim().slice(0, length) : "";
  const emptyState = () => ({ name: "", day: localDay(), goal: "", goalDone: false, tasks: [], shortcuts: [] });
  const timeFormat = new Intl.DateTimeFormat("de-DE", { hour: "2-digit", minute: "2-digit" });
  const dateFormat = new Intl.DateTimeFormat("de-DE", { weekday: "long", day: "numeric", month: "long" });
  let timer;

  function announce(message) { $("status").textContent = message; }

  function safeWebUrl(value) {
    const raw = typeof value === "string" ? value.trim() : "";
    if (!raw || raw.length > 2048 || /\s/.test(raw)) return null;
    // Explicit schemes must be HTTP(S). Accept bare domains and localhost:port.
    const candidate = /^(?:[a-z0-9.-]+):\d+(?:[/?#]|$)/i.test(raw) || !/^[a-z][a-z0-9+.-]*:/i.test(raw)
      ? `https://${raw}` : raw;
    try {
      const url = new URL(candidate);
      if (!["https:", "http:"].includes(url.protocol) || !url.hostname || url.username || url.password) return null;
      return url.href;
    } catch { return null; }
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return emptyState();
      const saved = JSON.parse(raw);
      if (!saved || typeof saved !== "object" || Array.isArray(saved)) throw new Error("Invalid data");
      const today = localDay();
      return {
        name: cleanText(saved.name, 40),
        day: today,
        goal: saved.day === today ? cleanText(saved.goal, 160) : "",
        goalDone: saved.day === today && saved.goalDone === true && Boolean(cleanText(saved.goal, 160)),
        shortcuts: Array.isArray(saved.shortcuts) ? saved.shortcuts.slice(0, MAX_SHORTCUTS)
          .filter((link) => link && cleanText(link.name, 32) && safeWebUrl(link.url))
          .map((link) => ({ name: cleanText(link.name, 32), url: safeWebUrl(link.url) })) : [],
        tasks: Array.isArray(saved.tasks) ? saved.tasks.slice(0, MAX_TASKS)
          .filter((task) => task && cleanText(task.text, 160))
          .map((task) => ({ text: cleanText(task.text, 160), done: task.done === true })) : []
      };
    } catch {
      announce("Gespeicherte Daten konnten nicht geladen werden. Du kannst die Seite verwenden; beim nächsten Speichern werden die lokalen Daten neu angelegt.");
      return emptyState();
    }
  }

  let state = load();

  function save(message = "") {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      announce(message);
    } catch {
      announce("Speichern nicht möglich. Deine Änderungen bleiben nur in diesem geöffneten Tab. Prüfe den verfügbaren Browserspeicher.");
    }
  }

  function greeting(now) {
    const hour = now.getHours();
    const salutation = hour < 5 ? "Gute Nacht" : hour < 11 ? "Guten Morgen" : hour < 18 ? "Guten Tag" : "Guten Abend";
    $("greeting").textContent = `${salutation}${state.name ? ", " + state.name : ""}.`;
  }

  function renderGoal() {
    $("goal-input").value = state.goal;
    $("goal-input").classList.toggle("done", state.goalDone);
    $("goal-done").checked = state.goalDone;
    $("goal-completion").hidden = !state.goal;
  }

  function rollover() {
    const today = localDay();
    if (state.day !== today) {
      state.day = today;
      state.goal = "";
      state.goalDone = false;
      save();
      renderGoal();
    }
  }

  function renderTasks() {
    const list = $("task-list");
    list.replaceChildren();
    state.tasks.forEach((task, index) => {
      const item = document.createElement("li");
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      const text = document.createElement("span");
      text.textContent = task.text;
      checkbox.addEventListener("change", () => {
        rollover();
        task.done = checkbox.checked;
        save();
        updateCount();
      });
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "×";
      remove.setAttribute("aria-label", `Aufgabe löschen: ${task.text}`);
      remove.addEventListener("click", () => {
        rollover();
        state.tasks.splice(index, 1);
        save("Aufgabe gelöscht.");
        renderTasks();
        const next = list.children[Math.min(index, list.children.length - 1)];
        (next ? next.querySelector("button") : $("task-input")).focus();
      });
      label.append(checkbox, text);
      item.append(label, remove);
      list.append(item);
    });
    updateCount();
  }

  function updateCount() {
    $("task-count").textContent = `${state.tasks.filter((task) => !task.done).length} offen`;
    $("empty-tasks").hidden = state.tasks.length > 0;
    const full = state.tasks.length >= MAX_TASKS;
    $("task-limit").hidden = !full;
    $("task-input").disabled = full;
    $("task-form").querySelector("button").disabled = full;
  }

  function renderShortcuts() {
    const list = $("shortcut-list");
    list.replaceChildren();
    state.shortcuts.forEach((shortcut, index) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = shortcut.url;
      link.referrerPolicy = "no-referrer";
      link.rel = "noreferrer noopener";
      link.title = `${shortcut.name} – ${shortcut.url}`;
      const icon = document.createElement("span");
      icon.className = "shortcut-icon";
      icon.textContent = Array.from(shortcut.name)[0].toLocaleUpperCase("de-DE");
      icon.setAttribute("aria-hidden", "true");
      const label = document.createElement("span");
      label.className = "shortcut-label";
      label.textContent = shortcut.name;
      link.append(icon, label);
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "shortcut-remove";
      remove.textContent = "×";
      remove.hidden = !editingShortcuts;
      remove.setAttribute("aria-label", `Verknüpfung löschen: ${shortcut.name}`);
      remove.addEventListener("click", () => {
        rollover();
        state.shortcuts.splice(index, 1);
        save("Verknüpfung gelöscht.");
        renderShortcuts();
        const next = list.children[Math.min(index, list.children.length - 1)];
        (next ? next.querySelector("button") : $("add-shortcut")).focus();
      });
      item.append(link, remove);
      list.append(item);
    });
    if (!state.shortcuts.length) editingShortcuts = false;
    $("edit-shortcuts").hidden = !state.shortcuts.length;
    $("edit-shortcuts").setAttribute("aria-pressed", String(editingShortcuts));
    $("edit-shortcuts").textContent = editingShortcuts ? "Fertig" : "Bearbeiten";
    $("add-shortcut").hidden = state.shortcuts.length >= MAX_SHORTCUTS;
    $("shortcut-limit").hidden = state.shortcuts.length < MAX_SHORTCUTS;
  }

  $("edit-shortcuts").addEventListener("click", () => {
    editingShortcuts = !editingShortcuts;
    renderShortcuts();
  });
  $("add-shortcut").addEventListener("click", () => {
    $("shortcut-form").reset();
    $("shortcut-error").textContent = "";
    $("shortcut-dialog").showModal();
  });
  $("cancel-shortcut").addEventListener("click", () => $("shortcut-dialog").close());
  $("shortcut-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = cleanText($("shortcut-name").value, 32);
    const url = safeWebUrl($("shortcut-url").value);
    if (!name || !url) {
      $("shortcut-error").textContent = "Bitte gib einen Namen und eine gültige http://- oder https://-Adresse ohne Leerzeichen oder Zugangsdaten ein.";
      $("shortcut-url").focus();
      return;
    }
    if (state.shortcuts.length >= MAX_SHORTCUTS) {
      $("shortcut-error").textContent = "Deine Liste ist voll. Schließe dieses Fenster und lösche zuerst eine Verknüpfung.";
      return;
    }
    rollover();
    state.shortcuts.push({ name, url });
    save("Verknüpfung gespeichert.");
    renderShortcuts();
    $("shortcut-dialog").close();
    $("shortcut-list").lastElementChild.querySelector("a").focus();
  });
  document.addEventListener("click", (event) => {
    if (!$("personalization").contains(event.target)) $("personalization").open = false;
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && $("personalization").open) {
      $("personalization").open = false;
      $("personalization").querySelector("summary").focus();
    }
  });

  function refresh() {
    clearTimeout(timer);
    if (document.hidden) return;
    const now = new Date();
    rollover();
    $("clock").textContent = timeFormat.format(now);
    $("clock").dateTime = now.toISOString();
    $("date").textContent = dateFormat.format(now);
    greeting(now);
    document.dispatchEvent(new Event("ruhe-tab-time-change"));
    timer = setTimeout(refresh, 60000 - (Date.now() % 60000));
  }

  $("name-form").addEventListener("submit", (event) => {
    event.preventDefault();
    rollover();
    state.name = cleanText($("name-input").value, 40);
    $("name-input").value = state.name;
    save("Name gespeichert.");
    greeting(new Date());
    $("personalization").open = false;
    $("personalization").querySelector("summary").focus();
  });

  $("goal-form").addEventListener("submit", (event) => {
    event.preventDefault();
    // Read first: a date rollover can reset the displayed field.
    const nextGoal = cleanText($("goal-input").value, 160);
    rollover();
    if (state.goal !== nextGoal) state.goalDone = false;
    state.goal = nextGoal;
    save("Tagesziel gespeichert.");
    renderGoal();
  });

  $("goal-done").addEventListener("change", () => {
    const checked = $("goal-done").checked;
    rollover();
    state.goalDone = Boolean(state.goal) && checked;
    save();
    renderGoal();
  });

  $("task-form").addEventListener("submit", (event) => {
    event.preventDefault();
    rollover();
    const text = cleanText($("task-input").value, 160);
    if (!text || state.tasks.length >= MAX_TASKS) return;
    state.tasks.push({ text, done: false });
    save("Aufgabe hinzugefügt.");
    $("task-input").value = "";
    renderTasks();
    if (!$("task-input").disabled) $("task-input").focus();
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== KEY && event.key !== null) return;
    state = load();
    $("name-input").value = state.name;
    renderGoal();
    renderTasks();
    renderShortcuts();
    refresh();
  });
  document.addEventListener("visibilitychange", refresh);
  window.addEventListener("pageshow", refresh);
  window.addEventListener("pagehide", () => clearTimeout(timer));

  $("name-input").value = state.name;
  renderGoal();
  renderTasks();
  renderShortcuts();
  refresh();
})();

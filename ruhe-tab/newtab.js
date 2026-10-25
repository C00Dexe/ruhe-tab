"use strict";

(() => {
  const KEY = "ruhe-tab-v1";
  const MAX_TASKS = 50;
  const $ = (id) => document.getElementById(id);
  const localDay = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const cleanText = (value, length) => typeof value === "string" ? value.trim().slice(0, length) : "";
  const emptyState = () => ({ name: "", day: localDay(), goal: "", goalDone: false, tasks: [] });
  const timeFormat = new Intl.DateTimeFormat("de-DE", { hour: "2-digit", minute: "2-digit" });
  const dateFormat = new Intl.DateTimeFormat("de-DE", { weekday: "long", day: "numeric", month: "long" });
  let timer;

  function announce(message) { $("status").textContent = message; }

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

  function refresh() {
    clearTimeout(timer);
    if (document.hidden) return;
    const now = new Date();
    rollover();
    $("clock").textContent = timeFormat.format(now);
    $("clock").dateTime = now.toISOString();
    $("date").textContent = dateFormat.format(now);
    greeting(now);
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
    refresh();
  });
  document.addEventListener("visibilitychange", refresh);
  window.addEventListener("pageshow", refresh);
  window.addEventListener("pagehide", () => clearTimeout(timer));

  $("name-input").value = state.name;
  renderGoal();
  renderTasks();
  refresh();
})();

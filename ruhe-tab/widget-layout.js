"use strict";

(() => {
  const KEY = "ruhe-tab-widget-layout-v1";
  const definitions = [
    ["clock", ".clock-widget", "Uhr und Datum"],
    ["greeting", ".greeting-widget", "Begrüßung"],
    ["goal", ".goal-section", "Tagesziel"],
    ["tasks", ".tasks-panel", "Aufgabenliste"],
    ["links", ".shortcuts", "Webseiten-Verknüpfungen"]
  ];
  const stage = document.querySelector("main");
  const settings = document.getElementById("personalization");
  const toggle = document.getElementById("edit-widget-layout");
  const finish = document.getElementById("finish-widget-layout");
  const status = (message, visible = false) => {
    document.getElementById("layout-status").textContent = message;
    const feedback = document.getElementById("layout-feedback");
    feedback.textContent = visible ? message : "";
    feedback.hidden = !visible;
  };
  const clamp = (value, low, high) => Math.max(low, Math.min(Math.max(low, high), value));
  let current = null, editing = false, drag = null, raf = 0, front = 0;
  const widgets = definitions.map(([name, selector, label]) => {
    const node = document.querySelector(selector);
    const marker = document.createComment(`layout-${name}`);
    node.before(marker);
    const frame = document.createElement("div");
    frame.className = "layout-frame"; frame.dataset.widget = name;
    const handle = document.createElement("button");
    handle.type = "button"; handle.className = "layout-handle"; handle.textContent = `↕ ${label}`;
    handle.setAttribute("aria-label", `${label} verschieben`);
    handle.setAttribute("aria-describedby", "layout-help");
    handle.disabled = true;
    frame.append(handle);
    return {name, node, marker, frame, handle};
  });
  function read() {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return null;
    const value = JSON.parse(raw);
    if (value?.version !== 1 || !value.positions || typeof value.positions !== "object") throw new Error("Ungültige Anordnung");
    const positions = {};
    for (const {name} of widgets) {
      const point = value.positions[name];
      if (!point || typeof point.x !== "number" || !Number.isFinite(point.x) || typeof point.y !== "number" || !Number.isFinite(point.y)) throw new Error("Ungültige Position");
      positions[name] = {x:clamp(point.x, 0, 1), y:clamp(point.y, 0, 1)};
    }
    return {version:1, positions};
  }
  function sizeStage() {
    const margin = window.innerWidth <= 640 ? 12 : 24;
    const top = Math.max(0, document.querySelector("header").getBoundingClientRect().bottom) + 8;
    const bottom = document.querySelector("footer").getBoundingClientRect().height + 12;
    stage.style.setProperty("--layout-top", `${top}px`);
    stage.style.setProperty("--layout-left", `${margin}px`);
    stage.style.setProperty("--layout-width", `${Math.max(1, window.innerWidth - 2 * margin)}px`);
    stage.style.setProperty("--layout-height", `${Math.max(32, window.innerHeight - top - bottom)}px`);
  }
  function geometry(widget) {
    return {width:widget.frame.offsetWidth, height:widget.frame.offsetHeight, areaWidth:stage.clientWidth, areaHeight:stage.clientHeight};
  }
  function place(widget, x, y, bounds = geometry(widget)) {
    const point = {x:clamp(x, 0, bounds.areaWidth - bounds.width), y:clamp(y, 0, bounds.areaHeight - bounds.height)};
    widget.frame.style.left = `${point.x}px`; widget.frame.style.top = `${point.y}px`;
    return point;
  }
  function arrange() {
    if (!current) return;
    sizeStage();
    const bounds = widgets.map(widget => geometry(widget));
    widgets.forEach((widget, index) => {
      const point = current.positions[widget.name];
      place(widget, point.x * bounds[index].areaWidth, point.y * bounds[index].areaHeight, bounds[index]);
    });
  }
  function schedule() {
    if (!current || raf) return;
    raf = requestAnimationFrame(() => { raf = 0; if (!drag) arrange(); });
  }
  function markEditing(value) {
    editing = value;
    document.body.classList.toggle("layout-editing", editing);
    toggle.setAttribute("aria-pressed", String(editing));
    toggle.textContent = editing ? "Layout beenden" : "Layout bearbeiten";
    finish.hidden = !editing;
    for (const widget of widgets) widget.handle.disabled = !editing;
  }
  function apply(layout) {
    cancelDrag();
    current = layout;
    document.body.classList.toggle("layout-free", Boolean(layout));
    for (const widget of widgets) {
      if (layout) {
        if (widget.node.parentElement !== widget.frame) widget.frame.append(widget.node);
        if (widget.frame.parentElement !== stage) stage.append(widget.frame);
      } else {
        widget.marker.after(widget.node);
        widget.frame.remove();
      }
    }
    if (!layout) markEditing(false);
    arrange();
  }
  function restore() {
    try { apply(read()); }
    catch {
      apply(null);
      status("Die gespeicherte Anordnung konnte nicht gelesen werden. Die Standardanordnung wird angezeigt.", true);
    }
  }
  function store(layout) {
    localStorage.setItem(KEY, JSON.stringify(layout));
    current = layout;
    arrange();
  }
  function commitPosition(widget) {
    try {
      let latest;
      try { latest = read(); } catch { latest = null; }
      const bounds = geometry(widget);
      const positions = {...(latest || current).positions};
      positions[widget.name] = {
        x:clamp(parseFloat(widget.frame.style.left) / Math.max(1, bounds.areaWidth), 0, 1),
        y:clamp(parseFloat(widget.frame.style.top) / Math.max(1, bounds.areaHeight), 0, 1)
      };
      store({version:1, positions});
      status("Position lokal gespeichert.");
    } catch {
      restore();
      status("Die Position konnte nicht gespeichert werden. Die zuletzt gespeicherte Anordnung wird angezeigt.", true);
    }
  }
  function raise(widget) { widget.frame.style.zIndex = String(++front); }
  function cancelDrag() {
    if (!drag) return;
    const previous = drag; drag = null;
    previous.widget.frame.classList.remove("is-dragging");
    if (previous.widget.handle.hasPointerCapture(previous.pointerId)) previous.widget.handle.releasePointerCapture(previous.pointerId);
    place(previous.widget, previous.startX, previous.startY);
  }
  function endEditing() {
    cancelDrag(); markEditing(false); arrange(); settings.querySelector("summary").focus();
  }
  function initialPixels(original) {
    const area = stage.getBoundingClientRect();
    const bounds = Object.fromEntries(widgets.map(widget => [widget.name, geometry(widget)]));
    const left = ["clock", "greeting", "goal"];
    const gap = 16;
    const leftWidth = Math.max(...left.map(name => bounds[name].width));
    const leftHeight = left.reduce((sum, name) => sum + bounds[name].height, 0) + gap * 2;
    const rowWidth = leftWidth + 32 + bounds.tasks.width;
    const rowHeight = Math.max(leftHeight, bounds.tasks.height);
    const totalHeight = rowHeight + gap + bounds.links.height;
    if (rowWidth <= area.width && bounds.links.width <= area.width && totalHeight <= area.height) {
      // Seed a readable two-column arrangement if it fits; all later moves stay unrestricted.
      const x = (area.width - Math.max(rowWidth, bounds.links.width)) / 2;
      const y = (area.height - totalHeight) / 2;
      const points = {tasks:{x:x + leftWidth + 32, y}, links:{x, y:y + rowHeight + gap}};
      let nextY = y;
      for (const name of left) { points[name] = {x, y:nextY}; nextY += bounds[name].height + gap; }
      return points;
    }
    return Object.fromEntries(widgets.map((widget, index) => [widget.name, {x:original[index].left - area.left, y:original[index].top - area.top}]));
  }
  function startEditing() {
    if (!current) {
      window.scrollTo(0, 0);
      const original = widgets.map(widget => widget.node.getBoundingClientRect());
      const seed = {version:1, positions:Object.fromEntries(widgets.map(({name}) => [name, {x:0, y:0}]))};
      apply(seed); markEditing(true); sizeStage();
      const area = stage.getBoundingClientRect();
      const pixels = initialPixels(original);
      widgets.forEach(widget => {
        const point = place(widget, pixels[widget.name].x, pixels[widget.name].y);
        seed.positions[widget.name] = {x:point.x / Math.max(1, area.width), y:point.y / Math.max(1, area.height)};
      });
      try { store(seed); }
      catch {
        restore();
        status("Das Layout konnte nicht gespeichert werden. Bitte versuche es erneut.", true);
        return;
      }
    }
    markEditing(true); arrange();
    status("Verschiebe die Widgets an ihrer Griffleiste. „Layout fertig“ beendet die Bearbeitung.");
    settings.open = false; widgets[0].handle.focus();
  }
  for (const widget of widgets) {
    widget.frame.addEventListener("pointerdown", () => raise(widget));
    widget.frame.addEventListener("focusin", () => raise(widget));
    widget.handle.addEventListener("pointerdown", event => {
      if (!editing || !current || event.button !== 0 || !event.isPrimary) return;
      event.preventDefault();
      cancelDrag(); widget.handle.focus(); raise(widget);
      drag = {widget, pointerId:event.pointerId, x:event.clientX, y:event.clientY, startX:parseFloat(widget.frame.style.left) || 0, startY:parseFloat(widget.frame.style.top) || 0};
      widget.frame.classList.add("is-dragging");
      widget.handle.setPointerCapture(event.pointerId);
    });
    widget.handle.addEventListener("pointermove", event => {
      if (!drag || drag.widget !== widget || drag.pointerId !== event.pointerId) return;
      place(widget, drag.startX + event.clientX - drag.x, drag.startY + event.clientY - drag.y);
    });
    widget.handle.addEventListener("pointerup", event => {
      if (!drag || drag.widget !== widget || drag.pointerId !== event.pointerId) return;
      drag = null; widget.frame.classList.remove("is-dragging");
      if (widget.handle.hasPointerCapture(event.pointerId)) widget.handle.releasePointerCapture(event.pointerId);
      commitPosition(widget);
    });
    for (const type of ["pointercancel", "lostpointercapture"]) widget.handle.addEventListener(type, event => {
      if (drag?.widget === widget && drag.pointerId === event.pointerId) cancelDrag();
    });
    widget.handle.addEventListener("keydown", event => {
      if (!editing || !current) return;
      if (event.key === "Escape") {
        event.preventDefault(); if (drag) cancelDrag(); else endEditing(); return;
      }
      if (event.key === "Enter") { event.preventDefault(); endEditing(); return; }
      const directions = {ArrowLeft:[-1,0], ArrowRight:[1,0], ArrowUp:[0,-1], ArrowDown:[0,1]};
      const direction = directions[event.key];
      if (!direction || drag) return;
      event.preventDefault();
      const step = event.shiftKey ? 1 : 10;
      place(widget, parseFloat(widget.frame.style.left) + direction[0] * step, parseFloat(widget.frame.style.top) + direction[1] * step);
      commitPosition(widget);
    });
  }
  toggle.addEventListener("click", () => { if (editing) endEditing(); else startEditing(); });
  finish.addEventListener("click", endEditing);
  document.getElementById("reset-widget-layout").addEventListener("click", () => {
    try {
      localStorage.removeItem(KEY); apply(null);
      status("Die Standardanordnung ist wiederhergestellt. Deine Größen und Inhalte bleiben erhalten.");
    } catch {
      restore(); status("Die Anordnung konnte nicht zurückgesetzt werden. Bitte versuche es erneut.", true);
    }
  });
  window.addEventListener("resize", () => { cancelDrag(); schedule(); });
  window.addEventListener("blur", cancelDrag);
  window.addEventListener("pagehide", () => { cancelDrag(); if (raf) cancelAnimationFrame(raf); raf = 0; });
  window.addEventListener("pageshow", schedule);
  window.addEventListener("storage", event => {
    if (event.key !== KEY && event.key !== null) return;
    status(""); restore();
  });
  document.addEventListener("ruhe-widget-sizes-change", () => { cancelDrag(); schedule(); });
  const observer = new ResizeObserver(schedule);
  for (const widget of widgets) observer.observe(widget.frame);
  observer.observe(document.querySelector("header")); observer.observe(document.querySelector("footer"));
  restore();
})();

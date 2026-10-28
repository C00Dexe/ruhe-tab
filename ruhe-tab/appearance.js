"use strict";

(() => {
  const KEY = "ruhe-tab-appearance-v1";
  const MAX_FILE_BYTES = 1024 * 1024;
  const MAX_DATA_LENGTH = 4 * Math.ceil(MAX_FILE_BYTES / 3) + 32;
  const presets = ["forest", "night", "slate"];
  const buttons = Array.from(document.querySelectorAll("[data-background]"));
  const input = document.getElementById("background-file");
  const panel = document.getElementById("personalization");
  const message = (text) => { document.getElementById("appearance-status").textContent = text; };
  let operation = 0;

  function normalize(value) {
    if (value && presets.includes(value.kind)) return { kind: value.kind };
    if (value?.kind === "image" && typeof value.data === "string" && value.data.length <= MAX_DATA_LENGTH && /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(value.data)) {
      return { kind: "image", data: value.data };
    }
    return { kind: "forest" };
  }
  function read() {
    try { return normalize(JSON.parse(localStorage.getItem(KEY))); }
    catch { message("Hintergrund konnte nicht geladen werden. Wähle ihn bitte erneut."); return { kind: "forest" }; }
  }
  function render(value) {
    document.body.dataset.background = value.kind;
    if (value.kind === "image") document.body.style.setProperty("--user-image", `url("${value.data}")`);
    else document.body.style.removeProperty("--user-image");
    for (const button of buttons) button.setAttribute("aria-pressed", String(button.dataset.background === value.kind));
  }
  function save(value) {
    // Apply only after the write succeeds; retain the previous background on failure.
    try {
      localStorage.setItem(KEY, JSON.stringify(value));
      render(value);
      message(value.kind === "image" ? "Dein Bild ist lokal gespeichert." : "Hintergrund gespeichert.");
    } catch {
      message("Hintergrund konnte nicht gespeichert werden. Der bisherige Hintergrund bleibt erhalten. Versuche ein kleineres Bild.");
    }
  }
  for (const button of buttons) button.addEventListener("click", () => {
    operation++;
    save({ kind: button.dataset.background });
  });
  input.addEventListener("change", async () => {
    const file = input.files[0];
    input.value = "";
    if (!file) return;
    const current = ++operation;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > MAX_FILE_BYTES) {
      message("Bitte wähle JPG, PNG oder WebP mit höchstens 1 MB.");
      return;
    }
    try {
      const data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Lesen fehlgeschlagen"));
        reader.readAsDataURL(file);
      });
      const value = normalize({ kind: "image", data });
      if (value.kind !== "image") throw new Error("Ungültiges Bildformat");
      // Reject corrupt files and exceptionally large pixel dimensions before saving.
      const preview = new Image();
      preview.src = value.data;
      await preview.decode();
      if (preview.naturalWidth > 8192 || preview.naturalHeight > 8192) throw new Error("Bild zu groß");
      if (current === operation) save(value);
    } catch {
      if (current === operation) message("Dieses Bild konnte nicht verwendet werden. Wähle eine andere JPG-, PNG- oder WebP-Datei (maximal 8192 Pixel pro Seite).");
    }
  });
  document.getElementById("close-appearance").addEventListener("click", () => {
    panel.open = false;
    panel.querySelector("summary").focus();
  });
  window.addEventListener("storage", (event) => {
    if (event.key !== KEY && event.key !== null) return;
    operation++;
    render(read());
    message("");
  });
  render(read());
})();

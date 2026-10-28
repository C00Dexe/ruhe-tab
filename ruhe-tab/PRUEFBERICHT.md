# Chrome-Prüfbericht – Version 1.3.0 – 28.10.2026

Die neue Hintergrundspeicherung wurde mit Playwright und Chromium 154 an echten IndexedDB-Transaktionen geprüft. Die Originaldateien liefen über einen ausschließlich lokalen Testserver mit derselben Sicherheitsrichtlinie wie im Manifest. Der Testserver gehört nicht zur Erweiterung.

- Erfolgreich: Farbverläufe bleiben nach Neuladen erhalten; Einstellungen werden in IndexedDB gespeichert.
- Erfolgreich: Gültige PNG-Datei über 1 MB wird angenommen und als WebP-Blob gespeichert. 4000 × 2000 Pixel werden proportional auf 2560 × 1280 Pixel verkleinert.
- Erfolgreich: Hochformat bleibt proportional; kleine Bilder werden nicht vergrößert.
- Erfolgreich: Neuladen liest nur das vorbereitete Bild: keine erneute Größenanpassung oder Kodierung.
- Erfolgreich: Dateien über 10 MB, SVG und beschädigte Bilder werden abgewiesen; das bisherige Bild bleibt gespeichert.
- Erfolgreich: Abgebrochene IndexedDB-Transaktion bestätigt keinen Erfolg und erhält das bisherige Bild.
- Erfolgreich: Andere Tabs übernehmen Änderungen. Wechsel zum Farbverlauf ersetzt den gespeicherten Blob und entfernt die Bild-URL.
- Erfolgreich: Eine neuere Hintergrundauswahl gewinnt gegen eine noch laufende Bildverarbeitung.
- Erfolgreich: Offline-Bedienung und schmale Ansicht erfolgreich; keine externen Anfragen oder unbehandelten JavaScript-Fehler.
- Erfolgreich: Vorhandenes Base64-Bild aus Version 1.2 wird nach erfolgreicher IndexedDB-Übernahme entfernt; Name und Aufgaben bleiben erhalten.
- Erfolgreich: Nicht verfügbarer Datenbankspeicher wird sichtbar gemeldet, ohne Erfolg vorzutäuschen.
- Erfolgreich: JavaScript-Syntaxprüfung mit `node --check`.

Das Browser-Testskript liegt unter `tests/chrome-backgrounds.cjs` und benötigt Playwright sowie Chromium. Optional kann `CHROMIUM_PATH` den Pfad zu einem vorhandenen Chromium vorgeben. Die Testbilder werden lokal im Test erzeugt; es werden keine Bilddienste verwendet.

Gespeichert wird ausschließlich das vorbereitete WebP-Bild als Blob samt Zielabmessungen, maximal 2560 × 1440 Pixel. Proportionale Verkleinerung und Nichtvergrößern kleiner Quellen wurden geprüft. Bei normalen neuen Tabs wird nur der gespeicherte Blob gelesen; eine instrumentierte Prüfung bestätigte, dass dabei kein `createImageBitmap` zum erneuten Aufbereiten ausgeführt wird.

Die IndexedDB-Auswahl wird atomar in einem Eintrag ersetzt. Die Bilddatei entfällt beim Wechsel zu einem Farbverlauf. Blob-URLs werden beim Ersetzen oder Verlassen der Seite freigegeben. Bei der Übernahme einer alten Bildauswahl bleibt der alte Speicher bis zum erfolgreichen Abschluss der neuen Speicherung erhalten. Name und Aufgaben wurden bei diesem Test unverändert wieder angezeigt. `newtab.js` blieb für diese Änderung unverändert.

Die Quellgröße ist auf 10 MiB begrenzt. Unterstützt werden JPG, PNG und WebP mit höchstens 64 Megapixeln und höchstens 16384 Pixeln pro Seite. Die Verarbeitung benötigt einmalig lokalen Speicher und Rechenleistung. Es wurden keine externen Anfragen beobachtet.

Grenze: Das tatsächliche Laden als entpackte Chrome-Erweiterung und Ersetzen der neuen Tab-Seite wurde wegen der Installationsrichtlinie der Testumgebung nicht erneut bestätigt. Der Browser-Test deckt die Originaldateien, Sicherheitsrichtlinie, IndexedDB und Bedienung ab. Die Anleitung enthält den Installationstest in deinem Chrome.

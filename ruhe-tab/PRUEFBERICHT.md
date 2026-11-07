# Chrome-Prüfbericht – Version 1.5.0

Die Originaldateien liefen für die automatisierten Tests mit Playwright und Chromium 154 über einen ausschließlich lokalen Testserver mit der Sicherheitsrichtlinie aus dem Manifest. Der Testserver gehört nicht zur Erweiterung.

## Freie Anordnung

Testskript: `tests/chrome-widget-layout.cjs` (Playwright und Chromium; optional `CHROMIUM_PATH`).

Erfolgreich geprüft:

- Alle fünf Widgets werden in unabhängige verschiebbare Rahmen übernommen. Vorhandene DOM-Knoten, Eingaben und ihre Ereignisbehandlung bleiben erhalten.
- Echte Maus-Pointer-Ereignisse mit Pointer Capture verschieben Widgets. Während des Ziehens bleibt der gespeicherte Datensatz unverändert; erst beim Ablegen wird gespeichert. Escape verwirft einen laufenden Zug.
- Pfeiltasten und die präzise Umschalt-Variante verschieben Widgets. Enter bzw. „Layout fertig“ beendet den Bearbeitungsmodus. Die freie Anordnung bleibt aktiv.
- Speichern und Neuladen stellen die freie Anordnung mit ausgeschalteter Bearbeitung wieder her. Textfelder, Aufgaben und Webseiten-Verknüpfungen bleiben nutzbar.
- Frames bleiben bei 320, 390, 800 und 1440 Pixeln Fensterbreite, bei Größenänderungen und bei zusätzlichem Aufgabeninhalt innerhalb des Arbeitsbereichs. Fensteränderungen überschreiben keine gespeicherten Koordinaten.
- Geöffnete Tabs übernehmen gespeicherte Positionsänderungen und das Zurücksetzen. Reset der Anordnung bewahrt Widgetgrößen, Name, Tagesziel, Aufgaben und Webseiten.
- Simulierte fehlgeschlagene Schreibzugriffe stellen die zuletzt gespeicherte Anordnung wieder her und melden den Fehler auch bei geschlossenem Anpassungsfeld. Beschädigte gespeicherte Layoutdaten fallen auf die Standardanordnung zurück.
- Touch-Verschieben mit tatsächlich ausgelösten Touch-/Pointer-Ereignissen funktioniert.
- Eine instrumentierte Prüfung beobachtete während der Ruhephase keine fortlaufende JavaScript-Animationsschleife.
- Offline-Bedienung funktioniert. Während der Bedienprüfung wurden keine externen Anfragen oder unbehandelten JavaScript-Fehler beobachtet.

Die Darstellung im freien Modus, beim Bearbeiten sowie in einem schmalen Fenster wurde zusätzlich visuell geprüft. Überlappungen sind absichtlich zulässig. Rahmen lassen sich durch Anklicken oder Tastaturfokus nach vorne holen. Zu hohe Widgets sind innen scrollbar. Bei erstmaliger Aktivierung wird, wenn ausreichend Platz vorhanden ist, eine lesbare Startanordnung gewählt; spätere Züge sind frei.

Die Anordnung wird separat unter `ruhe-tab-widget-layout-v1` in localStorage gespeichert. Die Positionen sind relativ zum verfügbaren Arbeitsbereich. Die Umsetzung verwendet Pointer Events, ResizeObserver und ereignisgesteuerte Layoutaktualisierungen. Es gibt keine zusätzliche regelmäßige Abfrage, keine neuen Berechtigungen und keinen Hintergrundprozess.

## Bestehende Funktionen

`tests/chrome-widget-sizes.cjs` wurde erneut erfolgreich ausgeführt: fünf unabhängige Größenregler, Vorschau, Speicherung, Tastaturbedienung, Abgleich zwischen Tabs, Zurücksetzen, Fehlerfälle und Anordnung bei 75/150 Prozent sowie 320–1440 Pixeln Fensterbreite im Standardlayout.

`tests/chrome-backgrounds.cjs` wurde erneut erfolgreich ausgeführt: echte IndexedDB-Speicherung, proportionale Bildanpassung, Neuladen ohne erneute Bildverarbeitung, Übernahme alter Bilder, Abgleich zwischen Tabs, Offline-Bedienung und Fehlerfälle.

JavaScript-Syntax und HTML-Struktur wurden zusätzlich geprüft: eindeutige IDs, alle Skripte vorhanden. Die Inhalte- und Hintergrundlogik in `newtab.js` und `appearance.js` blieb unverändert.

## Grenze der Prüfung

Die verwaltete Chromium-Installation blockiert eigene Erweiterungen über eine Installationsrichtlinie. Das tatsächliche Laden als entpackte Chrome-Erweiterung und Ersetzen der neuen Tab-Seite wurde deshalb hier nicht erneut bestätigt. Die Tests decken die Originaldateien, Sicherheitsrichtlinie, browserseitige Speicher und Bedienung ab. Die Anleitung enthält den Installationstest in deinem Chrome.

# Ruhe Tab für Firefox (Desktop, ab Version 140)

Uhrzeit, Begrüßung, Tagesziel, Aufgabenliste, zwölf eigene Webseiten-Verknüpfungen und kompakte aufklappbare Einstellungen. Die mitgelieferten HTML-, CSS- und JavaScript-Dateien entsprechen der Chrome-Version 1.1.0. Lediglich das Manifest ist für Firefox ergänzt.

## Herunterladen und vorübergehend installieren

1. Melde dich bei GitHub an und lade im Repository über **Code → Download ZIP** die aktuelle ZIP-Datei herunter.
2. Entpacke `ruhe-tab-main.zip`.
3. Öffne Firefox und gib `about:debugging#/runtime/this-firefox` in die Adressleiste ein.
4. Klicke auf **Temporäres Add-on laden…** (je nach Sprache „Load Temporary Add-on“).
5. Wähle im entpackten Ordner `ruhe-tab-main` den Unterordner **ruhe-tab-firefox** und darin **manifest.json** aus.
6. Öffne mit Strg+T (Mac: Cmd+T) einen neuen Tab. Falls Firefox nachfragt, bestätige, dass Ruhe Tab deine neue Tab-Seite bleiben soll.

Wähle für Firefox den Ordner `ruhe-tab-firefox`; der Ordner `ruhe-tab` enthält die Chrome-Version. Andere Erweiterungen für neue Tabs können die Auswahl beeinflussen. Eine Organisation kann eigene Add-ons über Browserrichtlinien verhindern.

**Diese Installation endet beim Neustart von Firefox.** Danach musst du die Schritte 3–5 wiederholen. Behandle diesen Entwicklungsmodus nicht als dauerhafte Installation oder verlässliche Datensicherung. Daten können beim Entladen oder Entfernen verloren gehen. Die feste Add-on-ID hilft bei der Identifikation, ersetzt aber keine Signierung.

## Dauerhafte Installation

Der normale Firefox verlangt für dauerhaft installierte Add-ons eine Mozilla-Signatur. Das Repository enthält zunächst eine **unsignierte Entwicklungsversion**, keine installierbare signierte XPI. Eine ZIP lediglich in `.xpi` umzubenennen ersetzt keine Signierung.

Für eine dauerhafte private Verteilung:

1. Erstelle ein kostenloses Entwicklerkonto auf https://addons.mozilla.org/developers/.
2. Packe die Dateien **innerhalb** von `ruhe-tab-firefox` als ZIP. Im Archiv muss `manifest.json` direkt auf oberster Ebene liegen, ohne umgebenden Ordner.
3. Reiche dieses Paket im Mozilla-Entwicklerportal für die eigene Verteilung („On your own“ / nicht gelistet) ein. Für die Datenschutzerklärung kannst du die Angaben weiter unten verwenden; beantworte die Portalfragen entsprechend dem tatsächlichen Code.
4. Nach erfolgreicher Prüfung/Signierung erhältst du eine signierte `.xpi`. Öffne in Firefox `about:addons`, klicke auf das Zahnrad und wähle „Add-on aus Datei installieren…“.

Es wurde nichts bei Mozilla eingereicht oder veröffentlicht. Die Signierung wird vom Mozilla-Konto des Eigentümers durchgeführt; ihre Freigabe kann nicht im Voraus garantiert werden. Der laufende Erweiterungscode benötigt anschließend keinen eigenen Server.

## Verwendung

- **Einstellungen** unten links öffnet das Feld für deinen Namen. Ein leerer gespeicherter Name entfernt ihn. Erneuter Klick, Außenklick oder Escape klappt das Feld zu.
- Tagesziel eingeben und mit Enter oder ↵ speichern. Das Kästchen markiert es als erledigt. Beim lokalen Tageswechsel wird das Ziel geleert.
- Aufgaben mit Enter oder + hinzufügen, abhaken und mit × löschen. Maximal 50 Aufgaben; sie bleiben über Tageswechsel erhalten.
- Unter **Deine Webseiten → + Verknüpfung hinzufügen** Namen und HTTP(S)-Adresse speichern. Fehlendes `https://` wird ergänzt. Eine Kachel öffnet die Seite im selben Tab; **Bearbeiten → ×** entfernt sie. Maximal zwölf Verknüpfungen.
- Es gibt keinen automatischen Chrome-Import oder Austausch zwischen Browserprofilen. Daten aus Chrome werden nicht übertragen.

## Datenschutz und Technik

Alle Eingaben werden unter `ruhe-tab-v1` in `localStorage` des Firefox-Erweiterungsprofils gespeichert. Keine Synchronisierung, Konten, Analyse, Werbung, externen Schriftarten oder Bilder. Verknüpfungen erhalten lokal erzeugte Buchstaben-Symbole. Erst beim Anklicken einer Kachel öffnet Firefox die gewählte Webseite und lädt deren Inhalte.

Das Manifest fordert keine zusätzlichen API- oder Webseitenberechtigungen an. Es gibt keinen Zugriff auf den Verlauf oder die Firefox-Lesezeichen und keinen Hintergrundprozess. Eine strenge Sicherheitsrichtlinie blockiert externe Verbindungen aus der Erweiterungsseite. `data_collection_permissions.required: ["none"]` erklärt Firefox, dass die Erweiterung keine Daten sammelt oder überträgt. Die Uhr läuft nur bei sichtbarer Seite einmal pro Minute.

Der Speicher enthält Klartext und keine verschlüsselte Sicherung. Er ist ungeeignet für Geheimnisse. Entfernen der Erweiterung oder des Profils kann Daten löschen.

## Aktualisieren und testen

Ersetze die Dateien im gleichen Firefox-Ordner, schließe alte Ruhe-Tabs und klicke auf der Add-on-Karte unter `about:debugging` auf „Neu laden“. Eine dauerhaft signierte Installation wird mit einem neuen signierten Paket derselben Add-on-ID aktualisiert; es ist kein automatischer Update-Dienst eingerichtet.

Prüfe Uhrzeit, Name, Tagesziel und Aufgaben. Lade den Tab neu: Eingaben sollen noch vorhanden sein. Lege eine Webseiten-Verknüpfung an und teste sie. Trenne zum Prüfen der lokalen Bedienung die Internetverbindung: Die neue Tab-Seite und Eingaben funktionieren weiter, externe Webseiten lassen sich ohne Netz natürlich nicht laden.

## Mozilla-Dokumentation

- Temporäre Installation: https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/
- Signierung und Verteilung: https://extensionworkshop.com/documentation/publish/signing-and-distribution-overview/
- Browserkonfiguration: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings

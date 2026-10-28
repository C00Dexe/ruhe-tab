# Ruhe Tab 2 für Firefox

## Installation

Lade [die XPI](../downloads/ruhe-tab-firefox-2.0.0.xpi?raw=true) herunter. In diesem privaten Repository musst du bei GitHub angemeldet sein. Falls nötig, öffne die Datei auf GitHub und klicke auf das Download-Symbol („Download raw file“). Alternativ **Code → Download ZIP**, entpacken und die XPI im Ordner `downloads` verwenden.

**Zum Testen in Firefox:** `about:debugging#/runtime/this-firefox` öffnen, „Temporäres Add-on laden…“ anklicken, XPI auswählen und einen neuen Tab öffnen. Ohne XPI funktioniert auch `ruhe-tab-firefox/manifest.json` aus dem entpackten Repository. Diese temporäre Installation endet beim Neustart.

**Dauerhaft unsigniert in Developer Edition/Nightly/geeignetem ESR:** In `about:config` `xpinstall.signatures.required` auf `false` setzen. In `about:addons` über das Zahnrad „Add-on aus Datei installieren…“ wählen und die XPI öffnen. Die Signaturpflicht wird damit für alle Add-ons dieses Entwicklerprofils abgeschaltet. Die feste Add-on-ID ist im Manifest enthalten. Die Installation bleibt über Neustarts erhalten.

Der normale Firefox-Release unterstützt temporäres Laden, verlangt für dauerhafte Add-ons aber eine Mozilla-Signatur. Die enthaltene XPI ist unsigniert. Das Projekt wurde nicht bei Mozilla eingereicht. Für eine Signierung zur eigenen Verteilung kann dieselbe XPI beim [Mozilla Developer Hub](https://addons.mozilla.org/developers/) als nicht gelistetes Add-on eingereicht werden.

Firefox Desktop ab Version 140 ist vorgesehen. Firefox für Android wird nicht als Neue-Tab-Ersatz unterstützt. Eine von einer Organisation verwaltete Installation kann zusätzliche Regeln haben.

## Verwendung

Uhrzeit und Datum verwenden die lokale Rechnerzeit im deutschen 24-Stunden-Format. Unter „Einstellungen“ unten links speicherst du einen Namen. Leeres Speichern entfernt ihn. Das kleine Feld klappt per erneutem Klick, Außenklick oder Escape zu.

Das Tagesziel wird mit Enter oder ↵ gespeichert, per Kästchen erledigt und beim nächsten lokalen Tageswechsel nicht mehr angezeigt. Für eine Änderung Text bearbeiten und erneut speichern; ein leerer Text entfernt das Ziel. Aufgaben bleiben über Tageswechsel erhalten. Du kannst bis zu 50 Aufgaben hinzufügen, abhaken und mit × löschen.

Über „+ Verknüpfung hinzufügen“ speicherst du bis zu zwölf Webseiten. Ohne Schema wird `https://` ergänzt. Unterstützt sind HTTP und HTTPS ohne eingebettete Zugangsdaten. Eine Kachel öffnet die Webseite im selben Tab. Unter „Bearbeiten“ erscheinen die ×-Schaltflächen zum Löschen. Es gibt keinen Zugriff auf deine vorhandenen Firefox-Lesezeichen oder meistbesuchten Seiten.

## Speicher und Datenschutz

Name, Ziel, Aufgaben und Links liegen ausschließlich in `browser.storage.local` im Firefox-Profil. Die Berechtigung „storage“ ist dafür nötig. Kein `storage.sync`, keine Server, Konten, Onlinebilder, Schrift-Downloads, Analysewerkzeuge oder Hintergrundprozesse. Die Uhr stellt bei verborgenem Tab ihren Timer ein.

Beim Anzeigen und Bearbeiten werden keine Webseiten kontaktiert. Erst wenn du auf eine Kachel klickst, öffnet Firefox deren Adresse und lädt die gewählte Webseite. Diese Webseiten und Firefox selbst haben ihr eigenes Netzwerkverhalten.

Die Daten sind nicht verschlüsselt. Es gibt keine automatische Sicherung. Die Deinstallation oder das Löschen des Firefox-Profils kann sie entfernen; auch temporäre Add-ons eignen sich nicht als dauerhafte Datenablage.

Wenn du im selben Firefox-Profil auf Version 2 aktualisierst, werden noch vorhandene lokale Daten der alten Firefox-Version beim ersten Start übernommen. Dafür bleibt die ID `ruhe-tab@c00dexe` erhalten. Der alte Speicher wird nicht gelöscht. Chrome-Daten werden nicht übertragen.

## Eigener Funktionstest

1. Öffne einen neuen Tab und prüfe Datum und Uhrzeit.
2. Speichere einen Namen und ein Tagesziel; füge eine Aufgabe und eine Webseiten-Verknüpfung hinzu.
3. Lade den Tab neu. Die Daten sollen weiterhin angezeigt werden.
4. Öffne einen zweiten Tab und ändere eine Aufgabe. Die Änderung soll im ersten Tab erscheinen, ohne einen dort noch nicht gespeicherten Zielentwurf zu löschen.
5. Klappe die Einstellungen auf und zu. Die Hauptinhalte sollen an ihrer Position bleiben.
6. Trenne das Netz: Aufgaben und Verknüpfungen lassen sich weiterhin speichern. Externe Webseiten brauchen zum Öffnen natürlich eine Verbindung.
7. Bei dauerhafter Installation: Starte Firefox neu und prüfe Add-on und Daten erneut. Bei temporärer Installation musst du das Add-on erneut laden.

## Änderungen am Code

HTML, CSS und JavaScript-Module sind direkt lesbar und benötigen zum Ausführen keine Zusatzprogramme. Unter `about:debugging` kannst du eine temporäre Installation nach Änderungen neu laden. Mit `python3 tools/package-firefox.py` im Projektordner entsteht aus den aktuellen Dateien eine neue XPI. Ein neues Paket installierst du mit derselben ID als Aktualisierung; für eine signierte Installation muss auch das Update signiert sein.

Dokumentation: [Temporäre Installation](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/), [Signierung und Entwickler-Versionen](https://extensionworkshop.com/documentation/publish/signing-and-distribution-overview/).

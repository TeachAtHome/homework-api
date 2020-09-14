# HomeWork API

![HomeWork Logo](docs/logo.png "HomeWork Logo")
x

## Was ist HomeWork

HomeWork ist eine Plattform zur Verwaltung von Hausaufgaben.

Lehrer können Hausaufgaben erstellen, die eingereichten Lösungen ihrer Schüler einsehen und Feedback geben. Und was ist mit den Schülern?

Schüler werden über neue Hausaufgaben informiert, können ihre Aufgaben digital einreichen und einen Grund für eine verspätete Abgabe hinterlegen.

Welche Möglichkeiten haben Eltern / Verantwortliche? Sie können Abgabetermine einsehen und die Meldung des Verspätungsgrundes bestätigen.

## Prozesse

1. Ein Lehrere kann Dokumente für eine Klasse hochladen
2. Schüler bekommen eine Mail, wenn ein neues Dokument in ihrer Klasse
3. Texte und Bilder können abgelegt werden
4. Zusätzliche Dokumente können heruntergeladen/hochgeladen werden
5. Für jede Aufgabe gibt es ein Antwortfeld + eine Möglichkeit zusätzliche Dateien hochzuladen
6. Der Lehrer kann zu allen eingereichten Aufgaben den Schülern Feedback mitteilen
7. Die Schüler können sich das Feedback anschauen

## Login / Registrierung

- <https://flaviocopes.com/express-sessions/>
- <http://www.passportjs.org/docs/>

## Entwicklung

### Docker

Das vollständige docker-compose Setup erstellt ein node Image und verwendet
ein fertiges MongoDB Image.
Es ist nicht notwendig das Node Image für die Entwicklung zu bauen.

Folgende Kommandos sind für die Entwicklung notwendig:

Aufsetzen der MongoDB:

- `docker-compose up mongo` - Startet eine mongodb (auf port 27017).

- (Falls nicht bereits ausgeführt) `npm install` - Installiert die Abhängigkeiten.

Start des Backends im Typescript Development Modus:

- `npm start`

Kompilieren und starten des kompilierten Backends:

- `npm run compile` - Kompilert die Typescript Applikation zu einer JavaScript Applikation
- `node build/index.js` - Startet die kompilierte JavaScript Applikation

#### Ohne Docker

Damit die mongodb gemockt wird, muss die Umgebungsvariable "DBMOCK" gesetzt
werden (der Wert ist egal).

#### Beispiel Daten

Das bash script `fill_example_data.sh` sendet über die REST API und curl erste
Beispieldaten in das Backend.

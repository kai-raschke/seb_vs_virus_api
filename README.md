
# seb_vs_virus_api

*Anwendung ist in TYPESCRIPT geschrieben.
Vorhandene kompilierte JS Scripte liegen nur für Heroku bereits vor.*

## Frontend

https://github.com/sebsebli/infectiontracker

## Installation

```
npm install
```
## Requirements

- NodeJS >= 10
- Postgres Datenbank

## Basics

Starte die API
 ``` npm start ```
 
Swagger: https://app.swaggerhub.com/apis/kai-raschke/seb_vs_virus_api/1.0.0

ERM: https://dbdiagram.io/d/5e75790c4495b02c3b888bc6

## Logging

Anwendungslogs werden an sematext übertragen.
Falls kein eigenes Log token verfügbar ist, kann in /lib/log.ts der Logsense transporter durch den Konsolen Log ausgetauscht werden.

```
// new winston.transports.Console(),
new Logsene({
   token: process.env.LOGS_TOKEN,
   level: 'info',
   type: 'test_logs',
   url: 'https://logsene-receiver.eu.sematext.com/_bulk'
})
```
zu 
```
new winston.transports.Console(),
// new Logsene({
//   token: process.env.LOGS_TOKEN,
//   level: 'info',
//   type: 'test_logs',
//   url: 'https://logsene-receiver.eu.sematext.com/_bulk'
// })
```

## App Config

Die Anwendung ist in erster Linie für PM2 als Prozessmanager angelegt.
Für die Benutzung in Heroku müssen dort die Umgebungsvariablen hinterlegt werden.

| ENV | VALUE | DESC |
|--|--| -- |
| NODE_ENV | 'development' | regular NODE_ENV |
| PORT | 3003 | App Port |
| db_host | 'localhost' | IP/DNS for postgres DB |
| db_port | 5432 | DB port |
| db_name | 'seb_vs_virus' | DB name
| db_user | 'postgres' | DB user name
| db_pass | '' | DB pass |
| db_dialect| 'postgres' | DB dialect for sequelize
| LOGS_TOKEN | 'sematext-token' | Log token von sematext |
| forceSync | false | Force sequelize to resync db (alias drop all) |


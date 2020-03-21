
# seb_vs_virus_api

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

## App Config

Die Anwendung ist in erster Linie für PM2 als Prozessmanager angelegt.
Für die Benutzung in Heroku müssen dort die Umgebungsvariablen hinterlegt werden.

| ENV | VALUE | DESC |
|--|--| -- |
| NODE_ENV | 'development' | regular NODE_ENV |
| PORT | 3003 | App Port |
| logs_console | true | Log in console |
| logs_consoleLevel | 'info' | Log Level for Console |
| logs_file | true | Log in file |
| logs_fileLevel | 'info' | Log level for file logging |
| logs_filePath | null | Log file path |
| logs_db | false | Log for database requests |
| logs_dbLevel | 'warn' | Log level for db requests |
| db_host | 'localhost' | IP/DNS for postgres DB |
| db_port | 5432 | DB port |
| db_name | 'seb_vs_virus' | DB name
| db_user | 'postgres' | DB user name
| db_pass | '' | DB pass |
| db_dialect| 'postgres' | DB dialect for sequelize
| forceSync | false | Force sequelize to resync db (alias drop all) |


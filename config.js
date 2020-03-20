"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const Config = {
    app: {
        port: (Number.isNaN(Number.parseInt(process.env.PORT)) ? 3003 : Number.parseInt(process.env.PORT)),
        env: process.env.NODE_ENV || 'development'
    },
    logs: {
        console: (process.env.logs_console === "true" ? true : false),
        consoleLevel: process.env.logs_consoleLevel || 'info',
        file: (process.env.file === "true" ? true : false),
        fileLevel: process.env.logs_fileLevel || 'warn',
        filePath: (process.env.logs_filePath ?
            path.join(process.env.logs_filePath, 'logs', 'log_events.log') :
            path.join(__dirname, 'logs', 'log_events.log')),
        db: (process.env.db === "true" ? true : false),
        dbLevel: process.env.logs_dbLevel || 'warn'
    },
    db: {
        dbUrl: process.env.DATABASE_URL,
        host: process.env.db_host || 'localhost',
        port: (Number.isNaN(Number.parseInt(process.env.db_port)) ? 5432 : Number.parseInt(process.env.db_port)),
        name: process.env.db_name || 'cargo7_auftrag',
        user: process.env.db_user || 'postgres',
        pass: process.env.db_pass || '',
        dialect: 'postgres'
    }
};
exports.Config = Config;
//# sourceMappingURL=config.js.map
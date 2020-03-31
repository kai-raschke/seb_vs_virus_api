import * as path from "path";
import {Dialect} from "sequelize";

export interface IConfig {
    app: AppConfig;
    logs: LogsConfig;
    db: DatabaseConfig;
}

interface AppConfig {
    port: number
    // @ts-ignore
    env: process.env.NODE_ENV | 'development'
}

interface LogsConfig {
    console: boolean,
    consoleLevel: string
    file: boolean,
    fileLevel: string,
    filePath: string
    db: boolean,
    dbLevel: string
}

interface DatabaseConfig {
    dbUrl: string,
    host: string,
    port: number,
    name: string,
    user: string,
    pass: string,
    dialect: Dialect
}

const Config: IConfig = {
    app: {
        port: ( Number.isNaN(Number.parseInt(process.env.PORT)) ? 3003 : Number.parseInt(process.env.PORT) ),
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
        port: ( Number.isNaN(Number.parseInt(process.env.db_port)) ? 5432 : Number.parseInt(process.env.db_port) ),
        name: process.env.db_name || 'seb_vs_virus',
        user: process.env.db_user || 'postgres',
        pass: process.env.db_pass || '',
        dialect: 'postgres'
    }
};

export { Config };

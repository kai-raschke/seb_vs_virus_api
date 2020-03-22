import * as path from "path";
import { mkdirSync } from "fs";

const winston = require('winston');
const Logsene = require('winston-logsene');

import { Config, IConfig } from '../config';

function buildLog(conf: IConfig){
    let logger;
    if(conf.logs){
        logger = winston.createLogger({
            level: 'info',
            transports: [
                // new winston.transports.Console(),
                new Logsene({
                    token: process.env.LOGS_TOKEN,
                    level: 'info',
                    type: 'test_logs',
                    url: 'https://logsene-receiver.eu.sematext.com/_bulk'
                })
            ]
        });
    }

    return logger;
}
let log = buildLog(Config);

export { log };

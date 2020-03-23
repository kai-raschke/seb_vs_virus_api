import * as path from "path";
import { mkdirSync } from "fs";

const winston = require('winston');
const Logsene = require('winston-logsene');

import { Config, IConfig } from '../config';

function buildLog(conf: IConfig){
    let logger;
    if(conf.logs){
        let transports = [];

        if(process.env.LOGS_TOKEN) {
            transports.push(
                new Logsene({
                    token: process.env.LOGS_TOKEN,
                    level: 'info',
                    type: 'test_logs',
                    url: 'https://logsene-receiver.eu.sematext.com/_bulk'
                })
            );
        }
        else {
            transports.push(new winston.transports.Console())
        }
        logger = winston.createLogger({
            level: 'info',
            transports
        });
    }

    return logger;
}
let log = buildLog(Config);

export { log };

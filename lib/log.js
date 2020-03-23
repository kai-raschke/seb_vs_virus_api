"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require('winston');
const Logsene = require('winston-logsene');
const config_1 = require("../config");
function buildLog(conf) {
    let logger;
    if (conf.logs) {
        let transports = [];
        if (process.env.LOGS_TOKEN) {
            transports.push(new Logsene({
                token: process.env.LOGS_TOKEN,
                level: 'info',
                type: 'test_logs',
                url: 'https://logsene-receiver.eu.sematext.com/_bulk'
            }));
        }
        else {
            transports.push(new winston.transports.Console());
        }
        logger = winston.createLogger({
            level: 'info',
            transports
        });
    }
    return logger;
}
let log = buildLog(config_1.Config);
exports.log = log;
//# sourceMappingURL=log.js.map
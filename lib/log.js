"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs_1 = require("fs");
const bunyan = require("bunyan");
const config_1 = require("../config");
function buildLog(conf) {
    let logger, streams = [];
    if (conf.logs) {
        if (conf.logs.console && process.env.NODE_ENV !== 'test') {
            streams.push({
                name: 'stdout',
                stream: process.stdout
            }, {
                name: 'stderr',
                stream: process.stderr,
                level: 'error'
            });
        }
        if (conf.logs.file) {
            let logPath = path.join('/..', (conf.logs.filePath));
            try {
                fs_1.mkdirSync(logPath);
            }
            catch (ex) {
            }
            streams.push({
                type: 'rotating-file',
                path: path.join(logPath),
                period: '1h',
                count: 10
            });
        }
        logger = bunyan.createLogger({
            name: ('log'),
            streams,
            serializers: bunyan.stdSerializers
        });
    }
    return logger;
}
let log = buildLog(config_1.Config);
exports.log = log;
//# sourceMappingURL=log.js.map
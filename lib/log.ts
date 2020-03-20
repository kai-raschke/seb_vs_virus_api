import * as path from "path";
import { mkdirSync } from "fs";

import * as bunyan from 'bunyan';

import { Config, IConfig } from '../config';

function buildLog(conf: IConfig){
    let logger, streams  = [];
    if(conf.logs){

        //Log Modi aktivieren
        if(conf.logs.console && process.env.NODE_ENV !== 'test'){
            streams.push(
                {
                    name: 'stdout',
                    stream: process.stdout
                },
                {
                    name: 'stderr',
                    stream: process.stderr,
                    level: 'error'
                }
            );
        }
        if(conf.logs.file) {
            let logPath = path.join('/..', (conf.logs.filePath));
            try{
                mkdirSync(logPath);
            }
            catch(ex){
                //probably already exists
            }

            streams.push({
                type: 'rotating-file',
                path: path.join(logPath),
                period: '1h',   // half-daily rotation
                count: 10        // keep 10 back copies
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
let log = buildLog(Config);

export { log };

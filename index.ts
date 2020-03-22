'use strict';

import * as path from "path";

// If app is not started by pm2, load app.json instead
if(!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development'; // dev is standard
    try {
        let appJson = require(path.resolve(__dirname) + path.sep + 'app.json');
        let env = appJson.apps[0].env;
        console.log(env);
        process.env = Object.assign(process.env, env);
    } catch(ex){ console.log(ex); }
}

import { Config } from "./config";

import * as Koa from 'koa';
import * as IO from 'koa-socket-2';

// Loads app dependencies
import { log } from './lib/log';
import { Data } from './lib/db';
import { init } from './lib/seed';
import server from './server';

let     app     = new Koa(),
        io      = new IO();

/**
 * Initializes a new server.
 */
async function startFunction() {
    // Sync database with sequelize (may force drop all if you wish - see docs)
    await Data.db.sync(
        { force: (process.env.forceSync == 'true' ? true : false) } // Reset database on start || no config means demo mode (reset always)
    );

    // Seeds data
    await init();

    // Error catching - override koa's undocumented error handler
    app.context.onerror = function onError(err) {
        if (!err) return;
        log.error(err);
    };

    // Error logging
    app.on('error', (err, ctx = {}) => {
        const errorDetails = {
            status: ctx.status,
            error: err.message,
            stack: err.stack,
            err,
        };
        const url = typeof ctx.request !== 'undefined' ? ctx.request.url : '';
        log.error('error ' + url + ' ' + errorDetails);
    });

    // Websocket if wanted
    // io.attach(app);
    // Websocket Routes
    // ...

    server(app);

    const PORT = Config.app.port;
    log.info(`Starting server on http://localhost:${PORT}`);
    app.listen(PORT);
}

startFunction().catch(err => {
    log.error(err);
});

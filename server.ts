'use strict';

import Application, {Context} from "koa";
import * as bodyParser from 'koa-body';
import * as ratelimit from 'koa-ratelimit';

import { log } from './lib/log';

import { infoRouter } from "./routes/InfoRouter";
import { actionRouter } from "./routes/ActionRouter";

const db = new Map();

export default function server (app: Application) {
    // API response time
    app.use(async (ctx: Context, next: Function) => {
        const start: number = Date.now();
        await next(); //
        const delta: number = Math.ceil(Date.now() - start);
        ctx.set('X-Response-Time', delta + 'ms');
    });

    // Rate limit the API (maybe malicious user) / 100 requests per IP per Minute
    app.use(ratelimit({
        driver: 'memory',
        db: db,
        duration: 60000,
        errorMessage: 'Hey, please slow down a little.',
        id: (ctx) => ctx.ip,
        headers: {
            remaining: 'Rate-Limit-Remaining',
            reset: 'Rate-Limit-Reset',
            total: 'Rate-Limit-Total'
        },
        max: 100,
        disableHeader: false
    }));

    app.use(bodyParser());

    app.use(infoRouter.routes());
    app.use(actionRouter.routes());
}

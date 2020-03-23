import * as Router from 'koa-router';
import {Context} from "koa";

/**
 * Root routes: just return the API name.
 */
export const authorityRouter = new Router()
    .get('/secret', async function(ctx: Context) {
        ctx.body = "secret";
    });

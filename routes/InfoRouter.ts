import * as Router from 'koa-router';
import { info } from "../controller/InfoCtrl";

/**
 * Root routes: just return the API name.
 */
export const infoRouter = new Router()
    .get('/info', info);

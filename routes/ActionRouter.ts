import * as Router from 'koa-router';
import {check, connect, register, status} from "../controller/ActionCtrl";

/**
 * Root routes: just return the API name.
 */
export const actionRouter = new Router()
    .post('/register', register)
    .post('/status', status)
    .post('/connect', connect)
    .post('/check', check);

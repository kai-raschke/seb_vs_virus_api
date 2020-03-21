import * as Router from 'koa-router';
import {check, connect, groupAlive, joinGroup, register, registerGroup, status} from "../controller/ActionCtrl";

/**
 * Root routes: just return the API name.
 */
export const actionRouter = new Router()
    .post('/register', register)
    .post('/group', registerGroup)
    .post('/join', joinGroup)
    .post('/groupalive', groupAlive)
    .post('/status', status)
    .post('/connect', connect)
    .post('/check', check);

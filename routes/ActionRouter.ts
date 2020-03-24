import * as Router from 'koa-router';
import {
    alias,
    check,
    connect,
    count, errorLog,
    groupAlive,
    joinGroup,
    register,
    registerGroup,
    status,
    statusBOS
} from "../controller/ActionCtrl";

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
    .post('/check', check)
    .post('/alias', alias)
    .post('/count', count)
    .post('/errorlog', errorLog)
    .post('/statusBOS', statusBOS);

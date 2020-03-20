"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const ActionCtrl_1 = require("../controller/ActionCtrl");
exports.actionRouter = new Router()
    .post('/register', ActionCtrl_1.register)
    .post('/group', ActionCtrl_1.registerGroup)
    .post('/join', ActionCtrl_1.joinGroup)
    .post('/status', ActionCtrl_1.status)
    .post('/connect', ActionCtrl_1.connect)
    .post('/check', ActionCtrl_1.check);
//# sourceMappingURL=ActionRouter.js.map
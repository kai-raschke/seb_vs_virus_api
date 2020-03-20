"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const InfoCtrl_1 = require("../controller/InfoCtrl");
exports.infoRouter = new Router()
    .get('/info', InfoCtrl_1.info);
//# sourceMappingURL=InfoRouter.js.map
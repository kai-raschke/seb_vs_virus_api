'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("koa-body");
const ratelimit = require("koa-ratelimit");
const InfoRouter_1 = require("./routes/InfoRouter");
const ActionRouter_1 = require("./routes/ActionRouter");
const db = new Map();
function server(app) {
    app.use((ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const start = Date.now();
        yield next();
        const delta = Math.ceil(Date.now() - start);
        ctx.set('X-Response-Time', delta + 'ms');
    }));
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
        max: 200,
        disableHeader: false
    }));
    app.use(bodyParser());
    app.use(InfoRouter_1.infoRouter.routes());
    app.use(ActionRouter_1.actionRouter.routes());
}
exports.default = server;
//# sourceMappingURL=server.js.map
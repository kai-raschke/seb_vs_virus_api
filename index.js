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
const path = require("path");
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
    try {
        let appJson = require(path.resolve(__dirname) + path.sep + 'app.json');
        let env = appJson.apps[0].env;
        console.log(env);
        process.env = Object.assign(process.env, env);
    }
    catch (ex) {
        console.log(ex);
    }
}
const config_1 = require("./config");
const Koa = require("koa");
const IO = require("koa-socket-2");
const log_1 = require("./lib/log");
const db_1 = require("./lib/db");
const seed_1 = require("./lib/seed");
const server_1 = require("./server");
let app = new Koa(), io = new IO();
function startFunction() {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.Data.db.sync({ force: process.env.forceSync || true });
        yield seed_1.init();
        app.context.onerror = function onError(err) {
            if (!err)
                return;
            log_1.log.error(err);
        };
        app.on('error', (err, ctx = {}) => {
            const errorDetails = {
                status: ctx.status,
                error: err.message,
                stack: err.stack,
                err,
            };
            const url = typeof ctx.request !== 'undefined' ? ctx.request.url : '';
            log_1.log.error('error ' + url + ' ' + errorDetails);
        });
        io.attach(app);
        server_1.default(app);
        const PORT = config_1.Config.app.port;
        log_1.log.info(`Starting server on http://localhost:${PORT}`);
        app.listen(PORT);
    });
}
startFunction().catch(err => {
    log_1.log.error(err);
});
//# sourceMappingURL=index.js.map
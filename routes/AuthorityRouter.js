"use strict";
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
const Router = require("koa-router");
const db_1 = require("../lib/db");
const log_1 = require("../lib/log");
const util_1 = require("../lib/util");
exports.authorityRouter = new Router()
    .get('/secret', function (ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        ctx.body = "secret";
    });
})
    .post('/authState', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let { uid, status } = ctx.request.body;
    let aid = ctx.state.user.dbid;
    let exists = null;
    let alias, loops = 0;
    do {
        alias = util_1.createAlias();
        loops++;
        exists = yield db_1.Data.Entry.findOne({
            where: {
                alias
            }
        });
    } while (exists && loops < 99999);
    if (loops === 99999) {
        ctx.status = 404;
        ctx.body = "No free alias. Try again later";
    }
    else {
        try {
            let entry = yield db_1.Data.Entry.findOne({
                attributes: ['id', 'uid', 'status', 'key'],
                where: {
                    uid
                }
            });
            let authority = yield db_1.Data.Authority.findOne({ where: { aid } });
            entry.alias = alias;
            entry.status = status;
            log_1.log.info('status authority', { status });
            yield entry.save();
            entry.setAuthority(authority);
            ctx.status = 200;
            ctx.body = { alias };
        }
        catch (ex) {
            console.error(ex);
            ctx.status = 500;
        }
    }
}));
//# sourceMappingURL=AuthorityRouter.js.map
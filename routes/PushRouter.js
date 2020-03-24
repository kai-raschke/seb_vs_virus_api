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
const expo_push_1 = require("../lib/expo-push");
const log_1 = require("../lib/log");
const db_1 = require("./../lib/db");
exports.pushRouter = new Router()
    .post('/pushreg', function (ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        let body = ctx.request.body;
        if (body.uid && body.key && body.token) {
            let { uid, key, token } = body;
            try {
                let entry = yield db_1.Data.Entry.findOne({ where: { uid } });
                if (entry) {
                    if (entry.key === key) {
                        expo_push_1.default.saveToken(token, uid);
                        console.log(`Received push token, ${token}`);
                        ctx.body = `Received push token, ${token}`;
                    }
                    else {
                        this.status = 403;
                    }
                }
                else {
                    this.status = 404;
                    this.body = "Cannot find user.";
                }
            }
            catch (ex) {
                log_1.log.error(ex.message);
                console.error(ex);
                ctx.status = 500;
                ctx.body = "Something went wrong sending the token.";
            }
        }
        else {
            ctx.status = 400;
            ctx.body = "Missing some required data";
        }
    });
});
//# sourceMappingURL=PushRouter.js.map
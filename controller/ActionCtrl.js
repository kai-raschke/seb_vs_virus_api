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
const db_1 = require("./../lib/db");
function register(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        let body = ctx.request.body;
        if (body.uid && body.status) {
            let uid = body.uid;
            let status = Number.parseInt(body.status);
            if (!Number.isNaN(status)) {
                if (status >= 0 && status <= 4) {
                    try {
                        yield db_1.Data.Entry.create({
                            uid, status
                        });
                        ctx.status = 200;
                    }
                    catch (ex) {
                        if (ex.name === "SequelizeUniqueConstraintError") {
                            ctx.status = 500;
                            ctx.body = "ID probably already exists.";
                        }
                        else {
                            ctx.status = 500;
                            ctx.body = "Unknown server error.";
                        }
                    }
                }
                else {
                    ctx.status = 400;
                    ctx.body = "Nothing to see here. Wrong data.";
                }
            }
            else {
                ctx.status = 400;
                ctx.body = "Nothing to see here. Wrong data.";
            }
        }
        else {
            ctx.status = 400;
            ctx.body = "Nothing to see here. Missing your data.";
        }
    });
}
exports.register = register;
function connect(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        let body = ctx.request.body;
        if (body.uid && body.xid) {
            let uid = body.uid;
            let xid = body.xid;
            let entry = yield db_1.Data.Entry.findOne({
                attributes: ['id', 'uid', 'status'],
                where: {
                    uid
                }
            });
            let xEntry = yield db_1.Data.Entry.findOne({
                attributes: ['id', 'uid', 'status'],
                where: {
                    uid: xid
                }
            });
            if (entry) {
                console.log(entry.protype);
                yield entry.addMet(xEntry);
                ctx.status = 200;
            }
        }
        else {
            ctx.status = 400;
            ctx.body = "Nothing to see here. Missing your data.";
        }
    });
}
exports.connect = connect;
function status(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        let body = ctx.request.body;
        if (body.uid && body.status) {
            let uid = body.uid;
            let status = Number.parseInt(body.status);
            if (!Number.isNaN(status)) {
                if (status >= 0 && status <= 4) {
                    let entry = yield db_1.Data.Entry.findOne({
                        attributes: ['id', 'uid', 'status'],
                        where: {
                            uid
                        }
                    });
                    if (entry) {
                        entry.status = status;
                        yield entry.save();
                        ctx.status = 200;
                        ctx.body = { uid: entry.uid, status: entry.status };
                    }
                    else {
                        ctx.status = 400;
                        ctx.body = "Nothing to see here. Literally.";
                    }
                }
                else {
                    ctx.status = 400;
                    ctx.body = "Nothing to see here. Wrong data.";
                }
            }
            else {
                ctx.status = 400;
                ctx.body = "Nothing to see here. Wrong data.";
            }
        }
    });
}
exports.status = status;
function check(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        let userId = ctx.request.body;
        ctx.body = "Nothing to see here";
    });
}
exports.check = check;
//# sourceMappingURL=ActionCtrl.js.map
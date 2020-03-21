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
const moment = require("moment");
const uuid4 = require("uuid4");
const nanoid_1 = require("nanoid");
const db_1 = require("./../lib/db");
function register(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const uid = uuid4();
        const key = nanoid_1.nanoid(12);
        try {
            yield db_1.Data.Entry.create({
                uid, key
            });
            ctx.status = 200;
            ctx.body = uid;
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
    });
}
exports.register = register;
function registerGroup(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const gid = uuid4();
        const shortcode = Math.random().toString(36).substring(7);
        try {
            yield db_1.Data.Group.create({
                gid, shortcode
            });
            ctx.status = 200;
            ctx.body = { gid, shortcode };
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
    });
}
exports.registerGroup = registerGroup;
function joinGroup(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        let body = ctx.request.body;
        if (body.uid) {
            let uid = body.uid;
            let gid, mode = 'gid';
            if (body.gid) {
                gid = body.gid;
            }
            else if (body.shortcode) {
                gid = body.shortcode;
                mode = "shortcode";
            }
            let entry = yield db_1.Data.Entry.findOne({
                attributes: ['id', 'uid', 'status'],
                where: {
                    uid
                }
            });
            let Group;
            if (mode === 'gid') {
                Group = yield db_1.Data.Group.findOne({ where: { gid } });
            }
            else if (mode === 'shortcode') {
                Group = yield db_1.Data.Group.findOne({ where: { shortcode: gid } });
            }
            let inAlready = yield entry.hasMember(Group);
            console.log(inAlready);
            if (!inAlready)
                yield entry.addMember(Group);
            let member = yield db_1.Data.Entry.findAll({
                include: {
                    model: db_1.Data.Group,
                    as: 'Member',
                    where: {
                        gid
                    },
                    required: true
                }
            });
            console.log(member);
            for (let i = -1; ++i < member.length;) {
                if (member[i].uid !== uid) {
                    yield entry.addMet(member[i]);
                    yield member[i].addMet(entry);
                }
            }
            ctx.status = 200;
        }
        else {
            ctx.status = 400;
            ctx.body = "Nothing to see here. Missing your data.";
        }
    });
}
exports.joinGroup = joinGroup;
function groupAlive(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        let body = ctx.request.body;
        if (body.gid) {
            let gid = body.gid;
            try {
                let group = yield db_1.Data.Group.findOne({ where: { gid } });
                if (group) {
                    let now = moment.utc(group.createdAt);
                    let then = moment.utc().subtract(group.ttl, 'hours');
                    if (now.isBefore(then)) {
                        ctx.status = 200;
                        ctx.body = false;
                    }
                    else {
                        ctx.status = 200;
                        ctx.body = true;
                    }
                }
                else {
                    ctx.status = 404;
                    ctx.body = "Could not find your group";
                }
            }
            catch (ex) {
                ctx.status = 500;
                ctx.body = "Something went wrong";
            }
        }
        else {
            ctx.status = 400;
            ctx.body = "Nothing to see here. Missing your data.";
        }
    });
}
exports.groupAlive = groupAlive;
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
            if (entry && xEntry) {
                yield entry.addMet(xEntry);
                yield xEntry.addMet(entry);
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
        if (body.uid && body.status || body.uid && body.status == 0) {
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
        else {
            ctx.status = 400;
            ctx.body = "Nothing to see here. Wrong data.";
        }
    });
}
exports.status = status;
function check(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        let body = ctx.request.body;
        if (body.uid) {
            let uid = body.uid;
            try {
                let didIMet = yield db_1.Data.Entry.findAll({
                    attributes: ['id'],
                    where: {
                        uid
                    },
                    include: {
                        model: db_1.Data.Entry,
                        as: 'Met',
                        attributes: ['status'],
                        where: {
                            status: { [db_1.Data.Op.gte]: 3 }
                        },
                        through: {
                            attributes: ['id'],
                            where: {
                                createdAt: {
                                    [db_1.Data.Op.gte]: moment().subtract(14, 'days').toDate()
                                }
                            }
                        }
                    },
                    raw: true
                });
                if (didIMet.length === 0) {
                    ctx.status = 200;
                    ctx.body = false;
                }
                else {
                    let scores = didIMet.map(val => val['Met.status']);
                    let max = scores.reduce(function (a, b) {
                        return Math.max(a, b);
                    });
                    ctx.status = 200;
                    ctx.body = max;
                }
            }
            catch (ex) {
                console.error(ex);
            }
        }
        else {
            ctx.status = 400;
            ctx.body = "Nothing to see here. Missing your data.";
        }
    });
}
exports.check = check;
//# sourceMappingURL=ActionCtrl.js.map
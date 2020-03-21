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
const nanoid = require("nanoid");
const db_1 = require("./../lib/db");
function register(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const uid = uuid4();
        const key = nanoid(12);
        let body = ctx.request.body;
        let age = Number.parseInt(body.age);
        age = (Number.isNaN(age) ? 0 : age);
        let sex = Number.parseInt(body.sex);
        sex = (Number.isNaN(sex) ? 0 : sex);
        try {
            yield db_1.Data.Entry.create({
                uid, key,
                age,
                sex
            });
            ctx.status = 200;
            ctx.body = { uid, key };
        }
        catch (ex) {
            if (ex.name === "SequelizeUniqueConstraintError") {
                ctx.status = 500;
                ctx.body = "ID probably already exists.";
            }
            else {
                ctx.status = 500;
                ctx.body = "Unknown server error.";
                console.error(ex);
            }
        }
    });
}
exports.register = register;
function registerGroup(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const gid = uuid4();
        try {
            let exists = null;
            let shortcode, loops = 0;
            do {
                shortcode = leftPad(randomInt(0, 9999999), 7);
                loops++;
                exists = yield db_1.Data.Group.findOne({
                    where: {
                        shortcode
                    }
                });
            } while (exists && loops < 9999);
            if (loops === 9999) {
                ctx.status = 404;
                ctx.body = "No free group number right know. Try again later";
            }
            else {
                yield db_1.Data.Group.create({
                    gid, shortcode
                });
                ctx.status = 200;
                ctx.body = { gid, shortcode };
            }
        }
        catch (ex) {
            if (ex.name === "SequelizeUniqueConstraintError") {
                ctx.status = 500;
                ctx.body = "ID probably already exists.";
            }
            else {
                ctx.status = 500;
                ctx.body = "Unknown server error.";
                console.error(ex);
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
                attributes: ['id', 'uid', 'status', 'key'],
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
            if (body.key === entry.key) {
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
                for (let i = -1; ++i < member.length;) {
                    if (member[i].uid !== uid) {
                        yield entry.addMet(member[i]);
                        yield member[i].addMet(entry);
                    }
                }
                ctx.status = 200;
            }
            else {
                ctx.status = 403;
            }
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
                attributes: ['id', 'uid', 'status', 'key'],
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
                if (body.key === entry.key) {
                    yield entry.addMet(xEntry);
                    yield xEntry.addMet(entry);
                    ctx.status = 200;
                }
                else {
                    ctx.status = 403;
                }
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
                        attributes: ['id', 'uid', 'status', 'key'],
                        where: {
                            uid
                        }
                    });
                    if (entry) {
                        if (entry.key === body.key) {
                            entry.status = status;
                            yield entry.save();
                            ctx.status = 200;
                            ctx.body = { uid: entry.uid, status: entry.status };
                        }
                        else {
                            ctx.status = 403;
                        }
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
                yield db_1.Data.Entry.update({ lastCheck: moment().toDate() }, { where: { uid } });
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
function count(ctx) {
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
                ctx.status = 200;
                ctx.body = didIMet.length;
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
exports.count = count;
function statusBOS(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        ctx.status = 200;
    });
}
exports.statusBOS = statusBOS;
function leftPad(str, length) {
    str = str == null ? '' : String(str);
    length = ~~length;
    let pad = '';
    let padLength = length - str.length;
    while (padLength--) {
        pad += '0';
    }
    return pad + str;
}
function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
//# sourceMappingURL=ActionCtrl.js.map
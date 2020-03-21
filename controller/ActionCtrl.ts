import { Context } from 'koa';
import * as moment from "moment";
import * as uuid4 from 'uuid4';
import * as nanoid from 'nanoid'
import { Data } from './../lib/db';
import { log } from "./../lib/log";

/**
 * Register "User" (uuid)
 */
export async function register(ctx: Context) {
    // generate uuid
    const uid = uuid4();
    const key = nanoid(12);

    // Save "user" with uid to database
    try{
        await Data.Entry.create(
            {
                uid, key
            }
        );

        ctx.status = 200;
        ctx.body = { uid, key };
    }
    catch(ex){
        // could happen (probably not) if uuid collides
        if (ex.name === "SequelizeUniqueConstraintError") {
            ctx.status = 500;
            ctx.body = "ID probably already exists."
        }
        else {
            ctx.status = 500;
            ctx.body = "Unknown server error."
        }
    }
}

/**
 * Create Group, return gid and shortcode
 */
export async function registerGroup(ctx: Context) {
    // generate uuid
    const gid = uuid4();
    // generate shortcode for group joining
    const shortcode = leftPad(randomInt(0, 9999999), 7);

    try{
        await Data.Group.create(
            {
                gid, shortcode
            }
        );

        ctx.status = 200;
        ctx.body = { gid, shortcode };
    }
    catch(ex){
        // could happen (probably not) if uuid collides
        if (ex.name === "SequelizeUniqueConstraintError") {
            ctx.status = 500;
            ctx.body = "ID probably already exists."
        }
        else {
            ctx.status = 500;
            ctx.body = "Unknown server error."
        }
    }
}

/**
 * Join Group (by gid or shortcode) with your uid
 */
export async function joinGroup(ctx: Context) {
    let body = ctx.request.body;

    if (body.uid) {
        let uid: String = body.uid;

        let gid: String, mode: String = 'gid';
        if (body.gid) {
            gid = body.gid;
        }
        else if (body.shortcode) {
            gid = body.shortcode;
            mode = "shortcode"
        }

        let entry = await Data.Entry.findOne(
            {
                attributes: [ 'id', 'uid', 'status', 'key' ],
                where: {
                    uid
                }
            }
        );

        let Group;
        if (mode === 'gid') {
            Group = await Data.Group.findOne(
                { where: { gid } }
            );
        }
        else if (mode === 'shortcode') {
            Group = await Data.Group.findOne(
                { where: { shortcode: gid } }
            );
        }

        let inAlready = await entry.hasMember(Group);

        if (body.key === entry.key) {
            if (!inAlready)
                await entry.addMember(Group);

            let member = await Data.Entry.findAll(
                {
                    include: {
                        model: Data.Group,
                        as: 'Member',
                        where: {
                            gid
                        },
                        required: true
                    }
                }
            );

            for (let i = -1; ++i < member.length;) {
                if (member[i].uid !== uid) { //nicht den eigenen Nutzer untereinander verknüpfen
                    await entry.addMet(member[i]);
                    await member[i].addMet(entry);
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
}

/**
 * Check TTL of group (invalid after 24 hours)
 */
export async function groupAlive(ctx: Context) {
    let body = ctx.request.body;

    if (body.gid) {
        let gid = body.gid;
        try {
            let group = await Data.Group.findOne(
                { where: { gid }}
            );

            if (group) {
                let now = moment.utc(group.createdAt);
                let then = moment.utc().subtract(group.ttl, 'hours');

                // Is group older than ttl
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
        catch (ex){
            ctx.status = 500;
            ctx.body = "Something went wrong";
        }
    }
    else {
        ctx.status = 400;
        ctx.body = "Nothing to see here. Missing your data.";
    }}

/**
 * Connect to someone else (alias I met someone)
 */
export async function connect(ctx: Context) {
    // zeitpunkt & eigene id & fremde id
    let body = ctx.request.body;

    if (body.uid && body.xid) {
        let uid: String = body.uid;
        let xid: String = body.xid;

        let entry = await Data.Entry.findOne(
            {
                attributes: [ 'id', 'uid', 'status', 'key' ],
                where: {
                    uid
                }
            }
        );

        let xEntry = await Data.Entry.findOne(
            {
                attributes: [ 'id', 'uid', 'status' ],
                where: {
                    uid: xid
                }
            }
        );

        if (entry && xEntry) {
            if (body.key === entry.key){
                // Person who scanned has met
                await entry.addMet(xEntry);

                // Also the other way around, the scanned person was met
                await xEntry.addMet(entry);

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
}

/**
 * Change my status
 */
export async function status(ctx: Context) {
    // id & zeitpunkt (updatedat) % status

    let body = ctx.request.body;

    if (body.uid && body.status || body.uid && body.status == 0) {
        let uid: String = body.uid;
        let status: number = Number.parseInt(body.status);

        if (!Number.isNaN(status)) {
            if (status >= 0 && status <= 4) {
                let entry = await Data.Entry.findOne(
                    {
                        attributes: [ 'id', 'uid', 'status', 'key' ],
                        where: {
                            uid
                        }
                    }
                );

                if (entry) {
                    if (entry.key === body.key) {
                        entry.status = status;

                        await entry.save();

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
    else{
        ctx.status = 400;
        ctx.body = "Nothing to see here. Wrong data.";
    }
}

/**
 * Check status of others in time range of 14 days
 * Return "worst" state
 */
export async function check(ctx: Context) {
    // array hash
    // 2, 3 vorhanden?
    // -14 Tage
    let body = ctx.request.body;

    if (body.uid) {
        let uid: String = body.uid;
        try{
            let didIMet = await Data.Entry.findAll({
                attributes: ['id'],
                where: {
                    uid
                },
                include: {
                    model: Data.Entry,
                    as: 'Met',
                    attributes: ['status'],
                    where: {
                        status: { [Data.Op.gte]: 3 }
                    },
                    through: {
                        attributes: ['id'],
                        where: {
                            createdAt: {
                                [Data.Op.gte]: moment().subtract(14, 'days').toDate()
                            }
                        }
                    }
                },
                raw: true
            });

            // no case in the chain is critical
            if (didIMet.length === 0) {
                ctx.status = 200;
                ctx.body = false
            }
            // Otherwise someone in the chain is critical
            else {
                // Get all states
                let scores = didIMet.map(val => val['Met.status']);

                // Calculate the maximum (worst) of all states
                let max = scores.reduce(function(a, b) {
                    return Math.max(a, b);
                });

                ctx.status = 200;
                ctx.body = max;
            }
        }
        catch(ex){
            console.error(ex);
        }
    }
    else {
        ctx.status = 400;
        ctx.body = "Nothing to see here. Missing your data.";
    }
}

export async function count(ctx: Context) {
    let body = ctx.request.body;

    if (body.uid) {
        let uid: String = body.uid;
        try {
            let didIMet = await Data.Entry.findAll({
                attributes: ['id'],
                where: {
                    uid
                },
                include: {
                    model: Data.Entry,
                    as: 'Met',
                    attributes: ['status'],
                    through: {
                        attributes: ['id'],
                        where: {
                            createdAt: {
                                [Data.Op.gte]: moment().subtract(14, 'days').toDate()
                            }
                        }
                    }
                },
                raw: true
            });

            ctx.status = 200;
            ctx.body = didIMet.length;
        }
        catch(ex){
            console.error(ex);
        }
    }
    else {
        ctx.status = 400;
        ctx.body = "Nothing to see here. Missing your data.";
    }
}

function leftPad(str, length) {
    str = str == null ? '' : String(str);
    length = ~~length;
    let pad = '';
    let padLength = length - str.length;

    while (padLength--) {
        pad += '0'
    }

    return pad + str
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low)
}
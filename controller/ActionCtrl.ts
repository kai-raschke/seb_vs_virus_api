import { Context } from 'koa';
import * as moment from "moment";
import * as uuid4 from 'uuid4';
import { Data } from './../lib/db';
import { log } from "./../lib/log";

/**
 * Root GET Handler: Just return the API name.
 */
export async function register(ctx: Context) {
    // generate uuid
    const uid = uuid4();

    // Save "user" with uid to database
    try{
        await Data.Entry.create(
            {
                uid
            }
        );

        ctx.status = 200;
        ctx.body = uid;
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

export async function registerGroup(ctx: Context) {
    // generate uuid
    const uid = uuid4();
    // generate shortcode for group joining
    const shortcode = Math.random().toString(36).substring(7);

    try{
        await Data.Group.create(
            {
                uid, shortcode
            }
        );

        ctx.status = 200;
        ctx.body = { uid, shortcode };
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
                attributes: [ 'id', 'uid', 'status' ],
                where: {
                    uid
                }
            }
        );

        let Group;
        if (mode === 'gid') {
            Group = await Data.Group.findOne(
                { where: { uid: gid } }
            );
        }
        else if (mode === 'shortcode') {
            Group = await Data.Group.findOne(
                { where: { shortcode: gid } }
            );
        }

        let inAlready = await entry.hasMember(Group);

        console.log(inAlready);

        if (!inAlready)
            await entry.addMember(Group);

        let member = await Data.Entry.findAll(
            {
                include: {
                    model: Data.Group,
                    as: 'Member',
                    where: {
                        uid: gid
                    },
                    required: true
                }
            }
        );
        console.log(member);

        for (let i = -1; ++i < member.length;) {
            if (member[i].uid !== uid) //nicht den eigenen Nutzer untereinander verknüpfen
                await entry.addMet(member[i]);
        }

        ctx.status = 200;
    }
    else {
        ctx.status = 400;
        ctx.body = "Nothing to see here. Missing your data.";
    }
}

export async function connect(ctx: Context) {
    // zeitpunkt & eigene id & fremde id
    let body = ctx.request.body;

    if (body.uid && body.xid) {
        let uid: String = body.uid;
        let xid: String = body.xid;

        let entry = await Data.Entry.findOne(
            {
                attributes: [ 'id', 'uid', 'status' ],
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

        if (entry) {
            console.log(entry.protype);
            await entry.addMet(xEntry);

            ctx.status = 200;
        }
    }
    else {
        ctx.status = 400;
        ctx.body = "Nothing to see here. Missing your data.";
    }
}

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
                        attributes: [ 'id', 'uid', 'status' ],
                        where: {
                            uid
                        }
                    }
                );

                if (entry) {
                    entry.status = status;

                    await entry.save();

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
    else{
        ctx.status = 400;
        ctx.body = "Nothing to see here. Wrong data.";
    }
}

export async function check(ctx: Context) {
    // array hash
    // 2, 3 vorhanden?
    // -14 Tage
    let body = ctx.request.body;

    if (body.uid) {
        let uid: String = body.uid;
        try{
            let didIMet = await Data.Entry.findOne({
                where: {
                    uid
                },
                include: {
                    model: Data.Entry,
                    as: 'Met',
                    where: {
                        createdAt: {
                            [Data.Op.gte]: moment().subtract(14, 'days').toDate()
                        }
                    }
                }
            });

            ctx.body = didIMet;
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

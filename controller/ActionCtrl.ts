import { Context } from 'koa';
import { Data } from './../lib/db';
import { log } from "./../lib/log";

/**
 * Root GET Handler: Just return the API name.
 */
export async function register(ctx: Context) {
    // uid & status
    // 0 - 3

    let body = ctx.request.body;

    if (body.uid && body.status) {
        let uid: String = body.uid;
        let status: number = Number.parseInt(body.status);

        if (!Number.isNaN(status)) {
            if (status >= 0 && status <= 4) {
                try{
                    await Data.Entry.create(
                        {
                            uid, status
                        }
                    );

                    ctx.status = 200;
                }
                catch(ex){
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

    if (body.uid && body.status) {
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
}

export async function check(ctx: Context) {
    // array hash
    // 2, 3 vorhanden?
    // -14 Tage
    let userId = ctx.request.body
    ctx.body = "Nothing to see here";
}

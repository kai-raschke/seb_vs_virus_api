import * as Router from 'koa-router';
import {Context} from "koa";
import expoPush from "../lib/expo-push";
import {log} from "../lib/log";
import { Data } from '../lib/db';

export const pushRouter = new Router()
    .post('/pushreg', async function(ctx: Context) {
        let body = ctx.request.body;

        if ( body.uid && body.key && body.token ) {
            let { uid, key, token } = body;

            try {
                let entry = await Data.Entry.findOne( {where: { uid } });

                if (entry) {
                    if (entry.key === key) {
                        expoPush.saveToken(token, uid);
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
                log.error(ex.message);
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

import * as Router from 'koa-router';
import {Context} from "koa";
import {Data} from "../lib/db";
import {log} from "../lib/log";
import {createAlias, leftPad, randomInt} from '../lib/util';
/**
 * Root routes: just return the API name.
 */
export const authorityRouter = new Router()
    .get('/secret', async function(ctx: Context) {
        ctx.body = "secret";
    })
    // Set status as Authority
    .post('/authState', async (ctx: Context) => {
        let { uid, status } = ctx.request.body;
        let aid = ctx.state.user.dbid; //database id of authority

        let exists = null;
        let alias, loops = 0;

        // Try to prevent duplicates of alias
        do {
            alias = createAlias();
            loops++;

            exists = await Data.Entry.findOne({
                where: {
                    alias
                }
            });
        } while(exists && loops < 99999);

        if (loops === 99999) {
            ctx.status = 404;
            ctx.body = "No free alias. Try again later";
        }
        else {
            try{
                let entry = await Data.Entry.findOne(
                    {
                        attributes: [ 'id', 'uid', 'status', 'key' ],
                        where: {
                            uid
                        }
                    }
                );

                let authority = await Data.Authority.findOne( { aid });

                entry.alias = alias;
                entry.status = status;

                log.info('status authority', {status});

                await entry.save();

                entry.setAuthority(authority);

                ctx.status = 200;
                ctx.body = { alias }
            }
            catch(ex){
                console.error(ex);
                ctx.status = 500;
            }
        }
    });

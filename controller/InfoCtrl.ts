import { Context } from 'koa';

/**
 * Root GET Handler: Just return the API name.
 */
export async function info(ctx: Context) {
    ctx.body = "Nothing to see here";
}

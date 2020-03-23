'use strict';

import Application, {Context} from "koa";
import * as bodyParser from 'koa-body';
import * as ratelimit from 'koa-ratelimit';
import * as Router from 'koa-router';

const session = require('koa-session');
const passport = require('koa-passport');
const Auth0Strategy = require('passport-auth0');

import { log } from './lib/log';

import { infoRouter } from "./routes/InfoRouter";
import { actionRouter } from "./routes/ActionRouter";
import { authorityRouter } from "./routes/AuthorityRouter";

const db = new Map();

export default function server (app: Application) {
    // API response time
    app.use(async (ctx: Context, next: Function) => {
        const start: number = Date.now();
        await next(); //
        const delta: number = Math.ceil(Date.now() - start);
        ctx.set('X-Response-Time', delta + 'ms');
    });

    // Rate limit the API (maybe malicious user) / 100 requests per IP per Minute
    app.use(ratelimit({
        driver: 'memory',
        db: db,
        duration: 60000,
        errorMessage: 'Hey, please slow down a little.',
        id: (ctx) => ctx.ip,
        headers: {
            remaining: 'Rate-Limit-Remaining',
            reset: 'Rate-Limit-Reset',
            total: 'Rate-Limit-Total'
        },
        max: 200,
        disableHeader: false
    }));

    app.use(bodyParser());

    app.use(infoRouter.routes());
    app.use(actionRouter.routes());

    var strategy = new Auth0Strategy({
            domain:       'dev-infectiontracker.eu.auth0.com',
            clientID:     process.env.auth0_client_id,
            clientSecret: process.env.auth0_client_secret,
            callbackURL:  '/callback',
            state: true
        },
        function(_accessToken, _refreshToken, _extraParams, profile, done) {
            // accessToken is the token to call Auth0 API (not needed in the most cases)
            // extraParams.id_token has the JSON Web Token
            // profile has all the information from the user
            return done(null, profile);
        }
    );

    passport.use(strategy);
    passport.serializeUser(function(user, done) { done(null, user); });
    passport.deserializeUser(function(user, done) { done(null, user); });

    app.keys = ['your-session-secret'];
    app.use(session({ }, app));
    app.use(passport.initialize());

    const authRouter = new Router()
        .get('/logout', async function(ctx) {
            ctx.logout();
            ctx.status = 200;
        })
        .get('/callback',
            async function(ctx: Context, _next) {
                let auth = new Promise((resolve, reject) => {
                    passport.authenticate('auth0', function(err, user) {
                            if(err) reject(err);

                            resolve(user);
                        })(ctx)
                });

                let awaited = await auth;

                ctx.login(awaited);

                ctx.status = 200;
            }
        )
        .get('/login',
            passport.authenticate('auth0', {
                scope: 'openid email profile'
                // prompt: 'none',
                // successRedirect: '/register',
                // failureRedirect: '/count'
            })
        );

    app.use(authRouter.routes());

    app.use(passport.session());

    app.use(async function(ctx, next) {
        if (ctx.isAuthenticated()) {
            await next()
        } else {
            ctx.status = 403;
        }
    });

    app.use(authorityRouter.routes());
}

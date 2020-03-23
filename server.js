'use strict';
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
const bodyParser = require("koa-body");
const ratelimit = require("koa-ratelimit");
const Router = require("koa-router");
const session = require('koa-session');
const passport = require('koa-passport');
const Auth0Strategy = require('passport-auth0');
const InfoRouter_1 = require("./routes/InfoRouter");
const ActionRouter_1 = require("./routes/ActionRouter");
const AuthorityRouter_1 = require("./routes/AuthorityRouter");
const db = new Map();
function server(app) {
    app.use((ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const start = Date.now();
        yield next();
        const delta = Math.ceil(Date.now() - start);
        ctx.set('X-Response-Time', delta + 'ms');
    }));
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
    app.use(InfoRouter_1.infoRouter.routes());
    app.use(ActionRouter_1.actionRouter.routes());
    var strategy = new Auth0Strategy({
        domain: 'dev-infectiontracker.eu.auth0.com',
        clientID: process.env.auth0_client_id,
        clientSecret: process.env.auth0_client_secret,
        callbackURL: '/callback',
        state: true
    }, function (_accessToken, _refreshToken, _extraParams, profile, done) {
        return done(null, profile);
    });
    passport.use(strategy);
    passport.serializeUser(function (user, done) { done(null, user); });
    passport.deserializeUser(function (user, done) { done(null, user); });
    app.keys = ['your-session-secret'];
    app.use(session({}, app));
    app.use(passport.initialize());
    const authRouter = new Router()
        .get('/logout', function (ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.logout();
            ctx.status = 200;
        });
    })
        .get('/callback', function (ctx, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            let auth = new Promise((resolve, reject) => {
                passport.authenticate('auth0', function (err, user) {
                    if (err)
                        reject(err);
                    resolve(user);
                })(ctx);
            });
            let awaited = yield auth;
            ctx.login(awaited);
            ctx.status = 200;
        });
    })
        .get('/login', passport.authenticate('auth0', {
        scope: 'openid email profile'
    }));
    app.use(authRouter.routes());
    app.use(passport.session());
    app.use(function (ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (ctx.isAuthenticated()) {
                yield next();
            }
            else {
                ctx.status = 403;
            }
        });
    });
    app.use(AuthorityRouter_1.authorityRouter.routes());
}
exports.default = server;
//# sourceMappingURL=server.js.map
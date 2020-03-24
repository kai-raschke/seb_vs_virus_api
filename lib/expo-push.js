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
const expo_server_sdk_1 = require("expo-server-sdk");
const db_1 = require("./db");
const moment = require("moment");
const expo = new expo_server_sdk_1.default();
let savedPushTokens = [];
const saveToken = (token, uid) => {
    let pushToken = { token, uid };
    let pushTokenExists = false;
    for (let i = 0; i < savedPushTokens.length; i++) {
        if (savedPushTokens[i] === pushToken) {
            pushTokenExists = true;
        }
    }
    if (!pushTokenExists) {
        savedPushTokens.push({ token, uid });
    }
};
exports.pushSendCount = (uid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pushToken = savedPushTokens.find(pushToken => pushToken.uid === uid);
        if (pushToken) {
            let token = pushToken.token;
            let notifications = [];
            if (!expo_server_sdk_1.default.isExpoPushToken(token)) {
                console.error(`Push token ${pushToken} is not a valid Expo push token`);
            }
            else {
                let didIMet = yield db_1.Data.Entry.findAll({
                    attributes: ['id'],
                    where: {
                        uid
                    },
                    include: {
                        model: db_1.Data.Entry,
                        as: 'Met',
                        attributes: ['status'],
                        required: true,
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
                notifications.push({
                    to: pushToken,
                    sound: 'default',
                    title: 'Message received!',
                    body: didIMet.length,
                    data: { count: didIMet.length }
                });
                let chunks = expo.chunkPushNotifications(notifications);
                (() => __awaiter(void 0, void 0, void 0, function* () {
                    for (let chunk of chunks) {
                        try {
                            let receipts = yield expo.sendPushNotificationsAsync(chunk);
                            console.log(receipts);
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                }))();
            }
        }
    }
    catch (ex) {
        console.error(ex);
    }
});
const handlePushTokens = (message) => {
    let notifications = [];
    for (let pushToken of savedPushTokens) {
        if (!expo_server_sdk_1.default.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }
        notifications.push({
            to: pushToken,
            sound: 'default',
            title: 'Message received!',
            body: message,
            data: { message }
        });
    }
    let chunks = expo.chunkPushNotifications(notifications);
    (() => __awaiter(void 0, void 0, void 0, function* () {
        for (let chunk of chunks) {
            try {
                let receipts = yield expo.sendPushNotificationsAsync(chunk);
                console.log(receipts);
            }
            catch (error) {
                console.error(error);
            }
        }
    }))();
};
const expoPush = { saveToken, handlePushTokens };
exports.default = expoPush;
//# sourceMappingURL=expo-push.js.map
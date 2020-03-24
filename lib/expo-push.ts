import Expo from 'expo-server-sdk';
import {Data} from "./db";
import * as moment from "moment";

const expo = new Expo();
let savedPushTokens = [];

const saveToken = async (token, uid) => {
    let entry = await Data.Entry.findOne( { where: {uid} });
    if (entry) {
        entry.token = token;
        await entry.save();
    }
};

const pushSendCount = async (uid) => {
    try{
        let pushToken = savedPushTokens.find(pushToken => pushToken.uid === uid);
        let entry = await Data.Entry.findOne({ where: {uid} });

        if (entry) {
            let token = entry.get('token');
            let notifications = [];

            if (!Expo.isExpoPushToken(token)) {
                console.error(`Push token ${pushToken} is not a valid Expo push token`);
            }
            else {
                let didIMet = await Data.Entry.findAll({
                    attributes: ['id'],
                    where: {
                        uid
                    },
                    include: {
                        model: Data.Entry,
                        as: 'Met',
                        attributes: ['status'],
                        required: true,
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

                notifications.push({
                    to: pushToken,
                    sound: 'default',
                    title: 'Message received!',
                    body: didIMet.length,
                    data: { count: didIMet.length }
                });

                let chunks = expo.chunkPushNotifications(notifications);  (async () => {
                    for (let chunk of chunks) {
                        try {
                            let receipts = await expo.sendPushNotificationsAsync(chunk);
                            console.log(receipts);
                        } catch (error) {
                            console.error(error);
                        }
                    }
                })();
            }
        }
    }
    catch(ex){
        console.error(ex);
    }
};

const pushSendStatus =  (tokens, status) => {
    try{
        tokens = tokens || [];
        if (tokens && status) {
            let notifications = [];

            for (let i = -1; ++i < tokens.length;) {
                if (!Expo.isExpoPushToken(tokens[i])) {
                    console.error(`Push token ${tokens[i]} is not a valid Expo push token`);
                }
                else {
                    notifications.push({
                        to: tokens[i],
                        sound: 'default',
                        title: 'Message received!',
                        body: "status",
                        data: { status }
                    });
                }
            }

            let chunks = expo.chunkPushNotifications(notifications);  (async () => {
                for (let chunk of chunks) {
                    try {
                        let receipts = await expo.sendPushNotificationsAsync(chunk);
                        console.log(receipts);
                    } catch (error) {
                        console.error(error);
                    }
                }
            })();
        }
    }
    catch(ex){
        console.error(ex);
    }
};

export interface IExpoPush {
    saveToken(token: string, uid: string): void
    pushSendCount(uid: string): void
    pushSendStatus(tokens: Array<string>, status: number): void
}

const expoPush: IExpoPush = { saveToken, pushSendCount, pushSendStatus };

export default expoPush;

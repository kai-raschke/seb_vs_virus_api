import Expo from 'expo-server-sdk';

const expo = new Expo();
let savedPushTokens = [];

const saveToken = (token) => {
    if (savedPushTokens.indexOf(token === -1)) {
        savedPushTokens.push(token);
    }
};

const handlePushTokens = (message) => {
    let notifications = [];
    for (let pushToken of savedPushTokens) {
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }
        notifications.push({
            to: pushToken,
            sound: 'default',
            title: 'Message received!',
            body: message,
            data: { message }
        })
    }  // Defined in following step

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
};

export interface IExpoPush {
    saveToken(token: any): void
    handlePushTokens(message: any): any
}

const expoPush: IExpoPush = { saveToken, handlePushTokens };

export default expoPush;

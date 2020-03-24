"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function leftPad(str, length) {
    str = str == null ? '' : String(str);
    length = ~~length;
    let pad = '';
    let padLength = length - str.length;
    while (padLength--) {
        pad += '0';
    }
    return pad + str;
}
exports.leftPad = leftPad;
function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
exports.randomInt = randomInt;
//# sourceMappingURL=util.js.map
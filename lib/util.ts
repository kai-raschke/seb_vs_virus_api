function leftPad(str, length) {
    str = str == null ? '' : String(str);
    length = ~~length;
    let pad = '';
    let padLength = length - str.length;

    while (padLength--) {
        pad += '0'
    }

    return pad + str
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low)
}



export { leftPad, randomInt };

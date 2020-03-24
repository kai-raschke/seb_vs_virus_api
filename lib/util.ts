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

const colorArray = [
    'schwarz', 'weiß', 'grün', 'gelb', 'rot', 'blau', 'lila'
];
const alphabetArray = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V' , 'W', 'X', 'Y', 'Z'
];
function createAlias() {
    // Create some randomness
    const randomColor1 = colorArray[Math.floor(Math.random() * colorArray.length)];
    const randomColor2 = colorArray[Math.floor(Math.random() * colorArray.length)];
    const randomAlphabet = alphabetArray[Math.floor(Math.random() * alphabetArray.length)];
    const randomInt1 = leftPad(randomInt(0, 99), 2);
    const randomInt2 = leftPad(randomInt(0, 99), 2);

    // Form readable string
    const alias = `${randomAlphabet} ${randomInt1} ${randomColor1} ${randomColor2} ${randomInt2}`;

    return alias;
}

export { leftPad, randomInt, createAlias };

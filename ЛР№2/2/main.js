const CryptoJS = require('crypto-js');

// символи для генерації
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// генерація випадкового рядка
function generateRandomString(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    return result;
}

// змінити 1 випадковий символ
function changeOneChar(str) {
    const index = Math.floor(Math.random() * str.length);
    const charsArray = str.split('');

    let newChar;
    do {
        newChar = chars[Math.floor(Math.random() * chars.length)];
    } while (newChar === charsArray[index]);

    charsArray[index] = newChar;
    return charsArray.join('');
}

// SHA-256
function hash(input) {
    return CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
}

// підрахунок відмінностей
function countDiff(a, b) {
    let diff = 0;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) diff++;
    }
    return diff;
}

// main
const original = generateRandomString(16);
const modified = changeOneChar(original);

const hash1 = hash(original);
const hash2 = hash(modified);

console.log("\nORIGINAL STRING");
console.log(original);

console.log("\nMODIFIED STRING");
console.log(modified);

console.log("\nSHA-256 ORIGINAL");
console.log(hash1);

console.log("\nSHA-256 MODIFIED");
console.log(hash2);

console.log("\nAVALANCHE EFFECT");
console.log("Different hex chars:", countDiff(hash1, hash2), "out of", hash1.length);
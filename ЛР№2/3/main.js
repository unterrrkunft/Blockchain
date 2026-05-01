const CryptoJS = require('crypto-js');

const base = "student_test";
const prefixLength = 4; // можна міняти 1–5

function sha256(input) {
    return CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
}

function getPrefix(hash, len) {
    return hash.substring(0, len);
}

async function findCollision() {
    let map = {}; // prefix -> {nonce, hash, fullString}

    let nonce = 0;
    let attempts = 0;

    while (true) {
        const input = base + nonce;
        const hash = sha256(input);
        const prefix = getPrefix(hash, prefixLength);

        attempts++;

        // якщо вже бачили цей префікс
        if (map[prefix]) {
            const first = map[prefix];

            if (first.nonce !== nonce) {
                console.log("\nCOLLISION FOUND");

                console.log("\nString A:");
                console.log(first.full);
                console.log("Nonce:", first.nonce);
                console.log("Hash:", first.hash);

                console.log("\nString B:");
                console.log(input);
                console.log("Nonce:", nonce);
                console.log("Hash:", hash);

                console.log("\nPrefix:", prefix);
                console.log("Attempts:", attempts);

                break;
            }
        } else {
            map[prefix] = {
                nonce,
                hash,
                full: input
            };
        }

        nonce++;
    }
}

findCollision();
const crypto = require('crypto');

// Генерація RSA ключів
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
});

// Повідомлення
const message = "Blockchain transaction #123";

// Підпис
function sign(data) {
    return crypto.sign("sha256", Buffer.from(data), privateKey).toString("hex");
}

// Перевірка підпису
function verify(data, signature) {
    return crypto.verify(
        "sha256",
        Buffer.from(data),
        publicKey,
        Buffer.from(signature, "hex")
    );
}

// Скорочений public key
const pubKeyShort = publicKey.export({ type: "pkcs1", format: "pem" })
    .split("\n")[1]
    .slice(0, 40) + "...";

// ORIGINAL
const signature = sign(message);
const isValidOriginal = verify(message, signature);

// MODIFIED MESSAGE
const modifiedMessage = message + " (tampered)";
const isValidModified = verify(modifiedMessage, signature);

// OUTPUT
console.log("\nPUBLIC KEY (short)");
console.log(pubKeyShort);

console.log("\nMESSAGE");
console.log(message);

console.log("\nSIGNATURE (hex)");
console.log(signature);

console.log("\nVERIFICATION");
console.log("Original message valid:", isValidOriginal);
console.log("Modified message valid:", isValidModified);

console.log("\nEXPLANATION");
console.log("- Приватний ключ використовується для створення підпису");
console.log("- Публічний ключ використовується для перевірки");
console.log("- Змінене повідомлення завжди дає INVALID підпис");
console.log("- Приватний ключ не передається, бо тоді можна підробити підписи");
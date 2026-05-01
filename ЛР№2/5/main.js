const crypto = require('crypto');

// Генерація ключів
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
});

// Документ
const document = {
    id: "DOC-001",
    content: "This is a confidential blockchain document"
};

// Функція підпису
function sign(data) {
    return crypto.sign(
        "sha256",
        Buffer.from(data),
        privateKey
    ).toString("hex");
}

// Функція перевірки
function verify(data, signature) {
    return crypto.verify(
        "sha256",
        Buffer.from(data),
        publicKey,
        Buffer.from(signature, "hex")
    );
}

// Серіалізація документа
function serialize(doc) {
    return JSON.stringify(doc);
}

// ORIGINAL
const originalData = serialize(document);
const signature = sign(originalData);
const validOriginal = verify(originalData, signature);

// MODIFIED DOCUMENT
const tamperedDoc = { ...document, content: "HACKED CONTENT" };
const tamperedData = serialize(tamperedDoc);
const validTamperedDoc = verify(tamperedData, signature);

// TAMPERED SIGNATURE
const fakeSignature = signature.slice(0, -2) + "ff";
const validFakeSignature = verify(originalData, fakeSignature);

// OUTPUT
console.log("\nDOCUMENT");
console.log(document);

console.log("\nSIGNATURE");
console.log(signature);

console.log("\nRESULTS");

console.log("A) Original document valid:", validOriginal);
console.log("B) Modified document valid:", validTamperedDoc);
console.log("C) Fake signature valid:", validFakeSignature);

console.log("\nEXPLANATION");
console.log("- Підпис прив’язаний до конкретного вмісту документа");
console.log("- Будь-яка зміна → інший хеш → перевірка не проходить");
console.log("- Підробка підпису без приватного ключа неможлива");
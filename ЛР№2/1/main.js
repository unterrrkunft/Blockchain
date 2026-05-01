const readline = require('readline');
const CryptoJS = require('crypto-js');

// інтерфейс для вводу
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Введіть рядок: ", (input) => {

    // SHA-256
    const sha256 = CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);

    // SHA3-256
    const sha3 = CryptoJS.SHA3(input, { outputLength: 256 }).toString(CryptoJS.enc.Hex);

    console.log("\n=== РЕЗУЛЬТАТИ ===");

    console.log("\nSHA-256:");
    console.log(sha256);

    console.log("\nSHA3-256:");
    console.log(sha3);

    console.log("\n=== ПОРІВНЯННЯ ===");
    console.log("Довжина SHA-256:", sha256.length);
    console.log("Довжина SHA3-256:", sha3.length);

    console.log("\n=== ВИСНОВОК ===");
    console.log("- Обидва алгоритми дають хеш довжиною 64 hex символи (256 біт)");
    console.log("- SHA-256: швидший, широко використовується в Bitcoin");
    console.log("- SHA3-256: сучасніший і більш стійкий до атак (краща криптостійкість)");
    console.log("- У блокчейні важливіша надійність, тому SHA-3 вважається більш безпечним варіантом");

    rl.close();
});
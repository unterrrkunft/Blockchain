import Web3 from 'web3';

const web3 = new Web3('http://127.0.0.1:8545');

const contractAddress = "0x637Fa2c9A0353ACc56dc01B53C9215dc5184AC64";

const abi = [
  {
    "inputs": [],
    "name": "greet",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_newGreet", "type": "string" }],
    "name": "setGreet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const contract = new web3.eth.Contract(abi, contractAddress);

async function run() {
  const accounts = await web3.eth.getAccounts();

  // читання
  const greet = await contract.methods.greet().call();
  console.log("Before:", greet);

  // запис
  await contract.methods.setGreet("Hello from Node.js!").send({
    from: accounts[0]
  });

  // повторне читання
  const updated = await contract.methods.greet().call();
  console.log("After:", updated);
}

run();
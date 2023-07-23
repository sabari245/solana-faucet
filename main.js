import './style.css'
import * as solanaWeb3 from "@solana/web3.js"


// Initialize Solana web3.js
const solanaNetwork = "https://api.devnet.solana.com"; // Replace with the desired network (mainnet-beta, testnet, etc.)
const connection = new solanaWeb3.Connection(solanaNetwork);

// Wallet variables
let tempWallet = null;
let connectedWallet = null;


function generateKeypairFromPrivateKey(privateKeyStr) {
  // Convert the private key string to an array of integers
  const privateKeyArray = privateKeyStr.split(",").map(Number);

  if (privateKeyArray.length !== 64) {
    throw new Error("Invalid private key length. It should be 32 bytes.");
  }

  // Convert the array of integers to a Uint8Array
  const privateKeyUint8Array = new Uint8Array(privateKeyArray);

  // Create the keypair from the provided private key
  const keypair = solanaWeb3.Keypair.fromSecretKey(privateKeyUint8Array);

  return keypair;
}

// Example usage with the provided private key
const privateKeyStr = "255,110,205,174,158,30,53,165,195,86,255,61,152,70,87,158,73,206,206,142,81,249,180,106,216,93,65,234,113,121,201,110,79,117,36,193,37,237,213,12,174,55,189,217,97,187,161,176,176,98,247,139,59,199,62,130,54,247,151,86,170,38,228,161";
tempWallet = generateKeypairFromPrivateKey(privateKeyStr);

document.getElementById("temp").textContent = `Temporary Wallet Address: ${tempWallet.publicKey.toBase58()}`;

// Function to create a temporary keypair and airdrop 2 SOL
async function createTemporaryWallet() {
  try {
    // tempWallet = solanaWeb3.Keypair.generate();
    const airdropAmount = solanaWeb3.LAMPORTS_PER_SOL * 2;

    // Airdrop 2 SOL to the temporary wallet
    // const signature = await connection.requestAirdrop(tempWallet.publicKey, airdropAmount);
    // await connection.confirmTransaction(signature);

    // console.log(tempWallet.secretKey.toString());

    // Display the address of the temporary wallet
    document.getElementById("temp").textContent = `Temporary Wallet Address: ${tempWallet.publicKey.toBase58()}`;
  } catch (error) {
    console.error("Error creating temporary wallet:", error);
  }
}

// Function to connect to the Phantom wallet
async function connectToWallet() {
  try {
    const wallet = await window.solana.connect();
    if (wallet) {
      connectedWallet = wallet;
      document.getElementById("wallet").textContent = `Connected Wallet Address: ${connectedWallet.publicKey.toBase58()}`;
    } else {
      console.error("No connected wallet found.");
    }
  } catch (error) {
    console.error("Error connecting to wallet:", error);
  }
}

// Function to transfer 1.9 SOL from the temporary wallet to the connected wallet
async function transferFunds() {
  try {
    if (!tempWallet || !connectedWallet) {
      console.error("Temporary wallet or connected wallet not initialized.");
      return;
    }

    console.log("called transfer funds function")

    const transaction = new solanaWeb3.Transaction()
    console.log("created transaction object")


    const sendSolInstruction = solanaWeb3.SystemProgram.transfer({
        fromPubkey: new solanaWeb3.PublicKey(tempWallet.publicKey),
        toPubkey: new solanaWeb3.PublicKey(connectedWallet.publicKey),
        lamports: solanaWeb3.LAMPORTS_PER_SOL * 1.99999
    })

    transaction.add(sendSolInstruction)

    console.log("created transaction")

    // Sign and send the transaction
    const signature = await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [tempWallet]);
    console.log("Transaction successful. Signature:", signature);
  } catch (error) {
    console.error("Error transferring funds:", error);
  }
}

// Event listeners for buttons
document.getElementById("create").addEventListener("click", createTemporaryWallet);
document.getElementById("connect").addEventListener("click", connectToWallet);
document.getElementById("transfer").addEventListener("click", transferFunds);


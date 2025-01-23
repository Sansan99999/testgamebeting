let web3;
let contract;
const contractAddress = "0x77ad33859b6382f49bd7e626c8594fad19979cfe"; // Replace with your contract address

// Function to load the ABI dynamically
async function loadContractABI() {
    try {
        const response = await fetch('contractABI.json'); // Load the ABI from a JSON file
        return await response.json();
    } catch (error) {
        console.error("Failed to load contract ABI:", error);
        alert("Unable to load contract ABI. Please check your setup.");
        return null;
    }
}

// Function to connect the wallet
async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const accounts = await web3.eth.getAccounts();
        document.getElementById('walletInfo').innerText = `Connected Wallet: ${accounts[0]}`;
        console.log("Wallet Connected");

        // Load the contract ABI dynamically and initialize the contract
        const abi = await loadContractABI();
        if (abi) {
            contract = new web3.eth.Contract(abi, contractAddress);
            console.log("Contract Initialized:", contract);
        }
    } else {
        alert("Metamask not detected!");
    }
}

// Function to place a bet
async function placeBet() {
    const accounts = await web3.eth.getAccounts();
    const betAmount = document.getElementById("betAmount").value;

    if (!betAmount || betAmount <= 0) {
        alert("Enter a valid bet amount!");
        return;
    }

    const amountInWei = web3.utils.toWei(betAmount, "tea");

    contract.methods.placeBet(amountInWei).send({ from: accounts[0], value: amountInWei })
        .on('transactionHash', function(hash) {
            document.getElementById("transactionStatus").innerText = `Transaction in Progress: ${hash}`;
            console.log("Transaction Hash:", hash);
        })
        .on('receipt', function(receipt) {
            document.getElementById("transactionStatus").innerText = `Transaction Successful: ${receipt.transactionHash}`;
            console.log("Transaction Successful:", receipt);
        })
        .on('error', function(error) {
            document.getElementById("transactionStatus").innerText = `Transaction Failed: ${error.message}`;
            console.error("Transaction Failed:", error);
        });
}

// Assign event listeners to buttons
document.getElementById("connectWallet").onclick = connectWallet;
document.getElementById("placeBet").onclick = placeBet;

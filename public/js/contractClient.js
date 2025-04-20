// js/contractClient.js
import { ethers } from 'ethers';

const contractAddress = '0xC455Ac8Df3B06a99D76Bf40eFe97531C6B4EE5AA';
const abi = [
  {"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"decrementBalance","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"incrementBalance","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"setBalance","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
];

let contract;

async function init() {
  if (window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);
  } else {
    console.error('Ethereum wallet not found');
  }
}

async function getBalance(user) {
  if (!contract) await init();
  const balance = await contract.getBalance(user);
  return balance.toNumber();
}

async function incrementBalance(user, amount) {
  if (!contract) await init();
  const tx = await contract.incrementBalance(user, amount);
  await tx.wait();
}

async function decrementBalance(user, amount) {
  if (!contract) await init();
  const tx = await contract.decrementBalance(user, amount);
  await tx.wait();
}

// store balance explicitly
async function setBalance(user, amount) {
  if (!contract) await init();
  const tx = await contract.setBalance(user, amount);
  await tx.wait();
}

// expose globally
window.contractClient = { getBalance, incrementBalance, decrementBalance, setBalance };

// js/tokenEarner.js

const TokenEarner = (function () {
  let balance = 0;
  let sources = [];

  async function init() {
    // initialize on-chain balance
    if (window.contractClient && window.currentUser) {
      balance = await window.contractClient.getBalance(window.currentUser);
    } else {
      balance = 0;
    }
    sources = [];
    updateDisplay();
  }

  async function reward(amount = 50, source = 'Unknown') {
    if (window.contractClient && window.currentUser) {
      await window.contractClient.incrementBalance(window.currentUser, amount);
      balance = await window.contractClient.getBalance(window.currentUser);
    } else {
      balance += amount;
    }
    sources.push({ source, amount });
    updateDisplay();
  }

  async function spend(amount = 0, source = 'Redeem') {
    if (window.contractClient && window.currentUser) {
      await window.contractClient.decrementBalance(window.currentUser, amount);
      balance = await window.contractClient.getBalance(window.currentUser);
      updateDisplay();
    }
  }

  function getBalance() {
    return balance;
  }

  async function fetchBalance() {
    if (window.contractClient && window.currentUser) {
      return await window.contractClient.getBalance(window.currentUser);
    }
    return balance;
  }

  function getSources() {
    return sources;
  }

  function updateDisplay() {
    const el = document.getElementById('points-balance');
    if (el) el.textContent = balance;
  }

  return {
    init,
    reward,
    spend,
    getBalance,
    fetchBalance,
    getSources
  };
})();

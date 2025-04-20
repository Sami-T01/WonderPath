// js/voucherRedeemer.js

const VoucherRedeemer = (function() {

    function init() {
      const btn = document.getElementById('redeemButton');
      if (btn) {
        btn.addEventListener('click', async () => await redeem());
      }
    }
  
    async function redeem() {
      const costInput = document.getElementById('voucherCost');
      const cost = parseInt(costInput.value, 10) || 0;
      // check on-chain balance
      let balance = await TokenEarner.fetchBalance();
      if (balance < cost) {
        alert('❌ Sorry, you don’t have enough points to redeem that voucher.');
        return;
      }
      // spend on-chain
      await TokenEarner.spend(cost);
      alert(`🎊 Congratulations! You’ve redeemed a voucher for ${cost} points.`);
    }
  
    return { init };
  
  })();
  
  // Initialize on page load
  window.addEventListener('load', () => {
    VoucherRedeemer.init();
  });
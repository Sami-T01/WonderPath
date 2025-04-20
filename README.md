# WonderPath

**Reward your journey. Explore cities. Earn tokens.**  
A Web3 experience platform powered by smart contracts on Polkadot Asset Hub.

Video demostrations
- https://youtu.be/4ZAtX-eVl44
- https://youtube.com/shorts/IWaujSTLFz8

---

## ✨ Summary

WonderPath is a Web3 dApp that lets users earn tokens by exploring real-world places based on their interests and time budget. Rewards are distributed on-chain through smart contracts on Polkadot Asset Hub.

---

## 🧩 Features

- ✅ Connect your Polkadot wallet (via Polkadot.js extension)
- ✅ Select start & end locations + POI interests
- ✅ Get smart, filtered route suggestions
- ✅ Earn tokens by visiting real-world locations
- ✅ Redeem tokens for vouchers or rewards

---

## ⚙️ Tech Stack

| Layer        | Stack / Tools                                |
|--------------|-----------------------------------------------|
| Frontend     | Next.js                         |
| Wallet       | [Polkadot.js Extension](https://polkadot.js.org/extension) |
| Smart Contracts | Ink! (Rust-based) on Polkadot Asset Hub    |
| Chain API    | [`@polkadot/api`](https://polkadot.js.org/docs/api/) |
| Maps         | Google Maps JS API                            |

---

## 🧠 Why Polkadot?

Polkadot provides:

- 🛡 **Shared security** from the Relay Chain   
- 🪙 **Native assets** on Asset Hub  
- 🧩 Smart contracts via Asset Hub, an EVM-compatible parachain
- ⚡ Smart contract testing and deployment via Remix IDE

WonderPath uses **Asset Hub** to deploy smart contracts that:

- Issue and manage tokens
- Track on-chain routes
- Verify journey checkpoints
- Handle voucher redemption

---

## 🚀 Deployment Instructions

### 1. 📁 Clone this repository

```bash
git clone https://github.com/Sami-T01/wonderpath.git
cd wonderpath
npm install
npm run dev
```

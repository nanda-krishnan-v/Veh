# 🚗 Car Registry DApp - Quick Start

## What You Have

A complete **decentralized application (DApp)** with:

- ✅ Smart contract (Solidity)
- ✅ Frontend (React + Vite)
- ✅ Hardhat development environment
- ✅ Automated tests
- ✅ Local blockchain setup

## ⚡ Quick Start (3 Steps)

### 1️⃣ Start Local Blockchain

Open a terminal and run:

```bash
npm run node
```

**Keep this running!** You'll see:

- 20 test accounts with 10,000 ETH each
- Network running on `http://127.0.0.1:8545`

### 2️⃣ Deploy Smart Contract

Open a **new terminal** and run:

```bash
npm run deploy
```

**Copy the contract address** from the output! It looks like:

```
✅ CarRegistry deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### 3️⃣ Start Frontend

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🦊 Configure MetaMask

### Add Hardhat Network:

1. Open MetaMask
2. Click network dropdown → "Add network" → "Add a network manually"
3. Enter:
   - **Network name**: `Hardhat Local`
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `31337`
   - **Currency symbol**: `ETH`

### Import Test Account:

1. Copy a private key from the terminal running `npm run node`
2. In MetaMask: Click account icon → "Import account"
3. Paste the private key

**Done!** Now connect MetaMask to your DApp and register cars! 🎉

---

## 🔧 Development Commands

| Command           | Purpose                 |
| ----------------- | ----------------------- |
| `npm run compile` | Compile smart contracts |
| `npm test`        | Run contract tests      |
| `npm run node`    | Start local blockchain  |
| `npm run deploy`  | Deploy to local network |
| `npm run dev`     | Start frontend          |

---

## 📖 Need More Details?

See [HARDHAT_GUIDE.md](./HARDHAT_GUIDE.md) for:

- Why we use Hardhat
- Detailed workflow
- Testing best practices
- Troubleshooting
- Deploying to testnets

---

## 🐛 Common Issues

**"Transaction failed"**

- Reset MetaMask: Settings → Advanced → Clear activity tab data

**"Cannot connect to network"**

- Make sure `npm run node` is running
- Check MetaMask is on Hardhat Local network

**"Contract not found"**

- Redeploy with `npm run deploy`
- Update contract address in `App.jsx`

---

**Happy Coding! 🚀**

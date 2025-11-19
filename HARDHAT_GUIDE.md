# 🛠️ Hardhat Integration Guide

## Why We Need Hardhat

**Hardhat** is a professional development environment for Ethereum smart contracts. Here's why it's essential for your car registry dApp:

### 1. **Local Blockchain for Development** 🌐

- Runs a local Ethereum network on your machine
- No need to spend real ETH during development
- Fast transaction confirmations (instant vs. 12+ seconds on mainnet)
- Can reset the blockchain state anytime

### 2. **Smart Contract Compilation** 🔨

- Compiles Solidity code to bytecode
- Generates ABI (Application Binary Interface) for frontend integration
- Catches compilation errors before deployment
- Optimizes contract code for gas efficiency

### 3. **Automated Testing** ✅

- Write comprehensive tests in JavaScript/TypeScript
- Test contract behavior before deployment
- Catch bugs early and save gas costs
- Run tests automatically on every change

### 4. **Easy Deployment** 🚀

- Deploy contracts to local, testnet, or mainnet with simple commands
- Manage multiple network configurations
- Track deployed contract addresses
- Deploy with a single command

### 5. **Debugging Tools** 🐛

- Stack traces when transactions fail
- Console.log support in Solidity
- Detailed error messages
- Gas usage analysis

### 6. **Professional Workflow** 💼

- Industry-standard tooling
- TypeChain for type-safe contract interactions
- Ethers.js integration
- Plugin ecosystem for additional features

---

## 🚀 Getting Started

### Step 1: Install Dependencies

```bash
npm install
```

This installs:

- `hardhat` - The core framework
- `@nomicfoundation/hardhat-toolbox` - Essential plugins bundle
- `@nomicfoundation/hardhat-ethers` - Ethers.js integration
- `chai` - Testing framework

### Step 2: Compile Smart Contracts

```bash
npm run compile
```

This will:

- Compile `CarRegistry.sol`
- Generate artifacts in `./artifacts`
- Create ABI files for frontend integration
- Check for Solidity errors

**Output**: You'll see compilation artifacts in the `artifacts/` folder.

### Step 3: Run Tests

```bash
npm test
```

This runs the test suite in `test/CarRegistry.test.js` to verify:

- Contract deploys correctly
- Car registration works
- Data retrieval is accurate
- Events are emitted properly
- Gas usage is optimized

### Step 4: Start Local Blockchain

Open a **separate terminal** and run:

```bash
npm run node
```

This starts a local Hardhat network that:

- Runs on `http://localhost:8545`
- Provides 20 test accounts with 10,000 ETH each
- Mines blocks instantly
- Shows transaction logs in real-time

**Keep this terminal running!** This is your local blockchain.

### Step 5: Deploy Contract

In a **new terminal**, deploy the contract:

```bash
npm run deploy
```

This will:

- Deploy `CarRegistry.sol` to your local network
- Print the contract address
- Save deployment information

**Important**: Copy the contract address from the output!

### Step 6: Configure MetaMask

1. Open MetaMask
2. Add Network:

   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

3. Import a test account:
   - Copy a private key from the terminal running `npm run node`
   - Import it into MetaMask

### Step 7: Update Frontend

Update the contract address in `App.jsx`:

```javascript
const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

### Step 8: Start Frontend

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📝 Available Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `npm run node`    | Start local Hardhat blockchain |
| `npm run compile` | Compile smart contracts        |
| `npm run deploy`  | Deploy to local network        |
| `npm run test`    | Run contract tests             |
| `npm run dev`     | Start Vite dev server          |
| `npm run build`   | Build for production           |

---

## 🔄 Development Workflow

### Standard Development Flow:

1. **Write/Modify Contract** (`contracts/CarRegistry.sol`)
2. **Write Tests** (`test/CarRegistry.test.js`)
3. **Run Tests** (`npm test`)
4. **Compile** (`npm run compile`)
5. **Start Node** (`npm run node` in separate terminal)
6. **Deploy** (`npm run deploy`)
7. **Update Frontend** (copy contract address to `App.jsx`)
8. **Test in Browser** (`npm run dev`)

### Quick Iteration:

When you modify the contract:

```bash
# Terminal 1: Keep running
npm run node

# Terminal 2: Redeploy
npm run compile
npm run deploy

# Update contract address in App.jsx
# Refresh browser
```

---

## 🌍 Network Configuration

The `hardhat.config.js` defines networks:

### Local Development:

- **hardhat**: In-memory network (fast, resets on restart)
- **localhost**: Persistent network (run `npm run node` first)

### Adding Testnets:

To deploy to Sepolia or other testnets, add to `hardhat.config.js`:

```javascript
sepolia: {
  url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
  accounts: [PRIVATE_KEY]
}
```

Then deploy with:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

---

## 🧪 Testing Best Practices

The test file (`test/CarRegistry.test.js`) demonstrates:

- **Setup**: Deploy fresh contract before each test
- **Assertions**: Verify expected behavior
- **Events**: Test event emissions
- **Edge Cases**: Handle empty values, multiple entries
- **Gas Tracking**: Monitor gas usage

Run specific tests:

```bash
npx hardhat test --grep "Car Registration"
```

---

## 🐛 Troubleshooting

### "Error: Cannot find module 'hardhat'"

```bash
npm install
```

### "Error: Network localhost is not running"

Start the node first:

```bash
npm run node
```

### "Transaction failed" in MetaMask

- Reset MetaMask account (Settings → Advanced → Clear activity)
- Make sure you're connected to Hardhat Local network

### Contract address not working

- Redeploy the contract
- Update the address in `App.jsx`
- Hard refresh browser (Ctrl+Shift+R)

---

## 📚 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)

---

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Compile contracts
3. ✅ Run tests
4. ✅ Start local node
5. ✅ Deploy contract
6. ✅ Configure MetaMask
7. ✅ Test in browser

**Happy Building! 🚗💨**

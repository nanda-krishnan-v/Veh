# 🚗 Digital Car Registry DApp

A beautiful, full-stack decentralized application for managing a digital car registry on the blockchain. Built with React, Solidity, Ethers.js, and Tailwind CSS.

## ✨ Features

- **Smart Contract**: Solidity-based car registry with owner and model tracking
- **Beautiful UI**: Modern, responsive dashboard built with Tailwind CSS
- **Metamask Integration**: Seamless wallet connection and transaction management
- **Local Development**: Configured for Hardhat local blockchain
- **Real-time Updates**: Automatic refresh of car listings after registration
- **Transaction Feedback**: Clear loading states and success/error messages

## 📋 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Metamask** browser extension

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Hardhat Dependencies (Blockchain)

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

### 3. Start Local Hardhat Node

Open a new terminal and run:

```bash
npx hardhat node
```

This will start a local blockchain on `http://localhost:8545` and display test accounts with private keys.

### 4. Deploy the Smart Contract

In another terminal, deploy the contract:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

**Important**: Copy the deployed contract address and update it in `App.jsx`:

```javascript
const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

### 5. Configure Metamask

1. Open Metamask
2. Add a new network:
   - **Network Name**: Hardhat Local
   - **RPC URL**: http://localhost:8545
   - **Chain ID**: 31337
   - **Currency Symbol**: ETH
3. Import one of the test accounts using a private key from the Hardhat node output

### 6. Start the React App

```bash
npm run dev
```

The application will open at `http://localhost:3000`

## 🎯 How to Use

1. **Connect Wallet**: Click "Connect Wallet" button in the header
2. **Register a Car**: 
   - Enter the owner's name
   - Enter the car model
   - Click "Register Car"
   - Confirm the transaction in Metamask
3. **View Registered Cars**: All cars will appear in the table on the right
4. **Refresh**: Click the refresh button to manually reload the car list

## 📁 Project Structure

```
car-registry-dapp/
├── App.jsx                 # Main React component with full DApp logic
├── contracts/
│   └── CarRegistry.sol     # Solidity smart contract
├── scripts/
│   └── deploy.js           # Deployment script
├── src/
│   ├── main.jsx           # React entry point
│   └── index.css          # Tailwind CSS imports
├── hardhat.config.js      # Hardhat configuration
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── package.json           # Dependencies
└── README.md              # This file
```

## 🔧 Smart Contract

The `CarRegistry.sol` contract includes:

```solidity
struct Car {
    string ownerName;
    string carModel;
}

function registerCar(string memory _ownerName, string memory _carModel)
function getAllCars() public view returns (Car[] memory)
```

## 🎨 UI Features

- **Gradient Backgrounds**: Beautiful color gradients throughout
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Loading States**: Visual feedback during blockchain operations
- **Error Handling**: Clear error messages for failed transactions
- **Network Status**: Real-time display of connected network and wallet
- **Professional Tables**: Clean, organized display of registered cars

## 🛠️ Technologies Used

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Blockchain**: Solidity, Hardhat
- **Web3**: Ethers.js v6
- **Wallet**: Metamask

## 📝 Common Issues

### Transaction Fails
- Ensure you're connected to the Hardhat network (Chain ID: 31337)
- Check that the contract address is correct in App.jsx
- Verify you have sufficient test ETH

### Can't Connect Wallet
- Install Metamask extension
- Add Hardhat network to Metamask
- Import a test account from Hardhat node

### Contract Not Found
- Make sure Hardhat node is running
- Verify contract is deployed
- Check the contract address matches

## 🔐 Security Note

This is a development application meant for local testing. Never use test private keys or deploy to mainnet without proper security audits.

## 📄 License

MIT License - Feel free to use this project for learning and development.

## 🙌 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using React, Solidity, and Web3

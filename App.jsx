import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import DarkVeil from "./src/DarkVeil";
import VehLogo from "./src/VehLogo";

// ============================================================================
// SOLIDITY CONTRACT ABI
// ============================================================================
// Contract: CarRegistry.sol
//
// pragma solidity ^0.8.0;
//
// contract CarRegistry {
//     struct Car {
//         string ownerName;
//         string carModel;
//     }
//
//     Car[] public cars;
//
//     function registerCar(string memory _ownerName, string memory _carModel) public {
//         cars.push(Car(_ownerName, _carModel));
//     }
//
//     function getAllCars() public view returns (Car[] memory) {
//         return cars;
//     }
// }
// ============================================================================

const CAR_REGISTRY_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "carId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "ownerName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "carModel",
        type: "string",
      },
    ],
    name: "CarRegistered",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "cars",
    outputs: [
      {
        internalType: "string",
        name: "ownerName",
        type: "string",
      },
      {
        internalType: "string",
        name: "carModel",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllCars",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "ownerName",
            type: "string",
          },
          {
            internalType: "string",
            name: "carModel",
            type: "string",
          },
        ],
        internalType: "struct CarRegistry.Car[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCarCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_ownerName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_carModel",
        type: "string",
      },
    ],
    name: "registerCar",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// Default local Hardhat deployment address
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const HARDHAT_NETWORK_ID = "31337"; // Default Hardhat chain ID

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

function App() {
  // State management
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [contract, setContract] = useState(null);
  const [cars, setCars] = useState([]);
  const [ownerName, setOwnerName] = useState("");
  const [carModel, setCarModel] = useState("");
  const [loading, setLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);

  // Check if Metamask is installed
  useEffect(() => {
    setIsMetamaskInstalled(typeof window.ethereum !== "undefined");
  }, []);

  // Connect to Metamask
  const connectWallet = async () => {
    if (!window.ethereum) {
      setMessage({
        type: "error",
        text: "Metamask not detected! Please install Metamask extension.",
      });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      let network = await provider.getNetwork();

      // Check if connected to Hardhat network
      if (network.chainId.toString() !== HARDHAT_NETWORK_ID) {
        try {
          // Try to switch to Hardhat network
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x7a69" }], // 0x7a69 = 31337 in hex
          });
          // Refresh provider after network switch
          const newProvider = new ethers.BrowserProvider(window.ethereum);
          const newSigner = await newProvider.getSigner();
          network = await newProvider.getNetwork();
          setAccount(accounts[0]);
          setNetwork(network);

          const contractInstance = new ethers.Contract(
            CONTRACT_ADDRESS,
            CAR_REGISTRY_ABI,
            newSigner
          );
          setContract(contractInstance);

          setMessage({
            type: "success",
            text: "Switched to Hardhat local network!",
          });

          await loadCars(contractInstance);
        } catch (switchError) {
          // Network doesn't exist in MetaMask, try to add it
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0x7a69", // 31337 in hex
                    chainName: "Hardhat Local",
                    nativeCurrency: {
                      name: "ETH",
                      symbol: "ETH",
                      decimals: 18,
                    },
                    rpcUrls: ["http://127.0.0.1:8545"],
                  },
                ],
              });
              // After adding, try connecting again
              await connectWallet();
            } catch (addError) {
              setMessage({
                type: "error",
                text: `Failed to add Hardhat network: ${addError.message}`,
              });
            }
          } else {
            setMessage({
              type: "error",
              text: `Please switch to Hardhat Local network (Chain ID 31337) in MetaMask manually.`,
            });
          }
        }
      } else {
        setAccount(accounts[0]);
        setNetwork(network);

        // Initialize contract
        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          CAR_REGISTRY_ABI,
          signer
        );
        setContract(contractInstance);

        setMessage({
          type: "success",
          text: "Successfully connected to Hardhat local network!",
        });

        // Load existing cars
        await loadCars(contractInstance);
      }
    } catch (error) {
      console.error("Connection error:", error);
      setMessage({
        type: "error",
        text: `Connection failed: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  // Load all cars from contract
  const loadCars = async (contractInstance = contract) => {
    if (!contractInstance) return;

    try {
      setLoading(true);
      const allCars = await contractInstance.getAllCars();
      setCars(
        allCars.map((car, index) => ({
          id: index,
          ownerName: car.ownerName,
          carModel: car.carModel,
        }))
      );
    } catch (error) {
      console.error("Error loading cars:", error);
      setMessage({
        type: "error",
        text: `Failed to load cars: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  // Register a new car
  const registerCar = async (e) => {
    e.preventDefault();

    if (!contract) {
      setMessage({
        type: "error",
        text: "Please connect your wallet first!",
      });
      return;
    }

    if (!ownerName.trim() || !carModel.trim()) {
      setMessage({
        type: "error",
        text: "Please fill in both Owner Name and Car Model fields.",
      });
      return;
    }

    try {
      setTxLoading(true);
      setMessage({
        type: "info",
        text: "Sending transaction... Please confirm in Metamask.",
      });

      // Call the smart contract function
      const tx = await contract.registerCar(ownerName, carModel);

      setMessage({
        type: "info",
        text: "Transaction submitted. Waiting for confirmation...",
      });

      // Wait for transaction to be mined
      const receipt = await tx.wait();

      setMessage({
        type: "success",
        text: `Car registered successfully! Transaction hash: ${receipt.hash.substring(
          0,
          10
        )}...`,
      });

      // Clear form
      setOwnerName("");
      setCarModel("");

      // Reload cars list
      await loadCars();
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "Transaction failed";

      if (error.code === "ACTION_REJECTED") {
        errorMessage = "Transaction rejected by user.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setMessage({
        type: "error",
        text: `Registration failed: ${errorMessage}`,
      });
    } finally {
      setTxLoading(false);
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          connectWallet();
        } else {
          setAccount(null);
          setContract(null);
          setCars([]);
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
      }
    };
  }, []);

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // ============================================================================
  // RENDER UI
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-950 relative">
      {/* Animated Background */}
      <DarkVeil
        hueShift={20}
        noiseIntensity={0.08}
        scanlineIntensity={0.15}
        speed={0.4}
        scanlineFrequency={3}
        warpAmount={0.4}
      />

      {/* Content overlay */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-cyan-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <VehLogo className="w-16 h-16 sm:w-20 sm:h-20" />
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-cyan-400">
                    VEH Registry
                  </h1>
                  <p className="text-xs sm:text-sm text-cyan-300 font-medium">
                    Decentralized Vehicle Management
                  </p>
                </div>
              </div>

              {/* Wallet Connection */}
              <div className="flex flex-col sm:items-end gap-2">
                {!account ? (
                  <button
                    onClick={connectWallet}
                    disabled={loading || !isMetamaskInstalled}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Connecting...
                      </>
                    ) : !isMetamaskInstalled ? (
                      "Install Metamask"
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                        </svg>
                        Connect Wallet
                      </>
                    )}
                  </button>
                ) : (
                  <div className="bg-gray-800 border-2 border-emerald-500 rounded-lg px-5 py-3">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="font-mono text-sm font-bold">
                        {formatAddress(account)}
                      </span>
                    </div>
                    {network && (
                      <div className="text-xs text-emerald-400 mt-1 font-semibold">
                        {network.chainId.toString() === HARDHAT_NETWORK_ID ? (
                          <span className="flex items-center gap-1">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Hardhat Local Network
                          </span>
                        ) : (
                          `Chain ID: ${network.chainId}`
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Status Messages */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-xl shadow-lg backdrop-blur-sm ${
                message.type === "success"
                  ? "bg-emerald-500/20 border-2 border-emerald-400/40 text-emerald-200"
                  : message.type === "error"
                  ? "bg-red-500/20 border-2 border-red-400/40 text-red-200"
                  : message.type === "warning"
                  ? "bg-yellow-500/20 border-2 border-yellow-400/40 text-yellow-200"
                  : "bg-blue-500/20 border-2 border-blue-400/40 text-blue-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  {message.type === "success" ? (
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  ) : message.type === "error" ? (
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Registration Form */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-xl shadow-xl p-6 border-2 border-gray-700">
                <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-cyan-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Register New Car
                </h2>

                <form onSubmit={registerCar} className="space-y-5">
                  <div>
                    <label
                      htmlFor="ownerName"
                      className="block text-sm font-bold text-cyan-300 mb-2"
                    >
                      Owner Name
                    </label>
                    <input
                      type="text"
                      id="ownerName"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Enter owner's name"
                      disabled={!account || txLoading}
                      className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 disabled:bg-gray-800/30 disabled:cursor-not-allowed placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="carModel"
                      className="block text-sm font-bold text-cyan-300 mb-2"
                    >
                      Car Model
                    </label>
                    <input
                      type="text"
                      id="carModel"
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      placeholder="Enter car model"
                      disabled={!account || txLoading}
                      className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 disabled:bg-gray-800/30 disabled:cursor-not-allowed placeholder-gray-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={
                      !account ||
                      txLoading ||
                      !ownerName.trim() ||
                      !carModel.trim()
                    }
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {txLoading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Register Car
                      </>
                    )}
                  </button>
                </form>

                {!account && (
                  <div className="mt-6 p-4 bg-blue-900/20 border border-blue-200 rounded-xl">
                    <p className="text-sm text-blue-800 flex items-start gap-2">
                      <svg
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Connect your wallet to register a new car on the
                        blockchain.
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Cars Listing */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-xl shadow-xl p-6 border-2 border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
                    <svg
                      className="w-6 h-6 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Registered Cars
                  </h2>
                  <button
                    onClick={() => loadCars()}
                    disabled={!contract || loading}
                    className="bg-gray-700 hover:bg-gray-600 text-cyan-400 px-4 py-2 rounded-lg font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg
                      className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Refresh
                  </button>
                </div>

                {loading && cars.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <svg
                      className="animate-spin h-12 w-12 text-indigo-600 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <p className="text-gray-400 font-medium">
                      Loading registered cars...
                    </p>
                  </div>
                ) : cars.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="bg-gray-100 rounded-full p-6 mb-4">
                      <svg
                        className="w-16 h-16 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-cyan-300 font-bold text-lg mb-2">
                      No cars registered yet
                    </p>
                    <p className="text-gray-400 text-sm font-medium">
                      Be the first to register a car on the blockchain!
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-700 bg-gray-900">
                          <th className="px-4 py-3 text-left text-xs font-bold text-cyan-400 uppercase tracking-wider">
                            #
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-cyan-300 uppercase tracking-wider">
                            Owner Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-cyan-300 uppercase tracking-wider">
                            Car Model
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700/50">
                        {cars.map((car, index) => (
                          <tr
                            key={car.id}
                            className="hover:bg-gray-700 transition-colors duration-150"
                          >
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center justify-center w-8 h-8 bg-cyan-600 text-white rounded-full font-bold text-sm">
                                {index + 1}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <svg
                                  className="w-5 h-5 text-gray-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="text-white font-medium">
                                  {car.ownerName}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <svg
                                  className="w-5 h-5 text-gray-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                                </svg>
                                <span className="text-white font-medium">
                                  {car.carModel}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {cars.length > 0 && (
                  <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                    <p className="text-sm text-indigo-800 flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        <strong>{cars.length}</strong> car
                        {cars.length !== 1 ? "s" : ""} registered on the
                        blockchain
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Network Info Footer */}
          <div className="mt-8 bg-gray-800 rounded-xl shadow-xl p-6 border-2 border-gray-700">
            <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-cyan-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                />
              </svg>
              Network Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-700/50">
                <p className="text-xs text-cyan-400 font-bold uppercase mb-1">
                  Contract Address
                </p>
                <p className="text-sm text-gray-200 font-mono break-all">
                  {CONTRACT_ADDRESS}
                </p>
              </div>
              <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-700/50">
                <p className="text-xs text-cyan-400 font-bold uppercase mb-1">
                  Expected Network
                </p>
                <p className="text-sm text-gray-200 font-medium">
                  Hardhat Local (Chain ID: {HARDHAT_NETWORK_ID})
                </p>
              </div>
              <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-700/50">
                <p className="text-xs text-cyan-400 font-bold uppercase mb-1">
                  RPC Endpoint
                </p>
                <p className="text-sm text-white font-medium">
                  http://localhost:8545
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900/60 backdrop-blur-md border-t border-gray-800 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-gray-400">
              🚗 Digital Car Registry DApp • Built with React, Ethers.js &
              Solidity • Powered by Hardhat
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;

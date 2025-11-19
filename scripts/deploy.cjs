const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying CarRegistry contract...");

  const CarRegistry = await hre.ethers.getContractFactory("CarRegistry");
  const carRegistry = await CarRegistry.deploy();

  await carRegistry.waitForDeployment();

  const address = await carRegistry.getAddress();
  
  console.log("✅ CarRegistry deployed to:", address);
  console.log("\n📝 Update the CONTRACT_ADDRESS in App.jsx with this address:");
  console.log(`   const CONTRACT_ADDRESS = "${address}";`);
  console.log("\n🎉 Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

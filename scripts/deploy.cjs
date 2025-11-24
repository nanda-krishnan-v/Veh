const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

async function main() {
  console.log("🚀 Deploying CarRegistry contract...");

  const CarRegistry = await hre.ethers.getContractFactory("CarRegistry");
  const carRegistry = await CarRegistry.deploy();

  await carRegistry.waitForDeployment();

  const address = await carRegistry.getAddress();
  
  console.log("✅ CarRegistry deployed to:", address);

  // Write deployment info to JSON
  const deploymentInfo = {
    address: address,
    network: hre.network.name,
    timestamp: new Date().toISOString()
  };
  
  const deploymentPath = path.join(__dirname, "..", "deployment.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Deployment info saved to deployment.json");

  // Automatically update App.jsx
  console.log("\n🔄 Updating App.jsx with new contract address...");
  try {
    execSync("node scripts/update-frontend.cjs", { stdio: "inherit" });
  } catch (error) {
    console.error("⚠️  Failed to update App.jsx automatically");
    console.log("\n📝 Please manually update CONTRACT_ADDRESS in App.jsx:");
    console.log(`   const CONTRACT_ADDRESS = "${address}";`);
  }

  console.log("\n🎉 Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

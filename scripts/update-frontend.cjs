const fs = require("fs");
const path = require("path");

// Read the deployed address from deployment.json
const deploymentPath = path.join(__dirname, "..", "deployment.json");
const appJsxPath = path.join(__dirname, "..", "App.jsx");

if (!fs.existsSync(deploymentPath)) {
  console.error(
    "❌ deployment.json not found. Please deploy the contract first."
  );
  process.exit(1);
}

const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
const newAddress = deployment.address;

console.log(`📝 Updating App.jsx with contract address: ${newAddress}`);

// Read App.jsx
let appContent = fs.readFileSync(appJsxPath, "utf8");

// Replace the CONTRACT_ADDRESS line
const contractAddressRegex =
  /const CONTRACT_ADDRESS = ["']0x[a-fA-F0-9]{40}["'];/;

if (!contractAddressRegex.test(appContent)) {
  console.error("❌ Could not find CONTRACT_ADDRESS in App.jsx");
  process.exit(1);
}

appContent = appContent.replace(
  contractAddressRegex,
  `const CONTRACT_ADDRESS = "${newAddress}";`
);

// Write back to App.jsx
fs.writeFileSync(appJsxPath, appContent, "utf8");

console.log("✅ App.jsx updated successfully!");
console.log(`   Contract Address: ${newAddress}`);

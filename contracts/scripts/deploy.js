const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying Prize Pool contracts...");

  // Get the contract factory
  const PoolFactory = await ethers.getContractFactory("PoolFactory");

  // Deploy the factory contract
  const poolFactory = await PoolFactory.deploy();
  await poolFactory.deployed();

  console.log("PoolFactory deployed to:", poolFactory.address);

  // Verify deployment
  const poolCount = await poolFactory.getPoolCount();
  console.log("Initial pool count:", poolCount.toString());

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    poolFactory: poolFactory.address,
    deployer: await poolFactory.signer.getAddress(),
    timestamp: new Date().toISOString(),
  };

  console.log("Deployment completed successfully!");
  console.log("Deployment info:", JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

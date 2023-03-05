const hre = require("hardhat");

async function main() {
  console.log("Deploying Prize Pool DApp contracts...");

  // Deploy PoolFactory
  const PoolFactory = await hre.ethers.getContractFactory("PoolFactory");
  const poolFactory = await PoolFactory.deploy();
  await poolFactory.waitForDeployment();

  const poolFactoryAddress = await poolFactory.getAddress();
  console.log("PoolFactory deployed to:", poolFactoryAddress);

  // Verify deployment
  console.log("Verifying deployment...");
  const poolCount = await poolFactory.getPoolCount();
  console.log("Initial pool count:", poolCount.toString());

  console.log("Deployment completed successfully!");
  console.log("PoolFactory address:", poolFactoryAddress);
  
  return {
    poolFactory: poolFactoryAddress
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

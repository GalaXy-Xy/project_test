const { ethers } = require("hardhat");

async function main() {
  console.log("Analyzing gas usage...");

  // Get contract factories
  const PoolFactory = await ethers.getContractFactory("PoolFactory");
  const PrizePool = await ethers.getContractFactory("PrizePool");

  // Deploy contracts for gas analysis
  console.log("Deploying PoolFactory...");
  const poolFactory = await PoolFactory.deploy();
  await poolFactory.deployed();
  console.log("PoolFactory deployed at:", poolFactory.address);

  // Create a test pool
  console.log("Creating test pool...");
  const createPoolTx = await poolFactory.createPool(
    "Gas Test Pool",
    ethers.utils.parseEther("0.01"),
    1, // winProbability
    10, // winProbabilityDenominator
    20, // platformFeePercentage
    0, // duration
    { value: ethers.utils.parseEther("0.1") }
  );
  
  const createPoolReceipt = await createPoolTx.wait();
  console.log("Pool creation gas used:", createPoolReceipt.gasUsed.toString());

  // Get pool address
  const event = createPoolReceipt.events.find(e => e.event === 'PoolCreated');
  const poolAddress = event.args.poolAddress;
  console.log("Test pool created at:", poolAddress);

  // Test participation
  console.log("Testing participation...");
  const prizePool = PrizePool.attach(poolAddress);
  const participateTx = await prizePool.participate({
    value: ethers.utils.parseEther("0.01")
  });
  
  const participateReceipt = await participateTx.wait();
  console.log("Participation gas used:", participateReceipt.gasUsed.toString());

  // Gas analysis
  const gasAnalysis = {
    poolFactoryDeployment: (await poolFactory.deployTransaction.wait()).gasUsed.toString(),
    poolCreation: createPoolReceipt.gasUsed.toString(),
    participation: participateReceipt.gasUsed.toString(),
    totalGasUsed: createPoolReceipt.gasUsed.add(participateReceipt.gasUsed).toString(),
  };

  console.log("\n=== Gas Analysis ===");
  console.log("PoolFactory Deployment:", gasAnalysis.poolFactoryDeployment);
  console.log("Pool Creation:", gasAnalysis.poolCreation);
  console.log("Participation:", gasAnalysis.participation);
  console.log("Total (Creation + Participation):", gasAnalysis.totalGasUsed);

  // Estimate gas costs in ETH (assuming 20 gwei gas price)
  const gasPrice = ethers.utils.parseUnits("20", "gwei");
  const ethCost = ethers.utils.formatEther(
    ethers.BigNumber.from(gasAnalysis.totalGasUsed).mul(gasPrice)
  );
  console.log("Estimated cost at 20 gwei:", ethCost, "ETH");

  // Save analysis to file
  const fs = require('fs');
  fs.writeFileSync('gas-analysis.json', JSON.stringify(gasAnalysis, null, 2));
  console.log("Gas analysis saved to gas-analysis.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

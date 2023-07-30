const hre = require("hardhat");

async function main() {
  console.log("Starting gas optimization analysis...");

  const [deployer, addr1, addr2, addr3] = await hre.ethers.getSigners();

  // Deploy PoolFactory
  const PoolFactory = await hre.ethers.getContractFactory("PoolFactory");
  const poolFactory = await PoolFactory.deploy();
  await poolFactory.waitForDeployment();

  console.log("PoolFactory deployed to:", await poolFactory.getAddress());

  // Test 1: Pool Creation Gas Usage
  console.log("\n=== Pool Creation Gas Analysis ===");
  
  const createTx = await poolFactory.createPool(
    "Gas Optimization Test Pool",
    hre.ethers.parseEther("0.01"),
    10,
    5,
    7 * 24 * 60 * 60,
    { value: hre.ethers.parseEther("0.1") }
  );

  const createReceipt = await createTx.wait();
  console.log(`Pool creation gas used: ${createReceipt.gasUsed.toString()}`);
  console.log(`Gas price: ${createTx.gasPrice} wei`);
  console.log(`Total cost: ${hre.ethers.formatEther(createReceipt.gasUsed * createTx.gasPrice)} ETH`);

  // Test 2: Participation Gas Usage
  console.log("\n=== Participation Gas Analysis ===");
  
  const pools = await poolFactory.getPools();
  const poolAddress = pools[0];
  const PrizePool = await hre.ethers.getContractFactory("PrizePool");
  const prizePool = PrizePool.attach(poolAddress);

  const participateTx = await prizePool.connect(addr1).participate({
    value: hre.ethers.parseEther("0.01")
  });

  const participateReceipt = await participateTx.wait();
  console.log(`Participation gas used: ${participateReceipt.gasUsed.toString()}`);
  console.log(`Gas price: ${participateTx.gasPrice} wei`);
  console.log(`Total cost: ${hre.ethers.formatEther(participateReceipt.gasUsed * participateTx.gasPrice)} ETH`);

  // Test 3: Multiple Participations
  console.log("\n=== Multiple Participations Gas Analysis ===");
  
  const participationPromises = [];
  for (let i = 0; i < 5; i++) {
    const signer = [addr1, addr2, addr3][i % 3];
    const promise = prizePool.connect(signer).participate({
      value: hre.ethers.parseEther("0.01")
    });
    participationPromises.push(promise);
  }

  const participationTxs = await Promise.all(participationPromises);
  const participationReceipts = await Promise.all(
    participationTxs.map(tx => tx.wait())
  );

  const totalGas = participationReceipts.reduce((sum, receipt) => sum + Number(receipt.gasUsed), 0);
  const averageGas = totalGas / participationReceipts.length;

  console.log(`Total gas for 5 participations: ${totalGas}`);
  console.log(`Average gas per participation: ${averageGas}`);

  // Test 4: Contract State Queries
  console.log("\n=== Contract State Query Gas Analysis ===");
  
  const queryTx = await prizePool.getPoolInfo();
  console.log(`Pool info query gas: ${queryTx.gasLimit?.toString() || 'N/A'}`);

  const historyTx = await prizePool.getUserHistory(addr1.address);
  console.log(`User history query gas: ${historyTx.gasLimit?.toString() || 'N/A'}`);

  // Test 5: Gas Optimization Recommendations
  console.log("\n=== Gas Optimization Recommendations ===");
  
  const recommendations = [
    "1. Use uint256 instead of uint8 for better gas efficiency",
    "2. Pack structs to minimize storage slots",
    "3. Use events instead of storage for historical data",
    "4. Implement batch operations for multiple participations",
    "5. Use external instead of public for view functions",
    "6. Cache frequently accessed storage variables",
    "7. Use assembly for critical operations",
    "8. Implement proxy patterns for upgradeability"
  ];

  recommendations.forEach(rec => console.log(rec));

  // Test 6: Gas Limit Analysis
  console.log("\n=== Gas Limit Analysis ===");
  
  const block = await hre.ethers.provider.getBlock('latest');
  console.log(`Current block gas limit: ${block.gasLimit.toString()}`);
  console.log(`Pool creation uses ${(Number(createReceipt.gasUsed) / Number(block.gasLimit) * 100).toFixed(2)}% of block gas limit`);
  console.log(`Participation uses ${(Number(participateReceipt.gasUsed) / Number(block.gasLimit) * 100).toFixed(2)}% of block gas limit`);

  // Test 7: Cost Analysis
  console.log("\n=== Cost Analysis ===");
  
  const ethPrice = 2000; // Assume $2000 per ETH
  const createCostUSD = Number(hre.ethers.formatEther(createReceipt.gasUsed * createTx.gasPrice)) * ethPrice;
  const participateCostUSD = Number(hre.ethers.formatEther(participateReceipt.gasUsed * participateTx.gasPrice)) * ethPrice;

  console.log(`Pool creation cost: $${createCostUSD.toFixed(2)}`);
  console.log(`Participation cost: $${participateCostUSD.toFixed(2)}`);
  console.log(`Average participation cost: $${(participateCostUSD * 5).toFixed(2)} for 5 participations`);

  console.log("\n✅ Gas optimization analysis completed successfully");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Gas optimization analysis failed:", error);
    process.exit(1);
  });

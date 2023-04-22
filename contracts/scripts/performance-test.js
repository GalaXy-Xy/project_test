const { ethers } = require("hardhat");

async function main() {
  console.log("Running performance tests...");

  const startTime = Date.now();
  const results = {
    deployment: {},
    poolCreation: {},
    participation: {},
    overall: {}
  };

  try {
    // Test 1: Contract Deployment
    console.log("1. Testing contract deployment...");
    const deployStart = Date.now();
    
    const PoolFactory = await ethers.getContractFactory("PoolFactory");
    const poolFactory = await PoolFactory.deploy();
    await poolFactory.deployed();
    
    const deployEnd = Date.now();
    results.deployment = {
      time: deployEnd - deployStart,
      address: poolFactory.address,
      gasUsed: (await poolFactory.deployTransaction.wait()).gasUsed.toString()
    };
    console.log(`   Deployment completed in ${results.deployment.time}ms`);

    // Test 2: Pool Creation Performance
    console.log("2. Testing pool creation performance...");
    const createStart = Date.now();
    
    const tx = await poolFactory.createPool(
      "Performance Test Pool",
      ethers.utils.parseEther("0.01"),
      1, 10, 20, 0,
      { value: ethers.utils.parseEther("0.1") }
    );
    
    const receipt = await tx.wait();
    const createEnd = Date.now();
    
    results.poolCreation = {
      time: createEnd - createStart,
      gasUsed: receipt.gasUsed.toString(),
      blockNumber: receipt.blockNumber
    };
    console.log(`   Pool creation completed in ${results.poolCreation.time}ms`);

    // Get pool address
    const event = receipt.events.find(e => e.event === 'PoolCreated');
    const poolAddress = event.args.poolAddress;
    console.log(`   Pool created at: ${poolAddress}`);

    // Test 3: Participation Performance
    console.log("3. Testing participation performance...");
    const PrizePool = await ethers.getContractFactory("PrizePool");
    const prizePool = PrizePool.attach(poolAddress);
    
    const participateStart = Date.now();
    const participateTx = await prizePool.participate({
      value: ethers.utils.parseEther("0.01")
    });
    const participateReceipt = await participateTx.wait();
    const participateEnd = Date.now();
    
    results.participation = {
      time: participateEnd - participateStart,
      gasUsed: participateReceipt.gasUsed.toString(),
      blockNumber: participateReceipt.blockNumber
    };
    console.log(`   Participation completed in ${results.participation.time}ms`);

    // Overall Performance
    const endTime = Date.now();
    results.overall = {
      totalTime: endTime - startTime,
      averageTime: (results.deployment.time + results.poolCreation.time + results.participation.time) / 3
    };

    console.log("\n=== Performance Results ===");
    console.log("Deployment:", results.deployment);
    console.log("Pool Creation:", results.poolCreation);
    console.log("Participation:", results.participation);
    console.log("Overall:", results.overall);

    // Performance Analysis
    const analysis = {
      excellent: results.overall.totalTime < 30000, // < 30 seconds
      good: results.overall.totalTime < 60000, // < 1 minute
      acceptable: results.overall.totalTime < 120000, // < 2 minutes
    };

    console.log("\n=== Performance Analysis ===");
    console.log("Excellent (< 30s):", analysis.excellent);
    console.log("Good (< 1m):", analysis.good);
    console.log("Acceptable (< 2m):", analysis.acceptable);

    // Save results
    const fs = require('fs');
    const allResults = {
      ...results,
      analysis,
      timestamp: new Date().toISOString(),
      network: hre.network.name
    };
    
    fs.writeFileSync('performance-results.json', JSON.stringify(allResults, null, 2));
    console.log("Performance results saved to performance-results.json");

  } catch (error) {
    console.error("Performance test failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

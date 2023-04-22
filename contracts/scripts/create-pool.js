const { ethers } = require("hardhat");

async function main() {
  console.log("Creating a new prize pool...");

  // Get the contract factory
  const PoolFactory = await ethers.getContractFactory("PoolFactory");
  
  // Get the deployed factory address from environment or use a default
  const factoryAddress = process.env.POOL_FACTORY_ADDRESS;
  if (!factoryAddress) {
    console.error("Please set POOL_FACTORY_ADDRESS environment variable");
    process.exit(1);
  }

  const poolFactory = PoolFactory.attach(factoryAddress);

  // Pool parameters
  const poolParams = {
    name: process.env.POOL_NAME || "Test Pool",
    minParticipation: ethers.utils.parseEther(process.env.MIN_PARTICIPATION || "0.01"),
    winProbability: process.env.WIN_PROBABILITY || "1",
    winProbabilityDenominator: process.env.WIN_PROBABILITY_DENOMINATOR || "10",
    platformFeePercentage: process.env.PLATFORM_FEE_PERCENTAGE || "20",
    duration: process.env.DURATION || "0", // 0 for no time limit
  };

  const initialFunding = ethers.utils.parseEther(process.env.INITIAL_FUNDING || "0.1");

  console.log("Pool parameters:", {
    ...poolParams,
    minParticipation: ethers.utils.formatEther(poolParams.minParticipation),
    initialFunding: ethers.utils.formatEther(initialFunding),
  });

  // Create the pool
  const tx = await poolFactory.createPool(
    poolParams.name,
    poolParams.minParticipation,
    poolParams.winProbability,
    poolParams.winProbabilityDenominator,
    poolParams.platformFeePercentage,
    poolParams.duration,
    { value: initialFunding }
  );

  console.log("Transaction hash:", tx.hash);
  
  const receipt = await tx.wait();
  console.log("Transaction confirmed in block:", receipt.blockNumber);

  // Get the pool address from the event
  const event = receipt.events.find(e => e.event === 'PoolCreated');
  if (event) {
    const poolAddress = event.args.poolAddress;
    console.log("Pool created at address:", poolAddress);
    
    // Save pool address to file
    const fs = require('fs');
    const poolData = {
      address: poolAddress,
      name: poolParams.name,
      minParticipation: ethers.utils.formatEther(poolParams.minParticipation),
      winProbability: poolParams.winProbability,
      winProbabilityDenominator: poolParams.winProbabilityDenominator,
      platformFeePercentage: poolParams.platformFeePercentage,
      duration: poolParams.duration,
      initialFunding: ethers.utils.formatEther(initialFunding),
      createdAt: new Date().toISOString(),
    };
    
    fs.writeFileSync('pool-created.json', JSON.stringify(poolData, null, 2));
    console.log("Pool data saved to pool-created.json");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

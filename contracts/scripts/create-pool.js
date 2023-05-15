const hre = require("hardhat");

async function main() {
  const poolFactoryAddress = process.env.POOL_FACTORY_ADDRESS;
  
  if (!poolFactoryAddress) {
    console.error("Please set POOL_FACTORY_ADDRESS environment variable");
    process.exit(1);
  }

  // Pool parameters
  const poolName = process.env.POOL_NAME || "Test Pool";
  const minParticipation = process.env.MIN_PARTICIPATION || "0.01";
  const winProbability = process.env.WIN_PROBABILITY || "10";
  const platformFeePercent = process.env.PLATFORM_FEE_PERCENT || "5";
  const duration = process.env.DURATION || "7"; // days
  const initialFunding = process.env.INITIAL_FUNDING || "0.1";

  console.log("Creating pool with parameters:");
  console.log("- Name:", poolName);
  console.log("- Min Participation:", minParticipation, "ETH");
  console.log("- Win Probability:", winProbability, "%");
  console.log("- Platform Fee:", platformFeePercent, "%");
  console.log("- Duration:", duration, "days");
  console.log("- Initial Funding:", initialFunding, "ETH");

  // Get the PoolFactory contract
  const PoolFactory = await hre.ethers.getContractFactory("PoolFactory");
  const poolFactory = PoolFactory.attach(poolFactoryAddress);

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Create the pool
  const tx = await poolFactory.createPool(
    poolName,
    hre.ethers.parseEther(minParticipation),
    winProbability,
    platformFeePercent,
    parseInt(duration) * 24 * 60 * 60, // Convert days to seconds
    {
      value: hre.ethers.parseEther(initialFunding)
    }
  );

  console.log("Transaction submitted:", tx.hash);
  
  const receipt = await tx.wait();
  console.log("Transaction confirmed in block:", receipt.blockNumber);

  // Get the created pool address from the event
  const poolCreatedEvent = receipt.logs.find(
    log => log.fragment && log.fragment.name === "PoolCreated"
  );

  if (poolCreatedEvent) {
    const poolAddress = poolCreatedEvent.args[0];
    console.log("Pool created successfully!");
    console.log("Pool address:", poolAddress);
    console.log("Creator:", poolCreatedEvent.args[1]);
    console.log("Name:", poolCreatedEvent.args[2]);
  } else {
    console.error("PoolCreated event not found in transaction receipt");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

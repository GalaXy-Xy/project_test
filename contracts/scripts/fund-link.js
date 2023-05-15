const hre = require("hardhat");

async function main() {
  const poolAddress = process.env.POOL_ADDRESS;
  const linkAmount = process.env.LINK_AMOUNT || "1"; // Default 1 LINK
  
  if (!poolAddress) {
    console.error("Please set POOL_ADDRESS environment variable");
    process.exit(1);
  }

  console.log(`Funding pool ${poolAddress} with ${linkAmount} LINK...`);

  // Get the LINK token contract
  const linkTokenAddress = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709"; // Sepolia LINK
  const linkToken = await hre.ethers.getContractAt("IERC20", linkTokenAddress);

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Check LINK balance
  const balance = await linkToken.balanceOf(deployer.address);
  console.log("LINK balance:", hre.ethers.formatEther(balance));

  if (balance < hre.ethers.parseEther(linkAmount)) {
    console.error("Insufficient LINK balance");
    process.exit(1);
  }

  // Transfer LINK to the pool
  const tx = await linkToken.transfer(poolAddress, hre.ethers.parseEther(linkAmount));
  await tx.wait();

  console.log("LINK transferred successfully!");
  console.log("Transaction hash:", tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

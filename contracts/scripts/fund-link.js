const { ethers } = require("hardhat");

async function main() {
  console.log("Funding VRF subscription with LINK tokens...");

  // VRF configuration for Sepolia
  const VRF_COORDINATOR = "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625";
  const LINK_TOKEN = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709";
  const SUBSCRIPTION_ID = process.env.VRF_SUBSCRIPTION_ID;
  const FUND_AMOUNT = process.env.FUND_AMOUNT || "2"; // 2 LINK tokens

  if (!SUBSCRIPTION_ID) {
    console.error("Please set VRF_SUBSCRIPTION_ID environment variable");
    process.exit(1);
  }

  // Get signer
  const [deployer] = await ethers.getSigners();
  console.log("Funding with account:", deployer.address);

  // Check balance
  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance), "ETH");

  // Get LINK token contract
  const linkToken = await ethers.getContractAt(
    "LinkTokenInterface",
    LINK_TOKEN
  );

  // Check LINK balance
  const linkBalance = await linkToken.balanceOf(deployer.address);
  console.log("LINK balance:", ethers.utils.formatEther(linkBalance), "LINK");

  if (linkBalance.lt(ethers.utils.parseEther(FUND_AMOUNT))) {
    console.error(`Insufficient LINK balance. Need ${FUND_AMOUNT} LINK, have ${ethers.utils.formatEther(linkBalance)} LINK`);
    console.log("Please get LINK tokens from: https://faucets.chain.link/sepolia");
    process.exit(1);
  }

  // Fund the subscription
  const fundAmount = ethers.utils.parseEther(FUND_AMOUNT);
  console.log(`Funding subscription ${SUBSCRIPTION_ID} with ${FUND_AMOUNT} LINK...`);

  const tx = await linkToken.transferAndCall(
    VRF_COORDINATOR,
    fundAmount,
    ethers.utils.defaultAbiCoder.encode(["uint64"], [SUBSCRIPTION_ID])
  );

  console.log("Transaction hash:", tx.hash);
  const receipt = await tx.wait();
  console.log("Transaction confirmed in block:", receipt.blockNumber);

  // Verify funding
  const vrfCoordinator = await ethers.getContractAt(
    "VRFCoordinatorV2Interface",
    VRF_COORDINATOR
  );

  const subscription = await vrfCoordinator.getSubscription(SUBSCRIPTION_ID);
  console.log("Subscription balance:", ethers.utils.formatEther(subscription.balance), "LINK");

  console.log("VRF subscription funded successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

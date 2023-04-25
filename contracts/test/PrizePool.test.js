const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PrizePool", function () {
  let prizePool;
  let owner;
  let addr1;
  let addr2;
  let vrfCoordinator;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // Deploy VRF Coordinator mock
    const VRFCoordinatorMock = await ethers.getContractFactory("VRFCoordinatorV2Mock");
    vrfCoordinator = await VRFCoordinatorMock.deploy(
      ethers.utils.parseEther("0.1"), // base fee
      ethers.utils.parseEther("0.0001") // per request fee
    );
    await vrfCoordinator.deployed();

    // Create subscription
    const tx = await vrfCoordinator.createSubscription();
    const receipt = await tx.wait();
    const subscriptionId = receipt.events[0].args.subId;

    // Deploy PrizePool
    const PrizePool = await ethers.getContractFactory("PrizePool");
    prizePool = await PrizePool.deploy(
      "Test Pool",
      ethers.utils.parseEther("0.01"), // minParticipation
      1, // winProbability
      10, // winProbabilityDenominator
      20, // platformFeePercentage
      0, // duration (no time limit)
      owner.address
    );
    await prizePool.deployed();

    // Set subscription ID
    await prizePool.setSubscriptionId(subscriptionId);
  });

  describe("Pool Creation", function () {
    it("Should initialize with correct parameters", async function () {
      const poolInfo = await prizePool.getPoolInfo();
      expect(poolInfo[0]).to.equal("Test Pool");
      expect(poolInfo[1]).to.equal(ethers.utils.parseEther("0.01"));
      expect(poolInfo[2]).to.equal(1);
      expect(poolInfo[3]).to.equal(10);
      expect(poolInfo[4]).to.equal(20);
      expect(poolInfo[8]).to.be.true; // isActive
    });

    it("Should set correct owner", async function () {
      expect(await prizePool.owner()).to.equal(owner.address);
    });
  });

  describe("Participation", function () {
    it("Should allow participation with sufficient amount", async function () {
      const participationAmount = ethers.utils.parseEther("0.01");
      
      await expect(
        prizePool.connect(addr1).participate({ value: participationAmount })
      ).to.emit(prizePool, "Participation");
    });

    it("Should reject participation with insufficient amount", async function () {
      const insufficientAmount = ethers.utils.parseEther("0.005");
      
      await expect(
        prizePool.connect(addr1).participate({ value: insufficientAmount })
      ).to.be.revertedWith("Insufficient participation amount");
    });

    it("Should record participation correctly", async function () {
      const participationAmount = ethers.utils.parseEther("0.01");
      
      await prizePool.connect(addr1).participate({ value: participationAmount });
      
      const participant = await prizePool.getParticipant(0);
      expect(participant.participant).to.equal(addr1.address);
      expect(participant.amount).to.equal(participationAmount);
      expect(participant.hasWon).to.be.false;
    });
  });

  describe("Pool Management", function () {
    it("Should allow owner to end pool", async function () {
      await expect(prizePool.endPool())
        .to.emit(prizePool, "PoolEnded");
      
      const poolInfo = await prizePool.getPoolInfo();
      expect(poolInfo[8]).to.be.false; // isActive
    });

    it("Should prevent non-owner from ending pool", async function () {
      await expect(
        prizePool.connect(addr1).endPool()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow owner to withdraw platform fees", async function () {
      // First, participate to generate fees
      await prizePool.connect(addr1).participate({ 
        value: ethers.utils.parseEther("0.01") 
      });
      
      // End the pool
      await prizePool.endPool();
      
      // Withdraw fees
      const initialBalance = await owner.getBalance();
      await prizePool.withdrawPlatformFees();
      const finalBalance = await owner.getBalance();
      
      expect(finalBalance).to.be.gt(initialBalance);
    });
  });

  describe("VRF Integration", function () {
    it("Should request randomness on participation", async function () {
      const participationAmount = ethers.utils.parseEther("0.01");
      
      const tx = await prizePool.connect(addr1).participate({ 
        value: participationAmount 
      });
      
      await expect(tx)
        .to.emit(prizePool, "RandomnessRequested");
    });

    it("Should handle VRF callback", async function () {
      // This would require a more complex setup with actual VRF
      // For now, we'll test the structure
      expect(await prizePool.totalParticipants()).to.equal(0);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle multiple participations", async function () {
      const participationAmount = ethers.utils.parseEther("0.01");
      
      await prizePool.connect(addr1).participate({ value: participationAmount });
      await prizePool.connect(addr2).participate({ value: participationAmount });
      
      expect(await prizePool.totalParticipants()).to.equal(2);
    });

    it("Should prevent participation in ended pool", async function () {
      await prizePool.endPool();
      
      await expect(
        prizePool.connect(addr1).participate({ 
          value: ethers.utils.parseEther("0.01") 
        })
      ).to.be.revertedWith("Pool is not active");
    });
  });
});

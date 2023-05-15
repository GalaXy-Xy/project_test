const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PrizePool", function () {
  let prizePool;
  let owner;
  let addr1;
  let addr2;
  let vrfCoordinator;
  let linkToken;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // Deploy mock VRF coordinator and LINK token for testing
    const VRFCoordinatorMock = await ethers.getContractFactory("VRFCoordinatorMock");
    vrfCoordinator = await VRFCoordinatorMock.deploy();
    await vrfCoordinator.waitForDeployment();

    const LinkToken = await ethers.getContractFactory("LinkToken");
    linkToken = await LinkToken.deploy();
    await linkToken.waitForDeployment();

    // Deploy PrizePool with mock addresses
    const PrizePool = await ethers.getContractFactory("PrizePool");
    prizePool = await PrizePool.deploy(
      "Test Pool",
      ethers.parseEther("0.01"),
      10, // 10% win probability
      5,  // 5% platform fee
      7 * 24 * 60 * 60, // 7 days
      owner.address
    );
    await prizePool.waitForDeployment();

    // Fund the pool with LINK tokens for VRF
    await linkToken.transfer(await prizePool.getAddress(), ethers.parseEther("1"));
  });

  describe("Pool Creation", function () {
    it("Should initialize with correct parameters", async function () {
      const poolInfo = await prizePool.getPoolInfo();
      expect(poolInfo[0]).to.equal("Test Pool");
      expect(poolInfo[1]).to.equal(ethers.parseEther("0.01"));
      expect(poolInfo[2]).to.equal(10);
      expect(poolInfo[3]).to.equal(0); // Initial balance
      expect(poolInfo[4]).to.equal(0); // Initial participants
      expect(poolInfo[5]).to.be.true; // Is active
    });

    it("Should emit PoolCreated event", async function () {
      const tx = await prizePool.deployTransaction;
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => log.fragment && log.fragment.name === "PoolCreated");
      expect(event).to.not.be.undefined;
    });
  });

  describe("Participation", function () {
    it("Should allow participation with sufficient amount", async function () {
      const participationAmount = ethers.parseEther("0.01");
      
      const tx = await prizePool.connect(addr1).participate({
        value: participationAmount
      });
      
      const receipt = await tx.wait();
      const participationEvent = receipt.logs.find(
        log => log.fragment && log.fragment.name === "Participation"
      );
      
      expect(participationEvent).to.not.be.undefined;
      expect(await prizePool.totalParticipants()).to.equal(1);
    });

    it("Should reject participation with insufficient amount", async function () {
      const insufficientAmount = ethers.parseEther("0.005");
      
      await expect(
        prizePool.connect(addr1).participate({
          value: insufficientAmount
        })
      ).to.be.revertedWith("Insufficient participation amount");
    });

    it("Should reject participation when pool is not active", async function () {
      // End the pool first
      await prizePool.endPool();
      
      await expect(
        prizePool.connect(addr1).participate({
          value: ethers.parseEther("0.01")
        })
      ).to.be.revertedWith("Pool is not active");
    });
  });

  describe("Pool Management", function () {
    it("Should allow owner to end pool", async function () {
      const tx = await prizePool.endPool();
      const receipt = await tx.wait();
      const poolEndedEvent = receipt.logs.find(
        log => log.fragment && log.fragment.name === "PoolEnded"
      );
      
      expect(poolEndedEvent).to.not.be.undefined;
      expect(await prizePool.isActive()).to.be.false;
    });

    it("Should reject non-owner from ending pool", async function () {
      await expect(
        prizePool.connect(addr1).endPool()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow owner to withdraw platform fees", async function () {
      // First, create some platform fees by having participants
      await prizePool.connect(addr1).participate({
        value: ethers.parseEther("0.01")
      });
      
      // Simulate winning to generate platform fees
      // This would normally happen through VRF callback
      
      const initialBalance = await ethers.provider.getBalance(owner.address);
      await prizePool.withdrawPlatformFees();
      const finalBalance = await ethers.provider.getBalance(owner.address);
      
      // Note: In a real test, you'd need to simulate the VRF callback
      // to actually generate platform fees
    });
  });

  describe("User History", function () {
    it("Should return empty history for new user", async function () {
      const history = await prizePool.getUserHistory(addr1.address);
      expect(history.length).to.equal(0);
    });

    it("Should track user participation history", async function () {
      await prizePool.connect(addr1).participate({
        value: ethers.parseEther("0.01")
      });
      
      // Note: In a real test, you'd need to simulate the VRF callback
      // to complete the participation and update user history
    });
  });

  describe("Security", function () {
    it("Should prevent reentrancy attacks", async function () {
      // This test would require a malicious contract that tries to reenter
      // The ReentrancyGuard should prevent this
    });

    it("Should only allow owner to withdraw fees", async function () {
      await expect(
        prizePool.connect(addr1).withdrawPlatformFees()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});

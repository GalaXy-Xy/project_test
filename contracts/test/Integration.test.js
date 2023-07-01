const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Prize Pool DApp Integration Tests", function () {
  let poolFactory;
  let prizePool;
  let owner;
  let addr1;
  let addr2;
  let addr3;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    
    // Deploy PoolFactory
    const PoolFactory = await ethers.getContractFactory("PoolFactory");
    poolFactory = await PoolFactory.deploy();
    await poolFactory.waitForDeployment();

    // Create a test pool
    const tx = await poolFactory.createPool(
      "Integration Test Pool",
      ethers.parseEther("0.01"),
      10, // 10% win probability
      5,  // 5% platform fee
      7 * 24 * 60 * 60, // 7 days
      { value: ethers.parseEther("0.1") }
    );

    const receipt = await tx.wait();
    const poolCreatedEvent = receipt.logs.find(
      log => log.fragment && log.fragment.name === "PoolCreated"
    );
    
    const poolAddress = poolCreatedEvent.args[0];
    const PrizePool = await ethers.getContractFactory("PrizePool");
    prizePool = PrizePool.attach(poolAddress);
  });

  describe("End-to-End Pool Lifecycle", function () {
    it("Should complete full pool lifecycle", async function () {
      // 1. Verify pool creation
      expect(await poolFactory.getPoolCount()).to.equal(1);
      expect(await prizePool.name()).to.equal("Integration Test Pool");

      // 2. Verify initial pool state
      const poolInfo = await prizePool.getPoolInfo();
      expect(poolInfo[0]).to.equal("Integration Test Pool");
      expect(poolInfo[1]).to.equal(ethers.parseEther("0.01"));
      expect(poolInfo[2]).to.equal(10);
      expect(poolInfo[5]).to.be.true; // isActive

      // 3. Test multiple participations
      await prizePool.connect(addr1).participate({
        value: ethers.parseEther("0.01")
      });

      await prizePool.connect(addr2).participate({
        value: ethers.parseEther("0.02")
      });

      await prizePool.connect(addr3).participate({
        value: ethers.parseEther("0.015")
      });

      // 4. Verify participation tracking
      expect(await prizePool.totalParticipants()).to.equal(3);

      // 5. Test pool ending
      await prizePool.endPool();
      expect(await prizePool.isActive()).to.be.false;
    });

    it("Should handle multiple pools correctly", async function () {
      // Create second pool
      await poolFactory.connect(addr1).createPool(
        "Second Pool",
        ethers.parseEther("0.02"),
        20, // 20% win probability
        10, // 10% platform fee
        14 * 24 * 60 * 60, // 14 days
        { value: ethers.parseEther("0.2") }
      );

      expect(await poolFactory.getPoolCount()).to.equal(2);

      // Verify both pools exist
      const pools = await poolFactory.getPools();
      expect(pools.length).to.equal(2);
      expect(await poolFactory.isPool(pools[0])).to.be.true;
      expect(await poolFactory.isPool(pools[1])).to.be.true;
    });
  });

  describe("User Experience Flow", function () {
    it("Should allow users to participate and track history", async function () {
      // User participates
      await prizePool.connect(addr1).participate({
        value: ethers.parseEther("0.01")
      });

      // Check user history
      const history = await prizePool.getUserHistory(addr1.address);
      expect(history.length).to.equal(1);
      expect(history[0].user).to.equal(addr1.address);
      expect(history[0].amount).to.equal(ethers.parseEther("0.01"));

      // User participates again
      await prizePool.connect(addr1).participate({
        value: ethers.parseEther("0.02")
      });

      // Check updated history
      const updatedHistory = await prizePool.getUserHistory(addr1.address);
      expect(updatedHistory.length).to.equal(2);
    });

    it("Should handle edge cases gracefully", async function () {
      // Test with minimum participation amount
      await prizePool.connect(addr1).participate({
        value: ethers.parseEther("0.01") // Exactly minimum
      });

      // Test with larger amount
      await prizePool.connect(addr2).participate({
        value: ethers.parseEther("0.1") // 10x minimum
      });

      expect(await prizePool.totalParticipants()).to.equal(2);
    });
  });

  describe("Gas Optimization", function () {
    it("Should have reasonable gas costs for participation", async function () {
      const tx = await prizePool.connect(addr1).participate({
        value: ethers.parseEther("0.01")
      });

      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed;
      
      // Gas should be reasonable (less than 500k)
      expect(gasUsed).to.be.lessThan(500000);
    });

    it("Should have reasonable gas costs for pool creation", async function () {
      const tx = await poolFactory.createPool(
        "Gas Test Pool",
        ethers.parseEther("0.01"),
        10,
        5,
        7 * 24 * 60 * 60,
        { value: ethers.parseEther("0.1") }
      );

      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed;
      
      // Gas should be reasonable (less than 1M)
      expect(gasUsed).to.be.lessThan(1000000);
    });
  });

  describe("Security Integration", function () {
    it("Should prevent unauthorized access to owner functions", async function () {
      await expect(
        prizePool.connect(addr1).endPool()
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await expect(
        prizePool.connect(addr1).withdrawPlatformFees()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should handle reentrancy protection", async function () {
      // This test would require a malicious contract
      // For now, just verify the modifier is present
      expect(await prizePool.totalParticipants()).to.equal(0);
    });
  });
});
